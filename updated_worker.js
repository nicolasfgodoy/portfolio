const R2_PUBLIC_URL = "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev";

const CANONICAL_ORDER = [
  "ryutherunner",
  "dubatuq-feat-99",
  "burguerexpo-dia-1",
  "burgerexpo-dia-2",
  "supernova",
  "peers-band-01",
  "vulgofk",
  "peers-band-02",
  "dubatuq",
  "finesse-01",
  "finesse-02",
  "beco-do-espeto",
  "expopizzaria-dia-1",
  "expopizzaria-dia-2",
  "quizomba",
  "dubatuq-feat-shopee",
  "djkimcotrim"
];

const DEFAULT_TAGS = ["Shows", "Trap", "Aftermovie", "Recap", "Noturno", "4K", "Dynamic", "Color Grading", "S-Log", "Corporativo", "Casamentos", "Baladas", "Pagode", "Bloco"];
const DEFAULT_LOCATIONS = ["São Paulo, BR", "Beco do Espeto", "Cervejaria Tarantino"];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // GET Admin
    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/admin")) {
      const asset = await env.MY_BUCKET.get("assets/admin.html");
      if (asset) {
        return new Response(await asset.text(), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" }
        });
      }
      return new Response("Admin nao encontrado no R2", { status: 404, headers: corsHeaders });
    }

    // GET Gerador
    if (request.method === "GET" && url.pathname === "/gerador") {
      const asset = await env.MY_BUCKET.get("assets/gerador.html");
      if (asset) {
        return new Response(await asset.text(), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" }
        });
      }
      return new Response("Gerador nao encontrado no R2", { status: 404, headers: corsHeaders });
    }

    // GET Orcamento or subpages (/orcamento, /orcamento1, /orcamento2, /orcamento-paola, etc.)
    if (request.method === "GET" && !url.pathname.startsWith("/api/")) {
      const asset = await env.MY_BUCKET.get("assets/orcamento.html");
      if (asset) {
        return new Response(await asset.text(), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" }
        });
      }
      return new Response("Orcamento nao encontrado no R2", { status: 404, headers: corsHeaders });
    }

    // Global Metadata (Tags & Locations Database)
    if (request.method === "GET" && url.pathname === "/api/global-metadata") {
      try {
        const metaObj = await env.MY_BUCKET.get("global-metadata.json");
        if (metaObj) {
          const data = await metaObj.json();
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        return new Response(JSON.stringify({ tags: DEFAULT_TAGS, locations: DEFAULT_LOCATIONS }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ tags: DEFAULT_TAGS, locations: DEFAULT_LOCATIONS }), { status: 200, headers: corsHeaders });
      }
    }

    if (request.method === "POST" && url.pathname === "/api/global-metadata") {
      try {
        const metaData = await request.json();
        await env.MY_BUCKET.put("global-metadata.json", JSON.stringify(metaData), {
          httpMetadata: { contentType: "application/json" }
        });
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    async function getProjectsFromR2() {
      let allObjects = [];
      let cursor = undefined;
      do {
        const list = await env.MY_BUCKET.list({
          prefix: "projetos/",
          cursor: cursor
        });
        allObjects.push(...list.objects);
        cursor = list.truncated ? list.cursor : undefined;
      } while (cursor);

      const folders = [...new Set(allObjects.map(o => o.key.split("/")[1]))].filter(Boolean);
      const projectMap = new Map();

      for (const folder of folders) {
        const folderFiles = allObjects.filter(o => o.key.startsWith("projetos/" + folder + "/"));
        const hasPreview = folderFiles.some(o => o.key === "projetos/" + folder + "/preview.mp4");
        const hasVideo = folderFiles.some(o => o.key === "projetos/" + folder + "/video.mp4");

        if (!hasPreview || !hasVideo) continue;

        const tagObj = await env.MY_BUCKET.get("projetos/" + folder + "/tags.txt");
        let title = "@" + folder;
        let category = "Geral";
        let location = "São Paulo, BR";
        let tags = ["4K", "Dynamic", "Color Grading", "S-Log"];

        if (tagObj) {
          const text = await tagObj.text();
          text.split("\n").forEach(l => {
            if (l.startsWith("Título:")) title = l.replace("Título:", "").trim();
            if (l.startsWith("Local:")) location = l.replace("Local:", "").trim();
            if (l.startsWith("Categoria:")) category = l.replace("Categoria:", "").trim();
            if (l.startsWith("Tags:")) tags = l.replace("Tags:", "").split(",").map(t => t.trim()).filter(Boolean);
          });
        }

        projectMap.set(folder, {
          id: folder,
          slug: folder,
          title,
          category,
          location,
          tags,
          thumbnail: R2_PUBLIC_URL + "/projetos/" + folder + "/preview.mp4",
          videoUrl: R2_PUBLIC_URL + "/projetos/" + folder + "/video.mp4"
        });
      }

      const orderedProjects = [];
      for (const slug of CANONICAL_ORDER) {
        if (projectMap.has(slug)) {
          orderedProjects.push(projectMap.get(slug));
          projectMap.delete(slug);
        }
      }
      for (const item of projectMap.values()) {
        orderedProjects.push(item);
      }

      return orderedProjects;
    }

    if (request.method === "GET" && (url.pathname === "/api/r2-library" || url.pathname === "/api/portfolio-config")) {
      try {
        const configObj = await env.MY_BUCKET.get("portfolio-config.json");
        if (configObj) {
          const data = await configObj.json();
          if (Array.isArray(data) && data.length > 0 && data.every(i => (i.thumbnail || "").includes("/projetos/"))) {
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
          }
        }

        const projects = await getProjectsFromR2();
        return new Response(JSON.stringify(projects), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    if (request.method === "POST" && url.pathname === "/api/portfolio-config") {
      try {
        const configData = await request.json();
        await env.MY_BUCKET.put("portfolio-config.json", JSON.stringify(configData), {
          httpMetadata: { contentType: "application/json" }
        });
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    if (request.method === "POST" && url.pathname === "/api/save-tags") {
      try {
        const { slug, title, category, location, tags } = await request.json();
        if (!slug) {
          return new Response(JSON.stringify({ error: "slug is required" }), { status: 400, headers: corsHeaders });
        }
        const fileContent = [
          "Título: " + (title || ""),
          "Local: " + (location || ""),
          "Categoria: " + (category || ""),
          "Tags: " + (Array.isArray(tags) ? tags.join(", ") : (tags || ""))
        ].join("\n");

        await env.MY_BUCKET.put("projetos/" + slug + "/tags.txt", fileContent, {
          httpMetadata: { contentType: "text/plain; charset=utf-8" }
        });

        // Sync with portfolio-config.json if it exists
        const configObj = await env.MY_BUCKET.get("portfolio-config.json");
        if (configObj) {
          const configList = await configObj.json();
          if (Array.isArray(configList)) {
            const idx = configList.findIndex(item => item.slug === slug);
            if (idx !== -1) {
              if (title !== undefined) configList[idx].title = title;
              if (category !== undefined) configList[idx].category = category;
              if (location !== undefined) configList[idx].location = location;
              if (tags !== undefined) configList[idx].tags = tags;
              await env.MY_BUCKET.put("portfolio-config.json", JSON.stringify(configList), {
                httpMetadata: { contentType: "application/json" }
              });
            }
          }
        }

        // Sync new tags and location with global-metadata.json
        try {
          let globalMeta = { tags: DEFAULT_TAGS.slice(), locations: DEFAULT_LOCATIONS.slice() };
          const metaObj = await env.MY_BUCKET.get("global-metadata.json");
          if (metaObj) {
            globalMeta = await metaObj.json();
          }
          let updatedMeta = false;
          if (location && globalMeta.locations.indexOf(location) === -1) {
            globalMeta.locations.push(location);
            updatedMeta = true;
          }
          if (Array.isArray(tags)) {
            tags.forEach(t => {
              if (t && globalMeta.tags.indexOf(t) === -1) {
                globalMeta.tags.push(t);
                updatedMeta = true;
              }
            });
          }
          if (updatedMeta) {
            await env.MY_BUCKET.put("global-metadata.json", JSON.stringify(globalMeta), {
              httpMetadata: { contentType: "application/json" }
            });
          }
        } catch(e) {}

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    if (request.method === "GET" && url.pathname === "/api/list-quotes") {
      try {
        let allObjects = [];
        let cursor = undefined;
        do {
          const list = await env.MY_BUCKET.list({
            prefix: "orcamentos/",
            cursor: cursor
          });
          allObjects.push(...list.objects);
          cursor = list.truncated ? list.cursor : undefined;
        } while (cursor);

        const ids = allObjects.map(o => o.key.replace("orcamentos/", "").replace(".json", "")).filter(Boolean);
        
        let maxNum = 0;
        ids.forEach(id => {
          const match = id.match(/^orcamento(\d+)$/i);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          }
        });
        const nextId = "orcamento" + (maxNum + 1);

        return new Response(JSON.stringify({ ids, nextId }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ids: [], nextId: "orcamento1", error: err.message }), { status: 200, headers: corsHeaders });
      }
    }

    if (request.method === "POST" && url.pathname === "/api/save-quote") {
      try {
        const body = await request.json();
        let id = body.slug || body.id;
        if (!id || typeof id !== "string" || !id.trim()) {
          const list = await env.MY_BUCKET.list({ prefix: "orcamentos/" });
          const ids = (list.objects || []).map(o => o.key.replace("orcamentos/", "").replace(".json", ""));
          let maxNum = 0;
          ids.forEach(i => {
            const match = i.match(/^orcamento(\d+)$/i);
            if (match) {
              const num = parseInt(match[1], 10);
              if (num > maxNum) maxNum = num;
            }
          });
          id = "orcamento" + (maxNum + 1);
        } else {
          id = id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
        }

        const dataToSave = body.data || body;
        await env.MY_BUCKET.put("orcamentos/" + id + ".json", JSON.stringify(dataToSave), {
          httpMetadata: { contentType: "application/json" }
        });

        const quoteUrl = url.origin + "/orcamento/" + id;
        return new Response(JSON.stringify({ success: true, id, url: quoteUrl }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    if (request.method === "GET" && url.pathname === "/api/get-quote") {
      try {
        let id = url.searchParams.get("id") || url.searchParams.get("slug");
        if (!id) {
          return new Response(JSON.stringify({ error: "id is required" }), { status: 400, headers: corsHeaders });
        }
        id = id.trim().toLowerCase().replace(/^orcamento\//, "").replace(/\.json$/, "").replace(/^\/+/, "");
        const quoteObj = await env.MY_BUCKET.get("orcamentos/" + id + ".json");
        if (!quoteObj) {
          return new Response(JSON.stringify({ error: "Quote not found" }), { status: 404, headers: corsHeaders });
        }
        const data = await quoteObj.json();
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    return new Response("API ativa", { status: 200, headers: corsHeaders });
  }
};
