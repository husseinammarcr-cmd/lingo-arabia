import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "popunder";

  try {
    let scriptContent = "";

    if (type === "banner") {
      // Banner ad script
      scriptContent = `
        (function() {
          try {
            var s = document.createElement('script');
            s.src = 'https://highperformanceformat.com/act/files/tag.min.js?z=8416498';
            s.setAttribute('data-cfasync', 'false');
            s.async = true;
            document.currentScript.parentNode.appendChild(s);
          } catch(e) {}
        })();
      `;
    } else {
      // Popunder ad script
      scriptContent = `
        (function() {
          try {
            var s = document.createElement('script');
            s.src = 'https://effectivegatecpm.com/act/files/tag.min.js?z=8416504';
            s.setAttribute('data-cfasync', 'false');
            s.async = true;
            document.head.appendChild(s);
          } catch(e) {}
        })();
      `;
    }

    return new Response(scriptContent, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/javascript",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    return new Response("// error", {
      headers: { ...corsHeaders, "Content-Type": "application/javascript" },
    });
  }
});
