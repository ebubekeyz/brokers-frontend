import React, { useMemo, useRef, useState } from "react";

/**
 * AI Resume Builder for Software Developers
 * --------------------------------------------------------
 * - Pure React + TypeScript, single-file demo component
 * - Tailwind-first styling (works without any extra UI libs)
 * - No external packages required to run the demo
 * - Exports: Print-to-PDF via browser print dialog (simple + reliable)
 * - AI hooks are implemented with a generic `callLLM` function.
 *   Swap the body to hit OpenAI, Anthropic, or your own /api route.
 *
 * HOW TO USE
 * 1) Drop this component into your app and render <AIResumeBuilder />
 * 2) (Optional) Wire `callLLM` to your backend or OpenAI API (see TODO notes).
 * 3) Click the AI buttons to generate/refine sections. Use "Export PDF" to print.
 */

// -----------------------------
// Types
// -----------------------------

type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string; // e.g., "Jan 2022"
  end: string;   // e.g., "Present" or "May 2024"
  bullets: string[]; // each bullet is a line
  stack: string;     // technologies used
};

type Education = {
  id: string;
  school: string;
  degree: string;
  start: string;
  end: string;
};

type Project = {
  id: string;
  name: string;
  link: string;
  description: string;
  stack: string;
};

// -----------------------------
// Utility helpers
// -----------------------------

const uid = () => Math.random().toString(36).slice(2, 9);

const cleanBullets = (text: string) =>
  text
    .split(/\n|•|\-/)
    .map((t) => t.trim())
    .filter(Boolean);

// Date helpers (optional niceties for printing)
const monthYear = (value: string) => value; // stub (keep raw); you can normalize if wanted

// -----------------------------
// AI Adapters (swap this with your backend or vendor SDK)
// -----------------------------

async function callLLM(prompt: string): Promise<string> {
  /**
   * TODO: Replace this with YOUR implementation.
   *
   * Option A: Call your own API route (recommended for security)
   * const res = await fetch("/api/ai", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ prompt }) });
   * const data = await res.json();
   * return data.text;
   *
   * Option B: Direct-call OpenAI from the browser (works for quick demos but not safe for prod)
   * const res = await fetch("https://api.openai.com/v1/chat/completions", {
   *   method: "POST",
   *   headers: {
   *     "Content-Type": "application/json",
   *     "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}` // DON'T ship keys to client in production
   *   },
   *   body: JSON.stringify({
   *     model: "gpt-4o-mini",
   *     messages: [{ role: "user", content: prompt }],
   *     temperature: 0.7
   *   })
   * });
   * const data = await res.json();
   * return data.choices?.[0]?.message?.content ?? "";
   */

  // Fallback mock to keep the demo functional without an API.
  return Promise.resolve(
    "(Mocked AI) Replace this with your LLM response.\n- Quantified bullet 1: Improved build time by 45%...\n- Quantified bullet 2: Reduced API latency from 220ms to 80ms..."
  );
}

// -----------------------------
// Main Component
// -----------------------------

const AIResumeBuilder: React.FC = () => {
  // Personal Info
  const [fullName, setFullName] = useState("Ada Lovelace");
  const [title, setTitle] = useState("Senior Software Engineer");
  const [location, setLocation] = useState("Lagos, Nigeria");
  const [email, setEmail] = useState("ada@example.com");
  const [phone, setPhone] = useState("+234 800 000 0000");
  const [links, setLinks] = useState("github.com/ada  |  linkedin.com/in/ada");

  // Content
  const [summary, setSummary] = useState(
    "Backend-focused engineer with 7+ years building scalable APIs and cloud services. Passionate about performance, reliability, and DX."
  );
  const [skills, setSkills] = useState(
    "TypeScript, React, Node.js, NestJS, PostgreSQL, Redis, AWS, Docker, Kubernetes, gRPC"
  );
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: uid(),
      role: "Senior Software Engineer",
      company: "Zephyr Systems",
      location: "Remote",
      start: "Feb 2022",
      end: "Present",
      bullets: [
        "Led migration to microservices; reduced deployment time by 60%",
        "Designed Kafka-based event pipeline for 200k msgs/min",
      ],
      stack: "TS, Node, NestJS, Kafka, Postgres, AWS"
    },
  ]);

  const [education, setEducation] = useState<Education[]>([
    { id: uid(), school: "UNILAG", degree: "BSc Computer Science", start: "2014", end: "2018" }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    { id: uid(), name: "TradePilot", link: "https://example.com", description: "Algorithmic trading dashboard with real-time risk metrics.", stack: "React, TypeScript, WebSockets" }
  ]);

  const [jobDescription, setJobDescription] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const printableRef = useRef<HTMLDivElement>(null);

  // -----------------------------
  // Experience CRUD helpers
  // -----------------------------

  const addExperience = () =>
    setExperiences((prev) => [
      ...prev,
      { id: uid(), role: "", company: "", location: "", start: "", end: "", bullets: [], stack: "" }
    ]);

  const updateExp = (id: string, patch: Partial<Experience>) =>
    setExperiences((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const removeExp = (id: string) => setExperiences((prev) => prev.filter((e) => e.id !== id));

  // -----------------------------
  // AI Actions
  // -----------------------------

  const promptContext = useMemo(() => {
    return `You are a resume writing assistant for software developers. \n\n` +
      `CANDIDATE:\n` +
      `Name: ${fullName}\nTitle: ${title}\nLocation: ${location}\nEmail: ${email}\nPhone: ${phone}\nLinks: ${links}\n\n` +
      `Summary: ${summary}\n\n` +
      `Skills: ${skills}\n\n` +
      `Experience:\n` +
      experiences.map((e, i) => (
        `${i + 1}. ${e.role} @ ${e.company} (${e.location}) [${e.start} - ${e.end}]\n` +
        `Stack: ${e.stack}\n` +
        e.bullets.map((b) => `- ${b}`).join("\n") + "\n\n"
      )).join("") +
      `Projects:\n` +
      projects.map((p, i) => (
        `${i + 1}. ${p.name} (${p.link})\n- ${p.description}\n- Stack: ${p.stack}\n\n`
      )).join("") +
      `Education:\n` +
      education.map((ed) => `- ${ed.degree}, ${ed.school} (${ed.start}-${ed.end})`).join("\n");
  }, [fullName, title, location, email, phone, links, summary, skills, experiences, projects, education]);

  const aiRewriteSummary = async () => {
    setIsThinking(true);
    const res = await callLLM(
      `${promptContext}\n\nRewrite the professional summary to be crisp (2-4 sentences), ATS-friendly, and tailored for software engineering roles. Keep it first-person implied (no "I").`
    );
    setSummary(res.trim());
    setIsThinking(false);
  };

  const aiQuantifyBullets = async (id: string) => {
    const exp = experiences.find((e) => e.id === id);
    if (!exp) return;
    setIsThinking(true);
    const res = await callLLM(
      `${promptContext}\n\nFor the role: ${exp.role} @ ${exp.company}.\nRewrite/augment the bullet points with quantified impact (metrics, %, ms, $), using strong action verbs and STAR method. Return bullets only, one per line.`
    );
    const bullets = cleanBullets(res);
    updateExp(id, { bullets });
    setIsThinking(false);
  };

  const aiTailorToJD = async () => {
    if (!jobDescription.trim()) return;
    setIsThinking(true);
    const res = await callLLM(
      `${promptContext}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nRewrite the skills list to emphasize the most relevant technologies and keywords for this JD. Keep as a comma-separated list.`
    );
    setSkills(res.replace(/\n/g, " ").trim());
    setIsThinking(false);
  };

  const aiScoreATS = async () => {
    if (!jobDescription.trim()) return alert("Paste a job description first.");
    setIsThinking(true);
    const res = await callLLM(
      `${promptContext}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nAssess ATS match against the JD (0-100). Identify missing keywords and suggest top 5 changes to improve the score. Return a short JSON object with keys: score, missing_keywords, suggestions.`
    );
    alert(res);
    setIsThinking(false);
  };

  // -----------------------------
  // Export to PDF (simple: print stylesheet)
  // -----------------------------

  const exportPDF = () => {
    // Open a new window with printable HTML and call print()
    const html = printableRef.current?.innerHTML ?? "";
    const win = window.open("", "_blank", "width=900,height=1200");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Resume - ${fullName}</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; margin: 32px; color: #111827; }
        h1,h2,h3 { margin: 0 0 8px; }
        .muted { color: #6b7280; }
        .row { display: flex; gap: 16px; align-items: baseline; flex-wrap: wrap; }
        .chip { display:inline-block; border:1px solid #e5e7eb; padding:6px 10px; border-radius: 999px; margin:4px 6px 0 0; }
        ul { margin: 6px 0 12px 20px; }
        .sec { margin-top: 18px; }
        hr { border: none; border-top: 1px solid #e5e7eb; margin: 12px 0; }
      </style>
    </head><body>${html}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  // -----------------------------
  // Render helpers
  // -----------------------------

  const ResumePreview: React.FC = () => (
    <div className="bg-white text-slate-900 rounded-xl shadow-sm ring-1 ring-slate-200 p-6" ref={printableRef}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">{fullName}</h1>
          <div className="text-sm text-slate-600">{title}</div>
        </div>
        <div className="text-xs text-slate-600">
          <div className="whitespace-pre-line">{location}</div>
          <div>{email}</div>
          <div>{phone}</div>
          <div className="break-words">{links}</div>
        </div>
      </div>

      <hr className="my-4" />

      {/* Summary */}
      {summary && (
        <div className="sec">
          <h2 className="text-sm font-semibold tracking-wider text-slate-700">SUMMARY</h2>
          <p className="mt-1 text-sm leading-6">{summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills && (
        <div className="sec">
          <h2 className="text-sm font-semibold tracking-wider text-slate-700">SKILLS</h2>
          <div className="mt-1">
            {skills.split(",").map((s) => (
              <span key={s.trim()} className="chip text-xs">{s.trim()}</span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      <div className="sec">
        <h2 className="text-sm font-semibold tracking-wider text-slate-700">EXPERIENCE</h2>
        <div className="mt-2 space-y-5">
          {experiences.map((e) => (
            <div key={e.id}>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <div className="font-medium">{e.role}</div>
                <div className="text-slate-600">@ {e.company}</div>
                <div className="text-xs text-slate-500">{e.location}</div>
                <div className="ml-auto text-xs text-slate-500">{monthYear(e.start)} – {monthYear(e.end)}</div>
              </div>
              {e.stack && <div className="text-xs text-slate-500 mt-0.5">Stack: {e.stack}</div>}
              {e.bullets?.length > 0 && (
                <ul className="list-disc mt-1">
                  {e.bullets.map((b, i) => (
                    <li key={i} className="text-sm leading-6">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      {projects.length > 0 && (
        <div className="sec">
          <h2 className="text-sm font-semibold tracking-wider text-slate-700">PROJECTS</h2>
          <div className="mt-2 space-y-3">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <div className="font-medium">{p.name}</div>
                  {p.link && (
                    <a href={p.link} className="text-xs text-blue-600 hover:underline break-all" target="_blank" rel="noreferrer">{p.link}</a>
                  )}
                </div>
                <div className="text-sm mt-0.5">{p.description}</div>
                {p.stack && <div className="text-xs text-slate-500">Stack: {p.stack}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="sec">
          <h2 className="text-sm font-semibold tracking-wider text-slate-700">EDUCATION</h2>
          <ul className="mt-2 list-disc ml-5">
            {education.map((ed) => (
              <li key={ed.id} className="text-sm leading-6">
                <span className="font-medium">{ed.degree}</span>, {ed.school} ({ed.start} – {ed.end})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-bold">AI Resume Builder (Software)</h1>
          <div className="flex gap-2">
            <button onClick={exportPDF} className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:opacity-90">Export PDF</button>
            <button onClick={aiScoreATS} className="px-3 py-2 rounded-lg bg-white ring-1 ring-slate-200 text-sm hover:bg-slate-100">ATS Score</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Form */}
          <div className="space-y-6">
            {/* Personal */}
            <section className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4">
              <h2 className="font-semibold mb-3">Personal</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="input" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <input className="input" placeholder="Title (e.g., Senior Software Engineer)" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input className="input" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="input" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input className="input sm:col-span-2" placeholder="Links (GitHub, LinkedIn, Portfolio)" value={links} onChange={(e) => setLinks(e.target.value)} />
              </div>
            </section>

            {/* Summary */}
            <section className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">Professional Summary</h2>
                <button disabled={isThinking} onClick={aiRewriteSummary} className="btn-secondary">{isThinking ? "Thinking…" : "AI Improve"}</button>
              </div>
              <textarea className="textarea h-32" value={summary} onChange={(e) => setSummary(e.target.value)} />
            </section>

            {/* Skills */}
            <section className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">Skills (comma-separated)</h2>
                <button disabled={isThinking || !jobDescription} onClick={aiTailorToJD} className="btn-secondary">Tailor to JD</button>
              </div>
              <textarea className="textarea h-24" value={skills} onChange={(e) => setSkills(e.target.value)} />
            </section>

            {/* Experience */}
            <section className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Experience</h2>
                <button onClick={addExperience} className="btn-outline">+ Add Role</button>
              </div>
              <div className="space-y-6">
                {experiences.map((e) => (
                  <div key={e.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input className="input" placeholder="Role" value={e.role} onChange={(ev) => updateExp(e.id, { role: ev.target.value })} />
                      <input className="input" placeholder="Company" value={e.company} onChange={(ev) => updateExp(e.id, { company: ev.target.value })} />
                      <input className="input" placeholder="Location" value={e.location} onChange={(ev) => updateExp(e.id, { location: ev.target.value })} />
                      <div className="grid grid-cols-2 gap-3">
                        <input className="input" placeholder="Start (e.g., Jan 2022)" value={e.start} onChange={(ev) => updateExp(e.id, { start: ev.target.value })} />
                        <input className="input" placeholder="End (e.g., Present)" value={e.end} onChange={(ev) => updateExp(e.id, { end: ev.target.value })} />
                      </div>
                      <input className="input sm:col-span-2" placeholder="Tech stack (comma-separated)" value={e.stack} onChange={(ev) => updateExp(e.id, { stack: ev.target.value })} />
                      <textarea className="textarea sm:col-span-2 h-28" placeholder="Bullets (one per line)" value={e.bullets.join("\n")} onChange={(ev) => updateExp(e.id, { bullets: cleanBullets(ev.target.value) })} />
                    </div>
                    <div className="flex justify-between mt-2">
                      <button onClick={() => aiQuantifyBullets(e.id)} disabled={isThinking} className="btn-secondary">{isThinking ? "Thinking…" : "AI Quantify"}</button>
                      <button onClick={() => removeExp(e.id)} className="btn-danger">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Projects</h2>
                <button onClick={() => setProjects((p) => [...p, { id: uid(), name: "", link: "", description: "", stack: "" }])} className="btn-outline">+ Add Project</button>
              </div>
              <div className="space-y-6">
                {projects.map((p) => (
                  <div key={p.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input className="input" placeholder="Name" value={p.name} onChange={(e) => setProjects((prev) => prev.map(x => x.id === p.id ? { ...x, name: e.target.value } : x))} />
                      <input className="input" placeholder="Link" value={p.link} onChange={(e) => setProjects((prev) => prev.map(x => x.id === p.id ? { ...x, link: e.target.value } : x))} />
                      <textarea className="textarea sm:col-span-2 h-24" placeholder="Description" value={p.description} onChange={(e) => setProjects((prev) => prev.map(x => x.id === p.id ? { ...x, description: e.target.value } : x))} />
                      <input className="input sm:col-span-2" placeholder="Tech stack (comma-separated)" value={p.stack} onChange={(e) => setProjects((prev) => prev.map(x => x.id === p.id ? { ...x, stack: e.target.value } : x))} />
                    </div>
                    <div className="flex justify-end mt-2">
                      <button onClick={() => setProjects((prev) => prev.filter(x => x.id !== p.id))} className="btn-danger">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="bg-white rounded-xl shadow-sm ring-1 ring-slate-2 00 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Education</h2>
                <button onClick={() => setEducation((p) => [...p, { id: uid(), school: "", degree: "", start: "", end: "" }])} className="btn-outline">+ Add Education</button>
              </div>
              <div className="space-y-6">
                {education.map((ed) => (
                  <div key={ed.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input className="input" placeholder="School" value={ed.school} onChange={(e) => setEducation((prev) => prev.map(x => x.id === ed.id ? { ...x, school: e.target.value } : x))} />
                      <input className="input" placeholder="Degree" value={ed.degree} onChange={(e) => setEducation((prev) => prev.map(x => x.id === ed.id ? { ...x, degree: e.target.value } : x))} />
                      <input className="input" placeholder="Start" value={ed.start} onChange={(e) => setEducation((prev) => prev.map(x => x.id === ed.id ? { ...x, start: e.target.value } : x))} />
                      <input className="input" placeholder="End" value={ed.end} onChange={(e) => setEducation((prev) => prev.map(x => x.id === ed.id ? { ...x, end: e.target.value } : x))} />
                    </div>
                    <div className="flex justify-end mt-2">
                      <button onClick={() => setEducation((prev) => prev.filter(x => x.id !== ed.id))} className="btn-danger">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* JD Panel */}
            <section className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">Target Job Description (optional)</h2>
              </div>
              <textarea className="textarea h-40" placeholder="Paste JD here to tailor skills/summary and run ATS scoring" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
            </section>
          </div>

          {/* Right: Live Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Live Preview</h2>
              <span className="text-xs text-slate-500">Use Export PDF for printing</span>
            </div>
            <ResumePreview />
          </div>
        </div>
      </div>

      {/* local styles for inputs/buttons */}
      <style>{`
        .input { width: 100%; border: 1px solid #e5e7eb; border-radius: 0.6rem; padding: 0.5rem 0.75rem; font-size: 0.9rem; }
        .input:focus { outline: none; box-shadow: 0 0 0 3px rgba(59,130,246,.2); border-color: #93c5fd; }
        .textarea { width: 100%; border: 1px solid #e5e7eb; border-radius: 0.6rem; padding: 0.6rem 0.75rem; font-size: 0.92rem; }
        .textarea:focus { outline: none; box-shadow: 0 0 0 3px rgba(59,130,246,.2); border-color: #93c5fd; }
        .btn-outline { border: 1px solid #e5e7eb; border-radius: 0.6rem; padding: 0.45rem 0.75rem; font-size: 0.9rem; background: white; }
        .btn-outline:hover { background:#f8fafc; }
        .btn-secondary { border: 1px solid #e5e7eb; border-radius: 0.6rem; padding: 0.45rem 0.75rem; font-size: 0.9rem; background: white; }
        .btn-secondary:hover { background:#f1f5f9; }
        .btn-danger { border: 1px solid #ef4444; color: #ef4444; border-radius: 0.6rem; padding: 0.45rem 0.75rem; font-size: 0.9rem; background: white; }
        .btn-danger:hover { background:#fef2f2; }
      `}</style>
    </div>
  );
};

export default AIResumeBuilder;
