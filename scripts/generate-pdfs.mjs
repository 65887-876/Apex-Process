// Generates simple, valid, branded sample PDFs into /public/pdfs with NO deps.
// Run: node scripts/generate-pdfs.mjs
// These are deliberately minimal placeholders. Replace with counsel-reviewed
// branded documents before production.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "pdfs");
mkdirSync(outDir, { recursive: true });

// Escape text for PDF string literals.
function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

/**
 * Build a one-page PDF from an array of {text, size, gap} lines.
 * Uses Helvetica (a standard 14 font, no embedding required).
 */
function buildPdf(lines) {
  const objects = [];
  // Content stream
  let content = "BT\n";
  let y = 760;
  content += `/F1 12 Tf\n`;
  for (const line of lines) {
    const size = line.size ?? 12;
    content += `/F1 ${size} Tf\n`;
    content += `1 0 0 1 56 ${y} Tm\n`;
    content += `(${esc(line.text)}) Tj\n`;
    y -= line.gap ?? size + 8;
  }
  content += "ET\n";

  const header = "%PDF-1.4\n";
  // Object bodies (1-indexed); we fill xref offsets while concatenating.
  const bodies = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = header;
  const offsets = [];
  bodies.forEach((body, i) => {
    offsets[i] = Buffer.byteLength(pdf, "latin1");
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefStart = Buffer.byteLength(pdf, "latin1");
  const count = bodies.length + 1;
  let xref = `xref\n0 ${count}\n`;
  xref += "0000000000 65535 f \n";
  for (let i = 0; i < bodies.length; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += xref;
  pdf += `trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "latin1");
}

const disclaimer =
  "SAMPLE DOCUMENT - Placeholder language for illustration only. Not legal, tax, or financial advice. Review with qualified counsel before any use.";

const docs = [
  {
    file: "apex-sample-program-overview.pdf",
    lines: [
      { text: "Apex Process", size: 24, gap: 34 },
      { text: "Sample Program Overview", size: 16, gap: 30 },
      { text: disclaimer, size: 9, gap: 26 },
      { text: "1. About this document", size: 13, gap: 20 },
      { text: "This overview summarizes the Apex Process onboarding workflow at a high level.", size: 11, gap: 18 },
      { text: "It is provided for informational review only.", size: 11, gap: 26 },
      { text: "2. Process stages", size: 13, gap: 20 },
      { text: "Apply, Initial review, Document request, Discovery call, Agreement review, Onboarding.", size: 11, gap: 18 },
      { text: "Each stage has a defined purpose and a clear handoff to the next.", size: 11, gap: 26 },
      { text: "3. What we do not promise", size: 13, gap: 20 },
      { text: "Submitting an application does not guarantee approval, compensation, or any outcome.", size: 11, gap: 18 },
      { text: "Consult qualified legal and tax professionals before signing any agreement.", size: 11, gap: 18 },
    ],
  },
  {
    file: "apex-sample-agreement-template.pdf",
    lines: [
      { text: "Apex Process", size: 24, gap: 34 },
      { text: "Sample Agreement Template", size: 16, gap: 30 },
      { text: disclaimer, size: 9, gap: 26 },
      { text: "PARTIES", size: 13, gap: 20 },
      { text: "This template agreement is between [Apex Process Entity] and [Applicant Name].", size: 11, gap: 26 },
      { text: "1. SCOPE (placeholder)", size: 13, gap: 20 },
      { text: "Describes the structured onboarding services to be provided. [Placeholder clause.]", size: 11, gap: 26 },
      { text: "2. OBLIGATIONS (placeholder)", size: 13, gap: 20 },
      { text: "Applicant agrees to provide accurate information and required documents. [Placeholder.]", size: 11, gap: 26 },
      { text: "3. NO GUARANTEE (placeholder)", size: 13, gap: 20 },
      { text: "Nothing herein guarantees approval, income, or any financial result. [Placeholder.]", size: 11, gap: 26 },
      { text: "4. GOVERNING LAW (placeholder)", size: 13, gap: 20 },
      { text: "[Jurisdiction]. Each party should obtain independent legal advice before signing.", size: 11, gap: 18 },
    ],
  },
  {
    file: "apex-sample-compliance-disclosure.pdf",
    lines: [
      { text: "Apex Process", size: 24, gap: 34 },
      { text: "Sample Compliance & Disclosure Summary", size: 15, gap: 30 },
      { text: disclaimer, size: 9, gap: 26 },
      { text: "1. Information we collect", size: 13, gap: 20 },
      { text: "We collect only what each stage requires. We do not collect SSNs on the application form.", size: 11, gap: 26 },
      { text: "2. How we use it", size: 13, gap: 20 },
      { text: "Information is used solely to review your application against published criteria.", size: 11, gap: 26 },
      { text: "3. Your responsibilities", size: 13, gap: 20 },
      { text: "Provide accurate information and review any agreement with your own advisors.", size: 11, gap: 26 },
      { text: "4. No guarantee disclosure", size: 13, gap: 20 },
      { text: "Apex Process makes no promise of income, partnership, or any financial outcome.", size: 11, gap: 18 },
    ],
  },
];

for (const doc of docs) {
  const buf = buildPdf(doc.lines);
  writeFileSync(join(outDir, doc.file), buf);
  console.log(`wrote public/pdfs/${doc.file} (${buf.length} bytes)`);
}
