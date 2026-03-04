import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const POPUNDER_URL = "https://pl28568529.effectivegatecpm.com/49/32/04/493204385b6c8fd92119aadfe195e983.js";
const ADSENSE_URL = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2521379140148689";

const jsResponse = (code: string) =>
  new Response(code, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("t") || "banner";
    const key = url.searchParams.get("k") || "";

    if (type === "banner") {
      if (!/^[a-z0-9]{16,64}$/i.test(key)) {
        return new Response("Invalid banner key", { status: 400, headers: corsHeaders });
      }

      const target = `https://www.highperformanceformat.com/${key}/invoke.js`;
      const bootstrap = `
(function () {
  try {
    var s = document.createElement('script');
    s.src = ${JSON.stringify(target)};
    s.async = true;
    var parent = document.currentScript && document.currentScript.parentNode;
    (parent || document.head || document.documentElement).appendChild(s);
  } catch (_) {}
})();`;

      return jsResponse(bootstrap);
    }

    if (type === "pop") {
      const bootstrap = `
(function () {
  try {
    var s = document.createElement('script');
    s.src = ${JSON.stringify(POPUNDER_URL)};
    s.async = true;
    (document.head || document.documentElement).appendChild(s);
  } catch (_) {}
})();`;

      return jsResponse(bootstrap);
    }

    if (type === "adsense") {
      const bootstrap = `
(function () {
  try {
    var s = document.createElement('script');
    s.src = ${JSON.stringify(ADSENSE_URL)};
    s.async = true;
    s.crossOrigin = 'anonymous';
    (document.head || document.documentElement).appendChild(s);
  } catch (_) {}
})();`;

      return jsResponse(bootstrap);
    }

    return new Response("Invalid type", { status: 400, headers: corsHeaders });
  } catch (error) {
    console.error("serve-script error", error);
    return new Response("Error", { status: 500, headers: corsHeaders });
  }
});
