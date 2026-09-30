import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  runAiVisibilityAudit,
  summarizeChecks,
  computeScore,
  getBookmarkletUrl,
} from "./aiVisibilityAudit";

/* ---------------------------------- helpers ---------------------------------- */

const STATUS_STYLES = {
  PASS: "bg-green-100 text-green-800 border-green-200",
  WARN: "bg-amber-100 text-amber-800 border-amber-200",
  FAIL: "bg-red-100 text-red-800 border-red-200",
  INFO: "bg-blue-100 text-blue-800 border-blue-200",
};

const StatusPill = ({ status }) => (
  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${STATUS_STYLES[status]}`}>
    {status}
  </span>
);

const ScoreRing = ({ score, size = 120 }) => {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth="10" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.8s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-extrabold text-gray-900">{score}</div>
        <div className="text-xs text-gray-500 font-medium">/ 100</div>
      </div>
    </div>
  );
};

const CATEGORY_INFO = [
  { n: "1 Schema", title: "Structured data", desc: "JSON-LD blocks and the schema types AI engines rely on: Organization, FAQPage, HowTo, BreadcrumbList, Article." },
  { n: "2 Meta", title: "Meta tags", desc: "Title, meta description, canonical URL, Open Graph tags, lang attribute and robots directives." },
  { n: "3 Content", title: "Content & AEO signals", desc: "Word count, heading structure, question-style headings, native FAQ elements and accordion signals that answer engines quote." },
  { n: "4 Authorship", title: "Authorship & trust", desc: "Author attribution and publish-date signals — the E-E-A-T markers AI citations look for." },
  { n: "5 Crawler", title: "Crawler accessibility", desc: "JS-gated content risks, empty containers and CSP flags that can hide content from crawlers." },
  { n: "6 Images", title: "Images", desc: "Alt-text coverage across content images so visual content stays machine-readable." },
  { n: "7 Interactive", title: "Interactive tools", desc: "SoftwareApplication schema, tool containers, canvas/SVG accessibility and machine-readable fallbacks for calculators." },
  { n: "8 Crawl files", title: "Crawl files", desc: "Live fetches of robots.txt (GPTBot, ClaudeBot, PerplexityBot rules), sitemaps and llms.txt." },
];

const CONSOLE_SAMPLE = `GEO/AEO AUDIT - example.com
---------------------------------------------------------
1 Schema
[PASS] LD+JSON blocks found - 2 script(s)
[WARN] FAQPage schema - Missing
[PASS] Organization/Business schema - Present
2 Meta
[PASS] Title tag - 58 chars: AI Visibility Tester - audit your ...
[FAIL] Meta description - Missing
3 Content
[PASS] Question-style headings (AEO) - 4 found - e.g. What is AI visibility?
[WARN] FAQ signal coverage - 2/5 signals present
...
---------------------------------------------------------
SUMMARY: PASS=21 FAIL=1 WARN=5 INFO=9
---------------------------------------------------------`;

const STOPWORDS = new Set(
  "a,an,the,and,or,but,if,then,else,for,to,of,in,on,at,by,with,from,as,is,are,was,were,be,been,it,its,this,that,these,those,you,your,we,our,they,their,he,she,his,her,not,no,do,does,did,can,will,just,than,so,such,into,over,after,before,between,about,up,out,all,any,each,more,most,other,some,only,own,same,too,very,what,when,where,which,who,how,why".split(",")
);

function topKeywords(text, limit = 5) {
  const counts = {};
  (text.toLowerCase().match(/[a-z][a-z\-']{2,}/g) || []).forEach((w) => {
    if (!STOPWORDS.has(w)) counts[w] = (counts[w] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

const DASHBOARD_ROWS = [
  { page: "/", score: 92, published: "2026-09-12", locale: "en-CA", issue: "Add FAQPage schema" },
  { page: "/projects/ai-visibility", score: 88, published: "2026-09-29", locale: "en-CA", issue: "Meta description short" },
  { page: "/help/faq", score: 81, published: "2026-07-19", locale: "en-CA", issue: "2 schema checks failing" },
  { page: "/blog/ai-search-readiness", score: 74, published: "2026-08-30", locale: "en-CA", issue: "Missing canonical URL" },
  { page: "/fr", score: 69, published: "2026-09-02", locale: "fr-CA", issue: "No llms.txt for locale" },
  { page: "/tools/mortgage-calculator", score: 63, published: "2026-06-25", locale: "en-CA", issue: "GPTBot blocked in robots.txt" },
];

/* ---------------------------------- page ---------------------------------- */

const AIVisibilityTester = () => {
  const bookmarkletUrl = useMemo(() => {
    try { return getBookmarkletUrl(); } catch (e) { return ""; }
  }, []);

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [openCat, setOpenCat] = useState(null);
  const [copied, setCopied] = useState(false);
  const [installHint, setInstallHint] = useState(false);

  const runDemo = async () => {
    setRunning(true);
    setResult(null);
    try {
      const categories = {};
      const checks = [];
      await runAiVisibilityAudit((c, l, s, d) => {
        checks.push({ category: c, label: l, status: s, detail: d });
        (categories[c] = categories[c] || []).push({ label: l, status: s, detail: d });
      });
      const summary = summarizeChecks(checks);
      setResult({ categories, summary, score: computeScore(summary) });
      setOpenCat(Object.keys(categories)[0] || null);
    } finally {
      setRunning(false);
    }
  };

  const copyBookmarklet = async () => {
    try {
      await navigator.clipboard.writeText(bookmarkletUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { /* clipboard unavailable */ }
  };

  /* ---- Contentful sidebar prototype (interactive) ---- */
  const [cfTitle, setCfTitle] = useState("How AI search reads your website");
  const [cfMeta, setCfMeta] = useState("A practical guide to making your content visible to AI search engines and answer engines.");
  const [cfBody, setCfBody] = useState(
    "What is AI visibility?\n\nAI visibility is how easily AI search engines can find, read and cite your content. Pages with clear structure rank better in AI answers.\n\nHow do you improve it?\n\nAdd structured data, write question-style headings, and keep your robots.txt open to AI crawlers like GPTBot and ClaudeBot."
  );

  const cfChecks = useMemo(() => {
    const words = cfBody.replace(/\s+/g, " ").trim().split(/\s+/).filter(Boolean);
    const list = [];
    list.push({
      label: "Title length (30–60 chars)", status: cfTitle.length === 0 ? "FAIL" : cfTitle.length >= 30 && cfTitle.length <= 60 ? "PASS" : "WARN",
      detail: cfTitle.length + " chars",
    });
    list.push({
      label: "Meta description (120–160)", status: cfMeta.length === 0 ? "FAIL" : cfMeta.length >= 120 && cfMeta.length <= 160 ? "PASS" : "WARN",
      detail: cfMeta.length + " chars",
    });
    list.push({
      label: "Body word count", status: words.length >= 600 ? "PASS" : words.length >= 300 ? "WARN" : "FAIL",
      detail: words.length + " words",
    });
    list.push({
      label: "Question heading for AEO", status: /\?/m.test(cfBody) ? "PASS" : "WARN",
      detail: /\?/m.test(cfBody) ? "Found" : "Add a question readers ask",
    });
    const top = topKeywords(cfBody, 1)[0];
    list.push({
      label: "Keyword focus", status: top && top[1] >= 3 ? "PASS" : "INFO",
      detail: top ? `"${top[0]}" × ${top[1]}` : "No focus keyword yet",
    });
    return list;
  }, [cfTitle, cfMeta, cfBody]);
  const cfSummary = useMemo(() => summarizeChecks(cfChecks), [cfChecks]);
  const cfScore = useMemo(() => computeScore(cfSummary), [cfSummary]);
  const cfKeywords = useMemo(() => topKeywords(cfTitle + " " + cfBody, 5), [cfTitle, cfBody]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* ------------------------------- HERO ------------------------------- */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              GEO &middot; AEO &middot; AI Search Readiness
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">AI Visibility Tester</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
              A JavaScript bookmarklet that audits any webpage for AI-crawler visibility —
              36 checks across 8 categories, reported in seconds.
            </p>
            <p className="text-gray-500 max-w-2xl mx-auto mb-6">
              AI search is the new SEO. This tool answers one question: <em>can AI actually read, understand and cite this page?</em>
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="#demo" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                Run the live audit
              </a>
              <a href="#install" className="bg-white text-gray-800 px-6 py-2.5 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100 transition-colors">
                Get the bookmarklet
              </a>
            </div>
          </motion.div>

          {/* ------------------------------- LIVE DEMO ------------------------------- */}
          <motion.section
            id="demo"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8 scroll-mt-24"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Try it live — on this page</h2>
                <p className="text-gray-600 mt-1">
                  Runs the real audit engine in your browser, right now, against this portfolio page.
                  Nothing leaves your device.
                </p>
              </div>
              <button
                onClick={runDemo}
                disabled={running}
                className="shrink-0 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {running ? "Auditing…" : result ? "Re-run audit" : "Audit this page"}
              </button>
            </div>

            {running && (
              <div className="py-10 text-center text-gray-500">
                <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
                <p>Checking schema, meta tags, content signals and fetching robots.txt…</p>
              </div>
            )}

            {result && !running && (
              <div>
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
                  <ScoreRing score={result.score} />
                  <div className="flex-1 w-full">
                    <h3 className="font-bold text-gray-900 mb-2">AI Visibility Score</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {result.score >= 80
                        ? "This page is well prepared for AI crawlers and answer engines."
                        : result.score >= 60
                        ? "Solid foundation — a few fixes would sharpen AI visibility."
                        : "AI crawlers will struggle here — see the failing checks below."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["PASS", "WARN", "FAIL", "INFO"].map((s) => (
                        <span key={s} className={`px-3 py-1 rounded-full text-sm font-bold border ${STATUS_STYLES[s]}`}>
                          {s}: {result.summary[s] || 0}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {Object.keys(result.categories).map((cat) => (
                    <div key={cat} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setOpenCat(openCat === cat ? null : cat)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <span className="font-semibold text-gray-900">{cat}</span>
                        <span className="text-gray-400">{openCat === cat ? "−" : "+"}</span>
                      </button>
                      {openCat === cat && (
                        <div className="divide-y divide-gray-100">
                          {result.categories[cat].map((check, i) => (
                            <div key={i} className="px-4 py-2.5 flex items-start gap-3">
                              <span className="mt-0.5"><StatusPill status={check.status} /></span>
                              <div className="min-w-0">
                                <div className="font-medium text-gray-800 text-sm">{check.label}</div>
                                <div className="text-gray-500 text-sm truncate">{check.detail}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!result && !running && (
              <p className="text-center text-gray-400 py-6 text-sm">
                No audit yet — hit the button to see all 36 checks run against this page.
              </p>
            )}
          </motion.section>

          {/* ------------------------------- INSTALL ------------------------------- */}
          <motion.section
            id="install"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8 scroll-mt-24"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Install the bookmarklet</h2>
            <p className="text-gray-600 mb-6">One click, no build step, no dependencies — pure vanilla JavaScript.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { step: "1", title: "Drag to your bookmarks bar", desc: "Grab the button below and drop it onto your browser's bookmarks bar." },
                { step: "2", title: "Visit any webpage", desc: "Works on any site — your own, a client's, a competitor's." },
                { step: "3", title: "Click it, open the console", desc: "The full GEO/AEO report prints to DevTools, grouped by category." },
              ].map((s) => (
                <div key={s.step} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mb-2">{s.step}</div>
                  <div className="font-semibold text-gray-900 mb-1">{s.title}</div>
                  <div className="text-sm text-gray-600">{s.desc}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={bookmarkletUrl}
                draggable
                onClick={(e) => { e.preventDefault(); setInstallHint(true); setTimeout(() => setInstallHint(false), 3000); }}
                title="Drag me to your bookmarks bar"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold cursor-grab active:cursor-grabbing hover:bg-indigo-700 transition-colors select-none"
              >
                ⚡ AI Visibility Audit
              </a>
              <button
                onClick={copyBookmarklet}
                className="bg-white text-gray-800 px-5 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                {copied ? "Copied!" : "Copy bookmarklet code"}
              </button>
            </div>
            {installHint && (
              <p className="mt-3 text-sm text-indigo-700 font-medium">
                ↑ Drag that button to your bookmarks bar — clicking it here just runs the demo above.
              </p>
            )}
            <p className="mt-4 text-xs text-gray-400">
              The bookmarklet is generated from the exact same audit engine as the live demo — one source of truth, always in sync.
            </p>
          </motion.section>

          {/* ------------------------------- WHAT IT CHECKS ------------------------------- */}
          <motion.section
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">What it checks</h2>
            <p className="text-gray-600 text-center mb-6 max-w-2xl mx-auto">
              36 checks across 8 categories — everything an AI crawler or answer engine looks at before citing a page.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORY_INFO.map((c, i) => (
                <motion.div
                  key={c.n}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: (i % 4) * 0.08 }}
                  className="bg-white p-5 rounded-xl shadow border border-gray-100"
                >
                  <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">{c.n}</div>
                  <div className="font-bold text-gray-900 mb-1">{c.title}</div>
                  <div className="text-sm text-gray-600">{c.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ------------------------------- CONTENTFUL INTEGRATION ------------------------------- */}
          <motion.section
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8"
          >
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">From one page to every page</h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold border border-purple-200">
                CONCEPT PROTOTYPE
              </span>
            </div>
            <p className="text-gray-600 mb-6 max-w-3xl">
              A bookmarklet audits one page at a time. The same checks become far more powerful when they live
              where content is created. I explored this as an internal AI-readiness proposal: embed the audit
              into the Contentful authoring workflow, then monitor every URL from a dashboard. Three layers, one idea:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { n: "01", t: "Bookmarklet", d: "Audit any page on demand. The tool above — manual, instant, zero setup.", active: true },
                { n: "02", t: "Sidebar app", d: "Live AI-visibility score inside the Contentful entry editor, while authors write.", active: true },
                { n: "03", t: "Link universe dashboard", d: "Scheduled audits across every URL: score, publish date, locale and top issue per page.", active: true },
              ].map((s) => (
                <div key={s.n} className="p-4 rounded-lg border-2 border-indigo-100 bg-indigo-50/50">
                  <div className="text-xs font-extrabold text-indigo-600 mb-1">{s.n}</div>
                  <div className="font-bold text-gray-900 mb-1">{s.t}</div>
                  <div className="text-sm text-gray-600">{s.d}</div>
                </div>
              ))}
            </div>

            {/* ---- Interactive sidebar prototype ---- */}
            <h3 className="text-lg font-bold text-gray-900 mb-1">Sidebar app — interactive prototype</h3>
            <p className="text-sm text-gray-500 mb-4">
              A mock Contentful entry editor with the AI-visibility widget docked beside it.
              Edit the fields and watch the score react — this is what authors would see while writing.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
              <div className="lg:col-span-3 bg-gray-50 border border-gray-200 rounded-xl p-5">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Entry editor (mock)</div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page title</label>
                <input
                  value={cfTitle} onChange={(e) => setCfTitle(e.target.value)}
                  className="w-full p-2.5 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta description</label>
                <input
                  value={cfMeta} onChange={(e) => setCfMeta(e.target.value)}
                  className="w-full p-2.5 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                <textarea
                  value={cfBody} onChange={(e) => setCfBody(e.target.value)} rows={8}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-mono text-sm"
                />
              </div>
              <div className="lg:col-span-2">
                <div className="bg-gray-900 text-white rounded-xl p-5 sticky top-24">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">AI Visibility widget</div>
                  <div className="flex justify-center mb-4"><ScoreRing score={cfScore} size={110} /></div>
                  <div className="space-y-2 mb-4">
                    {cfChecks.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5"><StatusPill status={c.status} /></span>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-100">{c.label}</div>
                          <div className="text-gray-400 text-xs">{c.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-700 pt-3">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Top keywords</div>
                    {cfKeywords.length === 0 && <div className="text-sm text-gray-500">Start typing…</div>}
                    {cfKeywords.map(([w, n]) => (
                      <div key={w} className="flex items-center gap-2 text-sm mb-1.5">
                        <span className="text-gray-200 font-mono">{w}</span>
                        <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${Math.min(100, (n / (cfKeywords[0]?.[1] || 1)) * 100)}%` }} />
                        </div>
                        <span className="text-gray-400 text-xs">×{n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ---- Dashboard prototype ---- */}
            <h3 className="text-lg font-bold text-gray-900 mb-1">Link universe dashboard — concept</h3>
            <p className="text-sm text-gray-500 mb-4">
              Scheduled audits across the full URL universe. Every page gets a score; trends and regressions surface automatically.
            </p>
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3 font-bold">Page</th>
                    <th className="px-4 py-3 font-bold">AI score</th>
                    <th className="px-4 py-3 font-bold">Published</th>
                    <th className="px-4 py-3 font-bold">Locale</th>
                    <th className="px-4 py-3 font-bold">Top issue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {DASHBOARD_ROWS.map((row) => (
                    <tr key={row.page} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-indigo-700">{row.page}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${row.score >= 80 ? "bg-green-500" : row.score >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                              style={{ width: `${row.score}%` }}
                            />
                          </div>
                          <span className="font-bold text-gray-900">{row.score}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{row.published}</td>
                      <td className="px-4 py-3 text-gray-600">{row.locale}</td>
                      <td className="px-4 py-3 text-gray-600">{row.issue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Sample data for illustration. The vision: authors fix issues before publishing (sidebar app),
              and the dashboard catches regressions across locales after publishing.
            </p>
          </motion.section>

          {/* ------------------------------- CONSOLE SAMPLE ------------------------------- */}
          <motion.section
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">What the bookmarklet prints</h2>
            <p className="text-gray-600 text-center mb-6">The classic console report — grouped, scannable, copy-pasteable.</p>
            <div className="max-w-3xl mx-auto bg-gray-900 rounded-xl shadow-lg overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-800">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-gray-400 font-mono">DevTools console</span>
              </div>
              <pre className="p-5 text-xs sm:text-sm font-mono text-gray-300 overflow-x-auto whitespace-pre">{CONSOLE_SAMPLE}</pre>
            </div>
          </motion.section>

          {/* ------------------------------- BACK ------------------------------- */}
          <div className="text-center">
            <Link to="/" className="inline-block text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
              ← Back to all projects
            </Link>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AIVisibilityTester;
