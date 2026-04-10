# Modo: pdf — Generación de PDF via LaTeX

## Pipeline completo

1. Lee `cv.md` como fuente de verdad
2. Pide al usuario el JD si no está en contexto (texto o URL)
3. Extrae 15-20 keywords del JD
4. Detecta idioma del JD → idioma del CV (EN default)
5. Detecta arquetipo del rol → adapta framing
6. Reescribe Profile inyectando keywords del JD + narrative bridge
7. Selecciona top 3-4 proyectos más relevantes para la oferta
8. Reordena bullets de experiencia por relevancia al JD
9. Inyecta keywords naturalmente en logros existentes (NUNCA inventa)
10. Genera JSON vars file con todo el contenido LaTeX
11. Create output subdirectory: `mkdir -p output/{report_name}/` where `{report_name}` matches the report filename without extension (e.g., `042-citadel-2026-04-09`)
12. Ejecuta: `node generate-pdf-latex.mjs cv output/{report_name}/Alex_Martinez_CV_{CompanyName}.pdf --vars-file=/tmp/cv-vars-{company}.json`
    - `{CompanyName}` uses PascalCase/natural casing (e.g., `Citadel`, `JaneStreet`, `GoldmanSachs`)
12. Reporta: ruta del PDF, tamaño

## Cover Letter (when needed)

Generate a cover letter alongside the CV when:
- The application form has a cover letter field
- The user explicitly requests one
- Score >= 4.0 (proactively offer)

Pipeline:
1. Generate tailored body text: opening paragraph + 3 bullet points + closing. 1 page max.
2. Map JD requirements to proof points from cv.md
3. Generate JSON vars file with cover letter content
4. Ejecuta: `node generate-pdf-latex.mjs coverletter output/{report_name}/Alex_Martinez_CoverLetter_{CompanyName}.pdf --vars-file=/tmp/cl-vars-{company}.json`
   - Same `{report_name}` subdirectory and `{CompanyName}` convention as the CV

## LaTeX Templates

Templates live in `templates/latex/`:

| File | Purpose |
|------|---------|
| `resume.cls` | Document class (layout, fonts, environments) |
| `cv-template.tex` | CV template with `<<PLACEHOLDER>>` tokens |
| `coverletter.tex` | Cover letter template with `<<PLACEHOLDER>>` tokens |

## CV Placeholders (vars JSON)

| Placeholder | Content | Type |
|-------------|---------|------|
| `<<NAME>>` | Full name (UTF-8) | plain text |
| `<<PHONE>>` | Display phone | plain text |
| `<<PHONE_RAW>>` | Phone for tel: link | plain text |
| `<<EMAIL>>` | Email address | plain text |
| `<<GITHUB>>` | GitHub username | plain text |
| `<<LINKEDIN>>` | LinkedIn username | plain text |
| `<<PROFILE>>` | Tailored profile/summary paragraph | plain text |
| `<<ACHIEVEMENTS_SECTION>>` | Full rSection block with achievements | raw LaTeX |
| `<<EDUCATION_SECTION>>` | Full rSection block with education | raw LaTeX |
| `<<EXPERIENCE_SECTION>>` | Full rSection block with experience | raw LaTeX |
| `<<PROJECTS_SECTION>>` | Full rSection block with projects | raw LaTeX |
| `<<SKILLS_SECTION>>` | Full rSection block with skills | raw LaTeX |

**"raw LaTeX" fields** contain `\begin{rSection}`, `\begin{rSubsection}`, `\item`, `\textbf{}`, `\href{}{}`, etc. They are inserted as-is.

**"plain text" fields** are auto-escaped by the script (special chars like `&`, `%`, `#` → `\&`, `\%`, `\#`). Use UTF-8 directly for accented characters (e.g., `Martínez`, not `Mart\'{i}nez`).

## Cover Letter Placeholders (vars JSON)

| Placeholder | Content | Type |
|-------------|---------|------|
| `<<NAME>>` | Full name (UTF-8) | plain text |
| `<<PHONE>>` | Display phone | plain text |
| `<<EMAIL>>` | Email address | plain text |
| `<<GITHUB>>` | GitHub username | plain text |
| `<<LINKEDIN>>` | LinkedIn username | plain text |
| `<<COMPANY>>` | Company name | plain text |
| `<<RECIPIENT>>` | Greeting recipient (e.g., "Hiring Team") | plain text |
| `<<POSITION>>` | Exact position title | plain text |
| `<<GREETING>>` | "Dear" / "Sehr geehrte(r)" / etc. | plain text |
| `<<CLOSER>>` | "Kind Regards" / "Mit freundlichen Grüßen" / etc. | plain text |
| `<<DATE>>` | Formatted date (e.g., "April 9, 2026") | plain text |
| `<<BODY>>` | Full letter body with `\begin{itemize}` etc. | raw LaTeX |

## Cover Letter Body Structure

Keep it tight — 1 page max. **The structure is not fixed** — adapt it to the role, company, and context. No filler, no "I am writing to express..." fluff.

### Principles (always apply)

- Lead with the value prop, not with yourself.
- Every claim needs evidence (metric, project, result).
- Match the tone to the audience — a hedge fund desk expects precision, a fintech startup expects energy.
- End with a clear call to action.

### Adapt the structure to the context

**Quant / systematic roles:** Lead with your strongest quantitative result (signal, PnL, Sharpe, latency). Use 2-3 short paragraphs rather than bullet points — quant readers scan for depth, not formatting. Mention specific tools/frameworks (Python, C++, Bayesian methods, etc.) inline rather than listing them. Close technically — reference a paper, a methodology, or a specific problem the team works on.

**Finance — general / portfolio / risk:** Open with domain credibility (AUM, risk frameworks, regulatory knowledge). Bullet points work well here to map JD requirements → your evidence. 3-4 bullets max. Close with strategic interest in the firm's direction.

**Referral / warm intro:** Shorter overall. Name the connection in the opening line. 1-2 paragraphs max — the referral does the heavy lifting, the letter just confirms fit.

**Speculative / no open role:** Frame around a specific problem you can solve for them, not a job title. 2 paragraphs: what you bring + why this firm specifically.

### Fallback (when none of the above fits)

```
Opening paragraph (2-3 sentences): Position + why you're a fit.

2-4 bullet points mapping JD requirements → proof points:
  - \textbf{Requirement:} Your evidence (metric, project, result)

Closing paragraph (1-2 sentences): Interest + call to action.
```

## Reglas ATS (parseo limpio)

- Layout single-column (sin sidebars, sin columnas paralelas)
- Headers estándar: "Profile", "Achievements", "Education", "Experience", "Project", "Skills & Interests"
- UTF-8 text, selectable (LaTeX default)
- Keywords del JD distribuidas: Profile (top 5), primer bullet de cada rol, Skills section

## Estrategia de keyword injection (ético, basado en verdad)

Ejemplos de reformulación legítima:
- JD dice "RAG pipelines" y CV dice "LLM workflows with retrieval" → cambiar a "RAG pipeline design and LLM orchestration workflows"
- JD dice "MLOps" y CV dice "observability, evals, error handling" → cambiar a "MLOps and observability: evals, error handling, cost monitoring"
- JD dice "stakeholder management" y CV dice "collaborated with team" → cambiar a "stakeholder management across engineering, operations, and business"

**NUNCA añadir skills que el candidato no tiene. Solo reformular experiencia real con el vocabulario exacto del JD.**

## Canva CV Generation (optional)

If `config/profile.yml` has `canva_resume_design_id` set, offer the user a choice before generating:
- **"LaTeX/PDF (default, ATS-optimized)"** — flow above
- **"Canva CV (visual, design-preserving)"** — see Canva workflow below

If the user has no `canva_resume_design_id`, skip this prompt and use the LaTeX flow.

### Canva workflow

#### Step 1 — Duplicate the base design

a. `export-design` the base design (using `canva_resume_design_id`) as PDF → get download URL
b. `import-design-from-url` using that download URL → creates a new editable design (the duplicate)
c. Note the new `design_id` for the duplicate

#### Step 2 — Read the design structure

a. `get-design-content` on the new design → returns all text elements (richtexts) with their content
b. Map text elements to CV sections by content matching:
   - Look for the candidate's name → header section
   - Look for "Summary" or "Professional Summary" → summary section
   - Look for company names from cv.md → experience sections
   - Look for degree/school names → education section
   - Look for skill keywords → skills section
c. If mapping fails, show the user what was found and ask for guidance

#### Step 3 — Generate tailored content

Same content generation as the LaTeX flow:
- Rewrite Profile with JD keywords + narrative bridge
- Reorder experience bullets by JD relevance
- Select top competencies from JD requirements
- Inject keywords naturally (NEVER invent)

**IMPORTANT — Character budget rule:** Each replacement text MUST be approximately the same length as the original text it replaces (within ±15% character count). If tailored content is longer, condense it. The Canva design has fixed-size text boxes — longer text causes overlapping with adjacent elements. Count the characters in each original element from Step 2 and enforce this budget when generating replacements.

#### Step 4 — Apply edits

a. `start-editing-transaction` on the duplicate design
b. `perform-editing-operations` with `find_and_replace_text` for each section:
   - Replace summary text with tailored summary
   - Replace each experience bullet with reordered/rewritten bullets
   - Replace competency/skills text with JD-matched terms
   - Replace project descriptions with top relevant projects
c. **Reflow layout after text replacement:**
   After applying all text replacements, the text boxes auto-resize but neighboring elements stay in place. This causes uneven spacing between work experience sections. Fix this:
   1. Read the updated element positions and dimensions from the `perform-editing-operations` response
   2. For each work experience section (top to bottom), calculate where the bullets text box ends: `end_y = top + height`
   3. The next section's header should start at `end_y + consistent_gap` (use the original gap from the template, typically ~30px)
   4. Use `position_element` to move the next section's date, company name, role title, and bullets elements to maintain even spacing
   5. Repeat for all work experience sections
d. **Verify layout before commit:**
   - `get-design-thumbnail` with the transaction_id and page_index=1
   - Visually inspect the thumbnail for: text overlapping, uneven spacing, text cut off, text too small
   - If issues remain, adjust with `position_element`, `resize_element`, or `format_text`
   - Repeat until layout is clean
d. Show the user the final preview and ask for approval
e. `commit-editing-transaction` to save (ONLY after user approval)

#### Step 5 — Export and download PDF

a. `export-design` the duplicate as PDF
b. **IMMEDIATELY** download the PDF using Bash:
   ```bash
   curl -sL -o "output/{report_name}/Alex_Martinez_CV_{CompanyName}.pdf" "{download_url}"
   ```
   The export URL is a pre-signed S3 link that expires in ~2 hours. Download it right away.
c. Verify the download:
   ```bash
   file output/{report_name}/Alex_Martinez_CV_{CompanyName}.pdf
   ```
   Must show "PDF document". If it shows XML or HTML, the URL expired — re-export and retry.
d. Report: PDF path, file size, Canva design URL (for manual tweaking)

#### Error handling

- If `import-design-from-url` fails → fall back to LaTeX pipeline with message
- If text elements can't be mapped → warn user, show what was found, ask for manual mapping
- If `find_and_replace_text` finds no matches → try broader substring matching
- Always provide the Canva design URL so the user can edit manually if auto-edit fails

## Post-generación

Actualizar tracker si la oferta ya está registrada: cambiar PDF de ❌ a ✅.
