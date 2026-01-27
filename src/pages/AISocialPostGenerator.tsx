import React, { useMemo, useState } from "react";

/** ===============================
 *  AI adapter (swap with your API)
 *  =============================== */
async function callLLM(prompt: string): Promise<string> {
  // TODO: Replace with your server route for safety.
  // Example (server-side): POST /api/ai { prompt } -> { text }
  // Return value should be a JSON string matching our requested schema.
  // Mocked demo response:
  return JSON.stringify({
    variants: [
      {
        text:
          "Step inside this light-filled 3-bed, 2-bath gem in Lekki! Modern kitchen, private terrace, and a flexible home office. Book a tour today! 📲",
        hashtags: ["#LagosRealEstate", "#LekkiHomes", "#ForSale"],
      },
      {
        text:
          "New listing in Lekki: 3BR/2BA with open-concept living and a serene outdoor space. DM for details or to schedule a tour.",
        hashtags: ["#NewListing", "#Lekki", "#HouseHunting"],
      },
      {
        text:
          "Contemporary design, practical layout, and a prime spot in Lekki. Discover your next chapter—schedule a private viewing.",
        hashtags: ["#RealEstate", "#LekkiProperty", "#NigeriaHomes"],
      },
    ],
    notes:
      "Variants sized for IG/FB/LinkedIn; tighten further for X. Avoid targeting language.",
    warnings: [],
  });
}

/** ===============================
 *  Helpers
 *  =============================== */
const platforms = ["Instagram", "Facebook", "LinkedIn", "X"] as const;
type Platform = (typeof platforms)[number];

const tones = ["Friendly", "Luxury", "Professional", "Urgent"] as const;
type Tone = (typeof tones)[number];

function limitFor(platform: Platform): number {
  switch (platform) {
    case "X":
      return 280;
    case "LinkedIn":
      return 3000;
    case "Instagram":
      return 2200; // but we’ll prefer ~200 in UX
    case "Facebook":
      return 63206;
  }
}

function clampText(text: string, max: number) {
  return text.length <= max ? text : text.slice(0, max - 1) + "…";
}

/** ===============================
 *  Main component
 *  =============================== */
const AISocialPostGenerator: React.FC = () => {
  // Listing inputs
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [tone, setTone] = useState<Tone>("Friendly");
  const [audience, setAudience] = useState("First-time buyers in Lagos");
  const [address, setAddress] = useState("123 Palm Grove");
  const [city, setCity] = useState("Lekki, Lagos");
  const [price, setPrice] = useState("₦180,000,000");
  const [beds, setBeds] = useState(3);
  const [baths, setBaths] = useState(2);
  const [sqft, setSqft] = useState(2200);
  const [highlights, setHighlights] = useState(
    "Open-concept living, modern kitchen, private terrace, secure parking"
  );
  const [neighborhood, setNeighborhood] = useState("Lekki Phase 1");
  const [agentName, setAgentName] = useState("Barick Realty");
  const [phone, setPhone] = useState("+234 800 000 0000");
  const [website, setWebsite] = useState("https://barickrealty.example");
  const [useEmojis, setUseEmojis] = useState(true);
  const [hashtagCount, setHashtagCount] = useState(5);
  const [igFirstComment, setIgFirstComment] = useState(true);
  const [openHouseDate, setOpenHouseDate] = useState("");

  // Output
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    variants: { text: string; hashtags?: string[]; firstComment?: string }[];
    notes?: string;
    warnings?: string[];
  } | null>(null);

  const prompt = useMemo(() => {
    return `
ROLE: You are a real estate marketing copywriter for social media.
GOALS:
- Write 3 concise post variants tailored to ${platform}.
- Obey platform character guidance (hard cap ${limitFor(platform)} chars).
- Tone: ${tone}. Audience: ${audience}.
- Emojis: ${useEmojis ? "Allowed" : "None"}.
- Include up to ${hashtagCount} relevant hashtags.
- Include ONE CTA (Book a tour / DM for details / Open house${openHouseDate ? ` on ${openHouseDate}` : ""} / See 3D tour).
- Avoid Fair Housing violations (no references to protected classes or exclusionary language).

LISTING:
- Address: ${address}, ${city}
- Price: ${price}
- Beds/Baths/Sqft: ${beds} / ${baths} / ${sqft}
- Highlights: ${highlights}
- Neighborhood: ${neighborhood}
- Agent: ${agentName}, contact ${phone} | ${website}

RETURN JSON:
{
  "variants": [
    { "text": "...", "hashtags": ["#..."], "firstComment": "(optional for Instagram)" },
    { "text": "...", "hashtags": ["#..."] },
    { "text": "...", "hashtags": ["#..."] }
  ],
  "notes": "short note on choices",
  "warnings": ["any compliance concerns"]
}
    `.trim();
  }, [
    platform,
    tone,
    audience,
    useEmojis,
    hashtagCount,
    address,
    city,
    price,
    beds,
    baths,
    sqft,
    highlights,
    neighborhood,
    agentName,
    phone,
    website,
    openHouseDate,
  ]);

  const generate = async () => {
    setLoading(true);
    try {
      const raw = await callLLM(prompt);
      const data = JSON.parse(raw);
      // Enforce platform character limits
      const max = limitFor(platform);
      data.variants = (data.variants || []).map((v: any) => ({
        ...v,
        text: clampText(v.text || "", max),
      }));
      // Instagram first-comment handling
      if (platform === "Instagram" && igFirstComment) {
        data.variants = data.variants.map((v: any) => ({
          ...v,
          firstComment:
            v.firstComment ||
            (Array.isArray(v.hashtags) ? v.hashtags.join(" ") : ""),
          // keep caption lighter
        }));
      }
      setResult(data);
    } catch (e) {
      console.error(e);
      alert("Could not parse AI response. Check your API or prompt.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-bold">
            AI Social Post Generator (Real Estate)
          </h1>
          <button
            onClick={generate}
            disabled={loading}
            className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:opacity-90"
          >
            {loading ? "Generating…" : "Generate Posts"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: form */}
          <div className="space-y-6">
            <section className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4">
              <h2 className="font-semibold mb-3">Basics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block text-sm">
                  Platform
                  <select
                    className="input mt-1"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                  >
                    {platforms.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  Tone
                  <select
                    className="input mt-1"
                    value={tone}
                    onChange={(e) => setTone(e.target.value as Tone)}
                  >
                    {tones.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm sm:col-span-2">
                  Audience
                  <input
                    className="input mt-1"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g., Upsizing professionals in Lagos"
                  />
                </label>
                <label className="block text-sm">
                  Emojis
                  <select
                    className="input mt-1"
                    value={useEmojis ? "Yes" : "No"}
                    onChange={(e) => setUseEmojis(e.target.value === "Yes")}
                  >
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </label>
                <label className="block text-sm">
                  Hashtag count
                  <input
                    type="number"
                    min={0}
                    max={15}
                    className="input mt-1"
                    value={hashtagCount}
                    onChange={(e) => setHashtagCount(Number(e.target.value))}
                  />
                </label>
                <label className="block text-sm">
                  Open house date (optional)
                  <input
                    className="input mt-1"
                    value={openHouseDate}
                    onChange={(e) => setOpenHouseDate(e.target.value)}
                    placeholder="e.g., Sat Aug 23, 1–4pm"
                  />
                </label>
                {platform === "Instagram" && (
                  <label className="flex items-center gap-2 text-sm mt-2">
                    <input
                      type="checkbox"
                      checked={igFirstComment}
                      onChange={(e) => setIgFirstComment(e.target.checked)}
                    />
                    Put hashtags in first comment
                  </label>
                )}
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4">
              <h2 className="font-semibold mb-3">Listing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  className="input"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    className="input"
                    placeholder="Beds"
                    type="number"
                    value={beds}
                    onChange={(e) => setBeds(Number(e.target.value))}
                  />
                  <input
                    className="input"
                    placeholder="Baths"
                    type="number"
                    value={baths}
                    onChange={(e) => setBaths(Number(e.target.value))}
                  />
                  <input
                    className="input"
                    placeholder="Sqft"
                    type="number"
                    value={sqft}
                    onChange={(e) => setSqft(Number(e.target.value))}
                  />
                </div>
                <input
                  className="input sm:col-span-2"
                  placeholder="Neighborhood"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                />
                <textarea
                  className="textarea sm:col-span-2 h-24"
                  placeholder="Highlights (comma-separated)"
                  value={highlights}
                  onChange={(e) => setHighlights(e.target.value)}
                />
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4">
              <h2 className="font-semibold mb-3">Brand/Contact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  className="input"
                  placeholder="Agent or Brand Name"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <input
                  className="input sm:col-span-2"
                  placeholder="Website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </section>

            <p className="text-xs text-slate-500">
              ⚖️ Compliance: avoid targeting by protected classes or implying
              exclusivity; focus on property features and facts.
            </p>
          </div>

          {/* RIGHT: output */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Generated Variants</h2>
              <span className="text-xs text-slate-500">
                Max characters: {limitFor(platform)}
              </span>
            </div>

            {!result && (
              <div className="text-sm text-slate-500">
                Click “Generate Posts” to create platform-ready copy.
              </div>
            )}

            {result && (
              <div className="space-y-3">
                {result.variants.map((v, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">Variant {i + 1}</div>
                      <button
                        className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
                        onClick={() => copyText(v.text + (v.hashtags?.length ? `\n\n${v.hashtags.join(" ")}` : ""))}
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">
                      {v.text}
                    </p>
                    {!!v.hashtags?.length && (
                      <div className="mt-2 text-xs text-slate-600">
                        Hashtags: {v.hashtags.join(" ")}
                      </div>
                    )}
                    {platform === "Instagram" && v.firstComment && (
                      <div className="mt-2 text-xs text-slate-600">
                        First comment: {v.firstComment}
                      </div>
                    )}
                  </div>
                ))}

                {(result.notes || result.warnings?.length) && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 text-sm">
                    {result.notes && <div>Notes: {result.notes}</div>}
                    {result.warnings?.length ? (
                      <ul className="list-disc ml-5">
                        {result.warnings.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* minimal styles for inputs/buttons */}
      <style>{`
        .input { width:100%; border:1px solid #e5e7eb; border-radius:0.6rem; padding:0.5rem 0.75rem; font-size:0.9rem; }
        .input:focus { outline:none; box-shadow:0 0 0 3px rgba(59,130,246,.2); border-color:#93c5fd; }
        .textarea { width:100%; border:1px solid #e5e7eb; border-radius:0.6rem; padding:0.6rem 0.75rem; font-size:0.92rem; }
        .textarea:focus { outline:none; box-shadow:0 0 0 3px rgba(59,130,246,.2); border-color:#93c5fd; }
      `}</style>
    </div>
  );
};

export default AISocialPostGenerator;
