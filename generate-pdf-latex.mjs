#!/usr/bin/env node

/**
 * generate-pdf-latex.mjs — LaTeX → PDF via pdflatex
 *
 * Usage:
 *   node generate-pdf-latex.mjs cv <output.pdf> [--vars-file=vars.json]
 *   node generate-pdf-latex.mjs coverletter <output.pdf> [--vars-file=vars.json]
 *
 * The vars-file is a JSON object mapping placeholder names to their values.
 * Placeholders in templates use <<NAME>> syntax (double angle brackets).
 *
 * Requires: pdflatex (TeX Live) installed.
 */

import { resolve, dirname, basename } from 'path';
import { readFile, writeFile, copyFile, mkdir, rm } from 'fs/promises';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(__dirname, 'templates', 'latex');

/**
 * Escape special LaTeX characters in text content.
 * Does NOT escape content that is already LaTeX markup (commands, environments).
 */
function escapeLatex(text) {
  if (!text) return '';
  // Don't escape if the text contains LaTeX commands (starts with \ or contains \begin)
  if (/\\[a-zA-Z]/.test(text)) return text;
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([&%$#_{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

/**
 * Replace <<PLACEHOLDER>> tokens in template with values from vars object.
 * Values that look like raw LaTeX (contain \begin, \item, etc.) are inserted as-is.
 * Simple text values get LaTeX-escaped.
 */
function fillTemplate(template, vars) {
  let result = template;
  const missing = [];

  for (const [key, value] of Object.entries(vars)) {
    const placeholder = `<<${key}>>`;
    if (!result.includes(placeholder)) continue;

    // If value contains LaTeX markup, insert as-is; otherwise escape.
    // Recognise both command sequences (\textbf) AND escaped specials (\%, \&, \$, \#, \_, \{, \}).
    const isLatex = /\\([a-zA-Z]|[%&$#_{}])/.test(value) || /\\begin\b/.test(value);
    const replacement = isLatex ? value : escapeLatex(value);
    result = result.replaceAll(placeholder, replacement);
  }

  // Check for unfilled placeholders
  const unfilled = result.match(/<<[A-Z_]+>>/g);
  if (unfilled) {
    const unique = [...new Set(unfilled)];
    console.warn(`\u26a0\ufe0f  Unfilled placeholders: ${unique.join(', ')}`);
  }

  lintLatex(result);

  return result;
}

/**
 * Warn on common rendering hazards in filled .tex content.
 * Non-fatal; prints warnings so the human reviews before shipping.
 */
function lintLatex(tex) {
  const warn = (msg, sample) => console.warn(`\u26a0\ufe0f  Lint: ${msg}${sample ? ` \u2192 "${sample}"` : ''}`);

  // 1. Em-dash (AI watermark)
  if (tex.includes('\u2014')) warn('em-dash detected (avoid; use ":" or " - ")');

  // 2. Broken escape: double-escaped special char (rendered as "\{}%", "\{}&", etc.)
  //    Comes from running escapeLatex() on a value that already contained \% / \& etc.
  const broken = tex.match(/\\textbackslash\\?\{\\?\}\\?[%&$#_]/);
  if (broken) warn('double-escaped special character (value was already LaTeX; detection missed it)', broken[0]);
  const brokenShort = tex.match(/\\\{\}%/);
  if (brokenShort) warn('broken percent escape "\\{}%" (use "\\%")', brokenShort[0]);

  // 3. Orphan label: "Word:" or "Word:" followed by regular space + \href (line-break hazard)
  const orphan = tex.match(/\b([A-Z][a-zA-Z]+): \\href\b/);
  if (orphan) warn(`orphan label "${orphan[1]}:" before \\href (use "${orphan[1]}:~\\href" to avoid line break)`, orphan[0]);

  // 4. Unescaped & outside of LaTeX commands (between letters, e.g. "R&D")
  const amp = tex.match(/[A-Za-z0-9] & [A-Za-z0-9]/);
  if (amp) warn('unescaped "&" between words (use "\\&")', amp[0]);

  // 5. Raw < or > outside of math (e.g. "<5%" should be "$<$5\%")
  const lt = tex.match(/(?<![\\$])<\d/);
  if (lt) warn('raw "<" before digit (wrap in math: "$<$")', lt[0]);

  // 6. Missing digit after "$<$" or "$>$": "($<$\%" instead of "($<$5\%"
  const noDigit = tex.match(/\$[<>]\$\s*\\?[%&a-zA-Z]/);
  if (noDigit) warn('math "<" or ">" not followed by a number (missing digit?)', noDigit[0]);

  // 7. Unescaped "%" after a digit (LaTeX treats % as start-of-comment, silently eating the rest of the line)
  //    Matches e.g. "5%" or "35%+" when not already "5\%".
  const unesc = tex.match(/(?<!\\)\d%/);
  if (unesc) warn('unescaped "%" after digit (use "\\%", else LaTeX swallows the rest of the line)', unesc[0]);

  // 8. Awkward role subtitle: "Role : Subtitle" (leftover from em-dash -> colon sweep).
  //    rSubsection's 3rd arg is the role; a " : " inside it reads weirdly in rendered italic.
  const roleColon = tex.match(/\\begin\{rSubsection\}\{[^}]*\}\{[^}]*\}\{[^}]*\s:\s[^}]*\}/);
  if (roleColon) warn('role subtitle contains " : " (prefer "," or " - "; em-dash swept too aggressively)', roleColon[0].slice(0, 80) + '...');
}

async function generatePDF() {
  const args = process.argv.slice(2);

  let docType, outputPath, varsFile;

  for (const arg of args) {
    if (arg.startsWith('--vars-file=')) {
      varsFile = arg.split('=')[1];
    } else if (!docType) {
      docType = arg;
    } else if (!outputPath) {
      outputPath = arg;
    }
  }

  if (!docType || !outputPath) {
    console.error('Usage: node generate-pdf-latex.mjs <cv|coverletter> <output.pdf> [--vars-file=vars.json]');
    process.exit(1);
  }

  if (!['cv', 'coverletter'].includes(docType)) {
    console.error(`Invalid doc type "${docType}". Use: cv, coverletter`);
    process.exit(1);
  }

  outputPath = resolve(outputPath);

  // Read vars
  let vars = {};
  if (varsFile) {
    const varsContent = await readFile(resolve(varsFile), 'utf-8');
    vars = JSON.parse(varsContent);
  }

  // Read template
  const templateFile = docType === 'cv' ? 'cv-template.tex' : 'coverletter.tex';
  const template = await readFile(resolve(TEMPLATES_DIR, templateFile), 'utf-8');

  // Fill template
  const filled = fillTemplate(template, vars);

  // Create temp build directory
  const tmpDir = resolve('/tmp', `career-ops-latex-${Date.now()}`);
  await mkdir(tmpDir, { recursive: true });

  // Write filled .tex file
  const texFile = resolve(tmpDir, `${docType}.tex`);
  await writeFile(texFile, filled);

  // Copy resume.cls to build dir (needed for CV)
  if (docType === 'cv') {
    await copyFile(resolve(TEMPLATES_DIR, 'resume.cls'), resolve(tmpDir, 'resume.cls'));
  }

  console.log(`\ud83d\udcc4 Template: ${templateFile}`);
  console.log(`\ud83d\udcc1 Output:   ${outputPath}`);
  console.log(`\ud83d\udce6 Build:    ${tmpDir}`);

  // Run pdflatex twice (for references/hyperlinks)
  try {
    for (let pass = 1; pass <= 2; pass++) {
      console.log(`\ud83d\udd27 pdflatex pass ${pass}/2...`);
      execSync(
        `pdflatex -interaction=nonstopmode -output-directory="${tmpDir}" "${texFile}"`,
        { stdio: 'pipe', timeout: 30000 }
      );
    }
  } catch (err) {
    // Read the log for error details
    const logFile = resolve(tmpDir, `${docType}.log`);
    if (existsSync(logFile)) {
      const log = await readFile(logFile, 'utf-8');
      const errors = log.split('\n').filter(l => l.startsWith('!') || l.includes('Error'));
      console.error('\u274c LaTeX compilation failed:');
      errors.forEach(e => console.error(`  ${e}`));
    } else {
      console.error('\u274c LaTeX compilation failed:', err.message);
    }
    process.exit(1);
  }

  // Copy PDF to output
  const builtPdf = resolve(tmpDir, `${docType}.pdf`);
  if (!existsSync(builtPdf)) {
    console.error('\u274c PDF not generated — check LaTeX log');
    process.exit(1);
  }

  // Check page count from LaTeX log
  const logFile = resolve(tmpDir, `${docType}.log`);
  let pageCount = 1;
  if (existsSync(logFile)) {
    const log = await readFile(logFile, 'utf-8');
    const pageMatch = log.match(/Output written on .+ \((\d+) page/);
    if (pageMatch) pageCount = parseInt(pageMatch[1], 10);
  }

  await copyFile(builtPdf, outputPath);

  // Mirror the .tex file into output_latex/ with the same subpath as the PDF.
  // Example: output/004-flowtraders-.../Alex_Martinez_CV_FlowTraders.pdf
  //       -> output_latex/004-flowtraders-.../Alex_Martinez_CV_FlowTraders.tex
  const cwd = process.cwd();
  const rel = outputPath.startsWith(cwd + '/') ? outputPath.slice(cwd.length + 1) : null;
  if (rel && rel.startsWith('output/')) {
    const subdir = dirname(rel.slice('output/'.length));
    const texOut = resolve(cwd, 'output_latex', subdir, `${docType}.tex`);
    await mkdir(dirname(texOut), { recursive: true });
    await copyFile(texFile, texOut);
    console.log(`\ud83d\udcdd LaTeX:  ${texOut}`);
  }

  // Get file size
  const { statSync } = await import('fs');
  const stat = statSync(outputPath);

  // Cleanup temp dir
  await rm(tmpDir, { recursive: true, force: true });

  console.log(`\u2705 PDF generated: ${outputPath}`);
  console.log(`\ud83d\udcca Pages: ${pageCount}`);
  console.log(`\ud83d\udce6 Size: ${(stat.size / 1024).toFixed(1)} KB`);

  if (pageCount > 1) {
    console.error(`\u26a0\ufe0f  WARNING: ${pageCount} pages detected — content overflows 1 page! Reduce content and re-generate.`);
    process.exit(2);
  }

  return { outputPath, pageCount, size: stat.size };
}

generatePDF().catch((err) => {
  console.error('\u274c PDF generation failed:', err.message);
  process.exit(1);
});
