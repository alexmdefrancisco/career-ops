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

    // If value contains LaTeX markup, insert as-is; otherwise escape
    const isLatex = /\\[a-zA-Z]/.test(value) || /\\begin\b/.test(value);
    const replacement = isLatex ? value : escapeLatex(value);
    result = result.replaceAll(placeholder, replacement);
  }

  // Check for unfilled placeholders
  const unfilled = result.match(/<<[A-Z_]+>>/g);
  if (unfilled) {
    const unique = [...new Set(unfilled)];
    console.warn(`\u26a0\ufe0f  Unfilled placeholders: ${unique.join(', ')}`);
  }

  return result;
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
