import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const QWEN_API_KEY = "sk-ws-djI.JxPS9bQ91ImllSAfJDIGXOIbJawdvryDbQKiTxz0WUd2wqzX2hdsaqR8YufwUNY8lFJ5G4XIncAxOC7WYctFFgeLbxpo8hDNT2ssB9sV8nQULsL9_mJfVNfvM4HEZSIN.MEUCIQClBCmXfQ9hY--CqILP8u2k16DBoqkrtKt6lLYw8yWT2AIgWoSkJIERmXCaPF8T6HDZ6D6qMa_Q3qigysmCSQyG6l0";

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
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-tutor error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
