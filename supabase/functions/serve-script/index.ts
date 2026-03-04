import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, authorization, x-client-info, apikey, content-type",
};

// Allowlist of ad script URLs mapped by short keys
const SCRIPT_MAP: Record<string, string> = {
  // Banner ad invoke script
  "banner": "https://www.highperformanceformat.com/{id}/invoke.js",
  // Popunder script
  "pop": "https://pl28568529.effectivegatecpm.com/49/32/04/493204385b6c8fd92119aadfe195e983.js",
  // AdSense
  "adsense": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2521379140148689",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("t") || "banner";
    const scriptKey = url.searchParams.get("k");

    let targetUrl: string;

    if (type === "banner" && scriptKey) {
      targetUrl = SCRIPT_MAP["banner"].replace("{id}", scriptKey);
    } else if (SCRIPT_MAP[type]) {
      targetUrl = SCRIPT_MAP[type];
    } else {
      return new Response("Invalid type", { status: 400, headers: corsHeaders });
    }

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": req.headers.get("user-agent") || "Mozilla/5.0",
        "Referer": req.headers.get("referer") || "https://lingoarab.com/",
      },
    });
    
    let scriptContent = await response.text();

    console.log("serve-script", {
      type,
      targetUrl,
      upstreamStatus: response.status,
      contentLength: scriptContent.length,
    });

    return new Response(scriptContent, {
      status: response.ok ? 200 : response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new Response("Error", { status: 500, headers: corsHeaders });
  }
});
