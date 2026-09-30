/**
 * AI Visibility audit engine (GEO/AEO).
 *
 * Ported from the original bookmarklet (8 audit categories). The whole audit
 * lives inside ONE self-contained async function so the exact same code can
 * run as a bookmarklet via runAiVisibilityAudit.toString() — no duplicate
 * logic between the portfolio demo and the installable bookmarklet.
 *
 * Fixes applied while porting (the pasted copy had copy/paste corruption):
 *  - removed stray emoji characters that broke parsing
 *  - restored the `separator` variable (was mangled into `var a` + `t = ...`,
 *    which would have thrown and clobbered the results object)
 *  - llms.txt H1 check: /^#\s/ (was corrupted to /^hashtag#\s/, which could
 *    never match)
 */

export async function runAiVisibilityAudit(emit) {
  var results = {};

  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }
  function add(category, label, status, detail) {
    if (!results[category]) results[category] = [];
    var check = { label: label, status: status, detail: detail || "" };
    results[category].push(check);
    if (emit) emit(category, label, status, check.detail);
  }

  /* ---------------- 1. Schema (JSON-LD structured data) ---------------- */
  var ldJsonScripts = qsa('script[type="application/ld+json"]');
  var schemaData = [];
  ldJsonScripts.forEach(function (script) {
    try {
      var parsed = JSON.parse(script.textContent);
      if (Array.isArray(parsed)) schemaData = schemaData.concat(parsed);
      else schemaData.push(parsed);
    } catch (err) { /* ignore invalid JSON */ }
  });

  var schemaTypes = schemaData
    .flatMap(function (item) {
      return [].concat(item["@type"] || []).concat(
        (item["@graph"] || []).flatMap(function (g) {
          return [].concat(g["@type"] || []);
        })
      );
    })
    .map(function (t) { return String(t).toLowerCase(); });

  var hasOrgSchema = schemaTypes.some(function (t) {
    return ["organization", "localbusiness", "corporation", "financialservice", "bankorcreditunion"].indexOf(t) > -1;
  });
  var hasFaqSchema = schemaTypes.indexOf("faqpage") > -1;
  var hasHowToSchema = schemaTypes.indexOf("howto") > -1;
  var hasBreadcrumbSchema = schemaTypes.indexOf("breadcrumblist") > -1;
  var hasArticleSchema = schemaTypes.some(function (t) {
    return ["article", "newsarticle", "blogposting"].indexOf(t) > -1;
  });
  var hasSoftwareAppSchema =
    schemaTypes.indexOf("softwareapplication") > -1 || schemaTypes.indexOf("webapplication") > -1;

  add("1 Schema", "LD+JSON blocks found", ldJsonScripts.length > 0 ? "PASS" : "FAIL", ldJsonScripts.length + " script(s)");
  add("1 Schema", "FAQPage schema", hasFaqSchema ? "PASS" : "WARN", hasFaqSchema ? "Present" : "Missing");
  add("1 Schema", "HowTo schema", hasHowToSchema ? "PASS" : "INFO", hasHowToSchema ? "Present" : "Not found");
  add("1 Schema", "Organization/Business schema", hasOrgSchema ? "PASS" : "FAIL", hasOrgSchema ? "Present" : "Missing - critical for GEO");
  add("1 Schema", "BreadcrumbList schema", hasBreadcrumbSchema ? "PASS" : "WARN", hasBreadcrumbSchema ? "Present" : "Missing");
  add("1 Schema", "Article/NewsArticle schema", hasArticleSchema ? "PASS" : "INFO", hasArticleSchema ? "Present" : "Not found");

  /* ---------------- 2. Meta tags ---------------- */
  var titleTag = qs("title");
  var metaDescription = qs('meta[name="description"]');
  var canonicalURL = qs('link[rel="canonical"]');
  var ogTitle = qs('meta[property="og:title"]');
  var ogDescription = qs('meta[property="og:description"]');
  var ogImage = qs('meta[property="og:image"]');
  var robotsMeta = qs('meta[name="robots"]');
  var langAttribute = document.documentElement.getAttribute("lang");

  add("2 Meta", "Title tag", titleTag ? "PASS" : "FAIL",
    titleTag ? titleTag.textContent.trim().length + " chars: " + titleTag.textContent.trim().substring(0, 60) : "Missing");
  add("2 Meta", "Meta description", metaDescription ? "PASS" : "FAIL",
    metaDescription ? (metaDescription.getAttribute("content") || "").length + " chars" : "Missing");
  add("2 Meta", "Canonical URL", canonicalURL ? "PASS" : "WARN",
    canonicalURL ? canonicalURL.getAttribute("href") : "Missing");
  add("2 Meta", "OG tags",
    [ogTitle, ogDescription, ogImage].filter(Boolean).length === 3 ? "PASS" : "WARN",
    [ogTitle ? "og:title" : "", ogDescription ? "og:description" : "", ogImage ? "og:image" : ""].filter(Boolean).join(", ") || "None found");
  add("2 Meta", "lang attribute", langAttribute ? "PASS" : "WARN", langAttribute || "Missing");
  add("2 Meta", "Robots meta", robotsMeta ? "INFO" : "PASS",
    (robotsMeta && robotsMeta.getAttribute("content")) || "Not set (defaults to index,follow)");

  /* ---------------- 3. Content & AEO signals ---------------- */
  var mainText = ((qs("main") || qs('[role="main"]') || document.body).innerText || "")
    .replace(/\s+/g, " ").trim().split(/\s+/).filter(function (w) { return w.length > 0; });
  var h1s = qsa("h1");
  var headings = qsa("h1,h2,h3,h4,h5,h6");
  var questionHeadings = headings.filter(function (h) {
    var text = (h.textContent || "").trim();
    return text.indexOf("?") > -1 ||
      /^(what|how|why|when|where|who|which|can|is|are|should|will|would)\b/i.test(text);
  });
  var detailsEls = qsa("details");
  var dlEls = qsa("dl");
  var dtCount = 0;
  dlEls.forEach(function (dl) { dtCount += dl.querySelectorAll("dt").length; });
  var ariaExpanded = qsa("[aria-expanded]").length;
  var ariaControls = qsa("[aria-controls]").length;
  var roleButtons = qsa('[role="button"]').length;
  var dataFaq = qsa('[data-testid*="faq"],[data-testid*="accordion"],[data-cy*="faq"],[data-qa*="faq"],[data-id*="faq"]').length;
  var faqSignals = [detailsEls.length > 0, dtCount > 0, ariaExpanded > 0, dataFaq > 0, questionHeadings.length > 0]
    .filter(Boolean).length;

  add("3 Content", "Word count",
    mainText.length >= 1000 ? "PASS" : mainText.length >= 500 ? "WARN" : "FAIL", mainText.length + " words");
  add("3 Content", "H1 tag",
    h1s.length === 1 ? "PASS" : h1s.length === 0 ? "FAIL" : "WARN",
    h1s.length + " h1(s)" + (h1s.length > 0 ? " - " + h1s[0].textContent.trim().substring(0, 60) : ""));
  add("3 Content", "Heading count", headings.length >= 3 ? "PASS" : "WARN", headings.length + " headings total");
  add("3 Content", "Question-style headings (AEO)",
    questionHeadings.length >= 2 ? "PASS" : questionHeadings.length === 1 ? "WARN" : "FAIL",
    questionHeadings.length + " found" + (questionHeadings.length > 0 ? " - e.g. " + questionHeadings[0].textContent.trim().substring(0, 50) : ""));
  add("3 Content", "Native details FAQ elements",
    detailsEls.length >= 2 ? "PASS" : detailsEls.length > 0 ? "WARN" : "INFO", detailsEls.length + " found");
  add("3 Content", "Definition lists (dl/dt)",
    dtCount >= 3 ? "PASS" : dtCount > 0 ? "WARN" : "INFO", dtCount + " dt terms in " + dlEls.length + " dl(s)");
  add("3 Content", "ARIA accordion signals", ariaExpanded > 0 ? "PASS" : "WARN",
    ariaExpanded + " [aria-expanded], " + ariaControls + " [aria-controls], " + roleButtons + " [role=button]");
  add("3 Content", "data-* FAQ attributes", dataFaq > 0 ? "PASS" : "INFO",
    dataFaq > 0 ? dataFaq + " element(s) found" : "None found");
  add("3 Content", "FAQ signal coverage",
    faqSignals >= 3 ? "PASS" : faqSignals >= 1 ? "WARN" : "FAIL", faqSignals + "/5 signals present");

  /* ---------------- 4. Authorship & trust ---------------- */
  var metaAuthor = qs('meta[name="author"]');
  var schemaAuthor = schemaData.some(function (s) { return s.author || s.publisher; });
  var bylineEl = qs('[rel="author"],.author,[itemprop="author"]');
  var schemaDate = schemaData.some(function (s) { return s.datePublished; });
  var timeEl = qs("time[datetime]");
  var metaDate = qs('meta[name="date"],meta[property="article:published_time"]');

  add("4 Authorship", "Author attribution", metaAuthor || schemaAuthor || bylineEl ? "PASS" : "WARN",
    metaAuthor ? "meta[name=author]" : schemaAuthor ? "schema author/publisher" : bylineEl ? "byline element found" : "No author signal found");
  add("4 Authorship", "Publish date signal", schemaDate || timeEl || metaDate ? "PASS" : "WARN",
    schemaDate ? "schema datePublished" : timeEl ? "time[datetime]" : metaDate ? "meta date tag" : "No date signal");

  /* ---------------- 5. Crawler accessibility ---------------- */
  var noscriptEl = qs("noscript");
  var jsGated = noscriptEl && /enable javascript|javascript is required/i.test(noscriptEl.textContent || "");
  var emptyNamed = qsa("div:empty,section:empty").filter(function (el) {
    return el.id || (el.className && el.className.toString().length > 0);
  });
  var cspMeta = qs('meta[http-equiv="Content-Security-Policy"]');

  add("5 Crawler", "JS-gated content risk", jsGated ? "FAIL" : "PASS",
    jsGated ? "noscript warning detected" : "No noscript warning");
  add("5 Crawler", "Empty named containers", emptyNamed.length > 5 ? "WARN" : "PASS",
    emptyNamed.length + " empty divs/sections with id or class");
  add("5 Crawler", "CSP meta tag", cspMeta ? "INFO" : "PASS",
    cspMeta ? "Present - verify AI crawlers not blocked" : "Not set via meta");

  /* ---------------- 6. Images ---------------- */
  var imgs = qsa("img");
  var imgsWithAlt = imgs.filter(function (img) {
    var alt = img.getAttribute("alt");
    return alt && alt.trim().length > 0;
  });
  var decorativeImgs = imgs.filter(function (img) { return img.getAttribute("alt") === ""; });
  var contentImgs = imgs.length - decorativeImgs.length;

  add("6 Images", "Alt text coverage",
    imgs.length === 0 || imgsWithAlt.length / Math.max(contentImgs, 1) >= 0.9 ? "PASS" : "WARN",
    imgsWithAlt.length + "/" + contentImgs + " content images have alt text");

  /* ---------------- 7. Interactive tools ---------------- */
  var toolByTestId = qsa('[data-testid*="calc"],[data-testid*="calculator"],[data-testid*="tool"],[data-cy*="calc"],[data-cy*="tool"],[role="application"]');
  var toolForms = qsa("form").filter(function (form) {
    return form.querySelectorAll('input[type="number"],input[type="range"]').length > 0;
  });
  var tools = toolByTestId.length > 0 ? toolByTestId : toolForms;
  var toolsWithFallback = 0;
  var toolsMissingFallback = [];
  tools.forEach(function (tool) {
    var hasTable = tool.querySelector("table") !== null;
    var name = tool.getAttribute("data-testid") || tool.getAttribute("data-cy") || tool.getAttribute("role") || "unnamed";
    if (hasTable || hasSoftwareAppSchema) toolsWithFallback++;
    else toolsMissingFallback.push(name);
  });

  add("7 Interactive", "SoftwareApplication schema", hasSoftwareAppSchema ? "PASS" : "WARN",
    hasSoftwareAppSchema ? "Present" : "Missing - add for calculator/tool AI visibility");
  add("7 Interactive", "Tool containers detected", "INFO", (toolByTestId.length || toolForms.length) + " found");
  add("7 Interactive", "Tools with data table or schema",
    tools.length === 0 ? "INFO" : toolsWithFallback === tools.length ? "PASS" : toolsMissingFallback.length > 0 ? "WARN" : "INFO",
    tools.length === 0 ? "No tool containers found"
      : toolsWithFallback + "/" + tools.length + " have machine-readable fallback" +
        (toolsMissingFallback.length > 0 ? " - missing on: " + toolsMissingFallback.slice(0, 3).join(", ") : ""));

  var canvases = qsa("canvas");
  var canvasNoLabel = canvases.filter(function (c) {
    return !c.getAttribute("aria-label") && !c.getAttribute("aria-labelledby") && !c.getAttribute("title");
  });
  var canvasNoTable = canvases.filter(function (c) {
    var parent = c.parentElement;
    return parent && !parent.querySelector("table") && !parent.nextElementSibling && !parent.previousElementSibling;
  });
  var visibleSvgs = qsa('svg:not([aria-hidden="true"])');
  var svgNoLabel = visibleSvgs.filter(function (s) {
    return !s.getAttribute("aria-label") && !s.getAttribute("aria-labelledby") && !s.querySelector("title");
  });

  add("7 Interactive", "Canvas aria-label",
    canvases.length === 0 ? "INFO" : canvasNoLabel.length === 0 ? "PASS" : "WARN",
    canvases.length === 0 ? "No canvas elements" : canvasNoLabel.length + "/" + canvases.length + " canvas missing aria-label");
  add("7 Interactive", "Canvas data fallback table",
    canvases.length === 0 ? "INFO" : canvasNoTable.length === 0 ? "PASS" : "WARN",
    canvases.length === 0 ? "No canvas elements" : canvasNoTable.length + "/" + canvases.length + " charts have no sibling table");
  add("7 Interactive", "SVG accessibility",
    visibleSvgs.length === 0 ? "INFO" : svgNoLabel.length === 0 ? "PASS" : "WARN",
    visibleSvgs.length === 0 ? "No visible SVGs" : svgNoLabel.length + "/" + visibleSvgs.length + " SVGs missing aria-label or title");

  /* ---------------- 8. Crawl files (robots.txt, sitemaps, llms.txt) ---------------- */
  var origin = location.origin;
  function fetchText(path) {
    return fetch(origin + path, { method: "GET", cache: "no-store" }).then(function (res) {
      if (res.ok) {
        return res.text().then(function (txt) { return { ok: true, status: res.status, text: txt.trim() }; });
      }
      return { ok: false, status: res.status, text: "" };
    }).catch(function () { return { ok: false, status: 0, text: "" }; });
  }

  var aiBots = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "anthropic-ai", "Applebot-Extended"];
  var fetched = await Promise.all([
    fetchText("/robots.txt"), fetchText("/sitemap.xml"), fetchText("/sitemap_index.xml"), fetchText("/llms.txt")
  ]);
  var robotsTxt = fetched[0], sitemapXml = fetched[1], sitemapIndex = fetched[2], llmsTxt = fetched[3];

  if (robotsTxt.ok) {
    var robotsLower = robotsTxt.text.toLowerCase();
    var blockedBots = aiBots.filter(function (bot) {
      var idx = robotsLower.indexOf("user-agent: " + bot.toLowerCase());
      // Only a root-level "Disallow: /" counts as blocking the crawler outright;
      // partial rules like "Disallow: /private" are legitimate and not flagged.
      return idx > -1 && /disallow:\s*\/(\s|$)/.test(robotsLower.substring(idx, idx + 120));
    });
    var botsMentioned = aiBots.some(function (bot) { return robotsLower.indexOf(bot.toLowerCase()) > -1; });
    if (blockedBots.length > 0) {
      add("8 Crawl files", "robots.txt", "FAIL", "Found - blocking AI crawlers: " + blockedBots.join(", "));
    } else if (botsMentioned) {
      add("8 Crawl files", "robots.txt", "PASS", "Found - AI crawlers not blocked (" + robotsTxt.text.length + " chars)");
    } else {
      add("8 Crawl files", "robots.txt", "WARN", "Found - no AI crawler rules listed (GPTBot, ClaudeBot, PerplexityBot not mentioned)");
    }
  } else {
    add("8 Crawl files", "robots.txt", "FAIL", "Not found (" + robotsTxt.status + ") - AI crawlers have no access policy");
  }

  if (sitemapXml.ok || sitemapIndex.ok) {
    var sitemap = sitemapXml.ok ? sitemapXml : sitemapIndex;
    var urlCount = (sitemap.text.match(/<url>/gi) || []).length;
    var sitemapCount = (sitemap.text.match(/<sitemap>/gi) || []).length;
    var hasLastmod = sitemap.text.indexOf("<lastmod>") > -1;
    add("8 Crawl files", "sitemap.xml", "PASS",
      (sitemapXml.ok ? urlCount + " url entries" : sitemapCount + " sitemaps in index") +
      (hasLastmod ? ", lastmod present" : " - add lastmod for freshness signals"));
  } else {
    add("8 Crawl files", "sitemap.xml", "WARN", "Not found at /sitemap.xml or /sitemap_index.xml");
  }

  if (llmsTxt.ok) {
    var llmsLines = llmsTxt.text.split("\n").filter(function (l) { return l.trim().length > 0; }).length;
    var hasH1 = /^#\s/.test(llmsTxt.text);
    var hasLinks = llmsTxt.text.indexOf("](") > -1 || llmsTxt.text.indexOf("http") > -1;
    var llmsIssues = [];
    if (!hasH1) llmsIssues.push("missing H1 title");
    if (!hasLinks) llmsIssues.push("no links found");
    if (llmsIssues.length > 0) {
      add("8 Crawl files", "llms.txt", "WARN", "Found (" + llmsLines + " lines) - " + llmsIssues.join(", "));
    } else {
      add("8 Crawl files", "llms.txt", "PASS", "Found (" + llmsLines + " lines) - H1 ok, links present");
    }
  } else {
    add("8 Crawl files", "llms.txt", "WARN", "Not found - add /llms.txt to guide AI agents (low effort, forward-looking)");
  }
}

/** Count statuses across emitted checks. */
export function summarizeChecks(checks) {
  var summary = { PASS: 0, WARN: 0, FAIL: 0, INFO: 0 };
  checks.forEach(function (c) {
    summary[c.status] = (summary[c.status] || 0) + 1;
  });
  return summary;
}

/** 0-100 AI visibility score. INFO checks are informational and excluded. */
export function computeScore(summary) {
  var total = summary.PASS + summary.WARN + summary.FAIL;
  if (total === 0) return 0;
  return Math.round((100 * (summary.PASS + 0.5 * summary.WARN)) / total);
}

/** Console reporter that mirrors the original bookmarklet output. */
export function reportAuditToConsole(collected) {
  var separator = "---------------------------------------------------------";
  function tag(status) {
    return status === "PASS" ? "[PASS]" : status === "FAIL" ? "[FAIL]" : status === "WARN" ? "[WARN]" : "[INFO]";
  }
  console.log("GEO/AEO AUDIT - " + location.hostname);
  console.log(separator);
  Object.keys(collected.categories).forEach(function (category) {
    console.group(category);
    collected.categories[category].forEach(function (check) {
      console.log(tag(check.status) + " " + check.label + " - " + check.detail);
    });
    console.groupEnd();
  });
  console.log(separator);
  var s = collected.summary;
  console.log("SUMMARY: PASS=" + s.PASS + " FAIL=" + s.FAIL + " WARN=" + s.WARN + " INFO=" + s.INFO);
  console.log(separator);
}

/**
 * Build the installable bookmarklet URL from the exact same engine code.
 * The bookmarklet runs the audit and prints the classic console report.
 */
export function getBookmarkletUrl() {
  var engineSrc = runAiVisibilityAudit.toString();
  var reporterSrc = reportAuditToConsole.toString();
  var code =
    "(async function(){" +
    "var collected={categories:{},summary:{PASS:0,WARN:0,FAIL:0,INFO:0}};" +
    "function emit(c,l,s,d){" +
    "(collected.categories[c]=collected.categories[c]||[]).push({label:l,status:s,detail:d});" +
    "collected.summary[s]=(collected.summary[s]||0)+1;" +
    "}" +
    "await (" + engineSrc + ")(emit);" +
    "(" + reporterSrc + ")(collected);" +
    "})()";
  return "javascript:" + encodeURIComponent(code);
}
