import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Expose-Headers": "X-Remaining-Messages",
};

const MAX_MESSAGES = 5;
const WINDOW_HOURS = 4;

const SYSTEM_PROMPT = `أنت معلم إنجليزية اسمك "معلم LingoArab". تعلّم الإنجليزية للناطقين بالعربية فقط.

قواعد مهمة:
- أجب بإجابات قصيرة ومبسطة جداً (3-5 أسطر كحد أقصى).
- لا تكرر ولا تطيل الشرح. ادخل في صلب الموضوع مباشرة.
- إذا سُئلت عن غير الإنجليزية، اعتذر بجملة واحدة.
- استخدم العربية للشرح والإنجليزية للأمثلة.
- اكتب النطق بالعربية بين قوسين عند الحاجة.
- استخدم رموز تعبيرية باعتدال 📚
- صحح الأخطاء بلطف وباختصار.

أسلوبك: مختصر، واضح، ودود.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Get user from JWT
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader ?? "" } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "غير مصرح" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { messages } = body;
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role client for usage tracking (bypasses RLS)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const now = new Date();
    const windowStart = new Date(now.getTime() - WINDOW_HOURS * 60 * 60 * 1000);

    // Get current usage
    const { data: usage, error: usageError } = await adminClient
      .from("ai_tutor_usage")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (usageError) {
      console.error("Usage fetch error:", usageError);
    }

    let currentCount = 0;
    let remaining = MAX_MESSAGES;

    if (usage) {
      const usageWindowStart = new Date(usage.window_start);
      if (usageWindowStart > windowStart) {
        // Still within the window
        currentCount = usage.message_count;
        if (currentCount >= MAX_MESSAGES) {
          const resetTime = new Date(usageWindowStart.getTime() + WINDOW_HOURS * 60 * 60 * 1000);
          const minutesLeft = Math.ceil((resetTime.getTime() - now.getTime()) / 60000);
          return new Response(JSON.stringify({ 
            error: `لقد وصلت للحد الأقصى (${MAX_MESSAGES} رسالة). يتم التجديد بعد ${minutesLeft} دقيقة.`,
            rateLimited: true,
            remaining: 0,
            resetMinutes: minutesLeft,
          }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        // Increment count
        const { error: updateError } = await adminClient
          .from("ai_tutor_usage")
          .update({ message_count: currentCount + 1 })
          .eq("id", usage.id);
        if (updateError) {
          console.error("Usage update error:", updateError);
        }
        currentCount += 1;
      } else {
        // Window expired, reset
        const { error: resetError } = await adminClient
          .from("ai_tutor_usage")
          .update({ message_count: 1, window_start: now.toISOString() })
          .eq("id", usage.id);
        if (resetError) {
          console.error("Usage reset error:", resetError);
        }
        currentCount = 1;
      }
    } else {
      // First time user - insert new record
      const { error: insertError } = await adminClient
        .from("ai_tutor_usage")
        .insert({ user_id: user.id, message_count: 1, window_start: now.toISOString() });
      if (insertError) {
        console.error("Usage insert error:", insertError);
      }
      currentCount = 1;
    }

    remaining = MAX_MESSAGES - currentCount;

const QWEN_API_KEY = Deno.env.get("QWEN_API_KEY");

if (!QWEN_API_KEY) {
  console.error("Missing QWEN_API_KEY");
  return new Response(
    JSON.stringify({ error: "AI key not configured" }),
    { status: 500, headers: corsHeaders }
  );
}

    const response = await fetch(
      "https://ws-wx9ta73sr81o5bda.eu-central-1.maas.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${QWEN_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen3.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Qwen API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "حدث خطأ في الاتصال بالذكاء الاصطناعي" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        "X-Remaining-Messages": remaining.toString(),
      },
    });
  } catch (e) {
    console.error("ai-tutor error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
