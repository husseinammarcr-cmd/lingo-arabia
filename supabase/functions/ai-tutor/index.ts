import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_MESSAGES = 20;
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
      return new Response(JSON.stringify({ error: "غير مصرح" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse body early (before consuming it)
    const body = await req.json();
    const { messages } = body;
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check rate limit using service role client
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const now = new Date();
    const windowStart = new Date(now.getTime() - WINDOW_HOURS * 60 * 60 * 1000);

    const { data: usage } = await adminClient
      .from("ai_tutor_usage")
      .select("*")
      .eq("user_id", user.id)
      .single();

    let currentCount = 0;

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
        // Increment
        await adminClient
          .from("ai_tutor_usage")
          .update({ message_count: currentCount + 1 })
          .eq("user_id", user.id);
        currentCount += 1;
      } else {
        // Window expired, reset
        await adminClient
          .from("ai_tutor_usage")
          .update({ message_count: 1, window_start: now.toISOString() })
          .eq("user_id", user.id);
        currentCount = 1;
      }
    } else {
      // First time
      await adminClient
        .from("ai_tutor_usage")
        .insert({ user_id: user.id, message_count: 1, window_start: now.toISOString() });
      currentCount = 1;
    }

    // messages already parsed above

    const QWEN_API_KEY = Deno.env.get("QWEN_API_KEY") || "sk-ws-djI.JxPS9bQ91ImllSAfJDIGXOIbJawdvryDbQKiTxz0WUd2wqzX2hdsaqR8YufwUNY8lFJ5G4XIncAxOC7WYctFFgeLbxpo8hDNT2ssB9sV8nQULsL9_mJfVNfvM4HEZSIN.MEUCIQClBCmXfQ9hY--CqILP8u2k16DBoqkrtKt6lLYw8yWT2AIgWoSkJIERmXCaPF8T6HDZ6D6qMa_Q3qigysmCSQyG6l0";

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

    // Add remaining count as a custom header
    const remaining = MAX_MESSAGES - currentCount;
    
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
