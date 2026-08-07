# Mode: oferta - Full A-G Evaluation

When the candidate pastes an offer (text or URL), ALWAYS deliver the 7 blocks (A-F evaluation + G legitimacy):

## Step 0 - Archetype detection

Classify the offer into one of the 6 archetypes (see `_shared.md`). If hybrid, name the 2 closest. This determines:
- Which proof points to prioritize in Block B.
- How to rewrite the summary in Block E.
- Which STAR stories to prepare in Block F.

## Block A - Role Summary

MANDATORY Section A table. The dashboard parser reads these rows by exact label; if a row is missing, the report card on the dashboard is blank. Include at minimum:

- `| Archetype | … |` - detected archetype
- `| Domain | … |` - platform / agentic / LLMOps / ML / enterprise / etc.
- `| Function | … |` - build / consult / manage / deploy
- `| Seniority | … |`
- `| Remote | … |` - full / hybrid / onsite - **required**
- `| Comp | … |` - estimated band or `n/d` if the JD does not list it - **required**
- `| Team size | … |` - if mentioned (optional)
- `| TL;DR | … |` - one sentence - **required**

Extra rows (Recruiter, Posted, Deadline, etc.) are fine, but the rows marked required must exist with those exact labels.

## Block B - CV Match

Read `cv.md`. Create a table mapping each JD requirement to exact CV lines.

**Adapted to archetype:**
- FDE: prioritize proof points of fast delivery and client-facing work.
- SA: prioritize systems design and integrations.
- PM: prioritize product discovery and metrics.
- LLMOps: prioritize evals, observability, pipelines.
- Agentic: prioritize multi-agent, HITL, orchestration.
- Transformation: prioritize change management, adoption, scaling.

A **gaps** section with a mitigation plan for each. For each gap:
1. Is it a hard blocker or nice-to-have?
2. Can the candidate show adjacent experience?
3. Is there a portfolio project that covers this gap?
4. Concrete mitigation plan (cover letter line, quick project, etc.).

## Block C - Level and Strategy

1. **Level detected** in the JD vs **candidate's natural level** for that archetype.
2. **Plan "sell senior without lying"**: specific lines adapted to the archetype, concrete achievements to highlight, how to position founder experience as an advantage.
3. **Plan "if they downlevel me"**: accept if comp is fair, negotiate a 6-month review, clear promotion criteria.

## Block D - Comp and Demand

Use WebSearch for:
- Current role salaries (Glassdoor, Levels.fyi, Blind).
- Company comp reputation.
- Role demand trend.

Table with data and cited sources. If there is no data, say so rather than inventing.

## Block E - Personalization Plan

| # | Section | Current | Proposed change | Why |
|---|---------|---------|-----------------|-----|
| 1 | Summary | ... | ... | ... |
| ... | ... | ... | ... | ... |

Top 5 CV changes + top 5 LinkedIn changes to maximize match.

## Block F - Interview Plan

6-10 STAR+R stories mapped to JD requirements (STAR + **Reflection**):

| # | JD requirement | STAR+R story | S | T | A | R | Reflection |
|---|----------------|--------------|---|---|---|---|------------|

The **Reflection** column captures what was learned or what would be done differently. This signals seniority: junior candidates describe what happened, senior candidates extract lessons.

**Story Bank:** if `interview-prep/story-bank.md` exists, check whether any of these stories are already there. If not, append the new ones. Over time this builds a reusable bank of 5-10 master stories that can be adapted to any interview question.

**Selected and framed by archetype:**
- FDE: emphasize delivery speed and client-facing work.
- SA: emphasize architecture decisions.
- PM: emphasize discovery and trade-offs.
- LLMOps: emphasize metrics, evals, production hardening.
- Agentic: emphasize orchestration, error handling, HITL.
- Transformation: emphasize adoption and organizational change.

Also include:
- 1 recommended case study (which project to present and how).
- Red-flag questions and how to answer them (e.g. "why did you sell your company?", "do you have direct reports?").

## Block G - Posting Legitimacy

Analyze the job posting for signals that indicate whether this is a real, active opening. This helps the user prioritize their effort on opportunities most likely to result in a hiring process.

**Ethical framing:** present observations, not accusations. Every signal has legitimate explanations. The user decides how to weigh them.

### Signals to analyze (in order):

**1. Posting Freshness** (from Playwright snapshot, already captured in Step 0):
- Date posted or "X days ago", extract from the page.
- Apply button state (active / closed / missing / redirects to generic page).
- If URL redirected to a generic careers page, note it.

**2. Description Quality** (from JD text):
- Does it name specific technologies, frameworks, tools?
- Does it mention team size, reporting structure, or org context?
- Are requirements realistic? (years of experience vs technology age)
- Is there a clear scope for the first 6-12 months?
- Is salary / compensation mentioned?
- What ratio of the JD is role-specific vs generic boilerplate?
- Any internal contradictions? (entry-level title + staff requirements, etc.)

**3. Company Hiring Signals** (2-3 WebSearch queries, combine with Block D research):
- Search: `"{company}" layoffs {year}`. Note date, scale, departments.
- Search: `"{company}" hiring freeze {year}`. Note any announcements.
- If layoffs found: are they in the same department as this role?

**4. Reposting Detection** (from scan-history.tsv):
- Check whether company + similar role title appeared before with a different URL.
- Note how many times and over what period.

**5. Role Market Context** (qualitative, no additional queries):
- Is this a common role that typically fills in 4-6 weeks?
- Does the role make sense for this company's business?
- Is the seniority level one that legitimately takes longer to fill?

### Output format:

**Assessment:** one of three tiers:
- **High Confidence**: multiple signals suggest a real, active opening.
- **Proceed with Caution**: mixed signals worth noting.
- **Suspicious**: multiple ghost-job indicators, investigate before investing time.

**Signals table:** each observed signal with its finding and weight (Positive / Neutral / Concerning).

**Context Notes:** any caveats (niche role, government job, evergreen position, etc.) that explain potentially concerning signals.

### Edge-case handling:
- **Government / academic postings:** longer timelines are standard. Adjust thresholds (60-90 days is normal).
- **Evergreen / continuous-hire postings:** if the JD explicitly says "ongoing" or "rolling", note it as context. This is not a ghost job, it is a pipeline role.
- **Niche / executive roles:** Staff+, VP, Director, or highly specialized roles legitimately stay open for months. Adjust age thresholds accordingly.
- **Startup / pre-revenue:** early-stage companies may have vague JDs because the role is genuinely undefined. Weight description vagueness less heavily.
- **No date available:** if posting age cannot be determined and no other signals are concerning, default to "Proceed with Caution" with a note that limited data was available. NEVER default to "Suspicious" without evidence.
- **Recruiter-sourced (no public posting):** freshness signals unavailable. Note that active recruiter contact is itself a positive legitimacy signal.

---

## Post-evaluation

**ALWAYS** after generating blocks A-G:

### 1. Save the report .md

Save the full evaluation to `reports/{###}-{company-slug}-{YYYY-MM-DD}.md`.

- `{###}`: next sequential number (3 digits, zero-padded).
- `{company-slug}`: company name in lowercase, no spaces (use hyphens).
- `{YYYY-MM-DD}`: current date.

**Report format:**

All header fields below are MANDATORY. The dashboard parser and `verify-pipeline.mjs` will fail if any are missing. `TL;DR` is required (not optional): one sentence that the dashboard preview shows when the user navigates to this report.

```markdown
# Evaluation: {Company} - {Role}

**Date:** {YYYY-MM-DD}
**Archetype:** {detected}
**Score:** {X/5}
**Legitimacy:** {High Confidence | Proceed with Caution | Suspicious}
**URL:** {original posting URL}
**PDF:** {path or pending}
**TL;DR:** {one-sentence summary of the role and fit}

---

## A) Role Summary
(full Block A content, including the mandatory Section A table)

## B) CV Match
(full Block B content)

## C) Level and Strategy
(full Block C content)

## D) Comp and Demand
(full Block D content)

## E) Personalization Plan
(full Block E content)

## F) Interview Plan
(full Block F content)

## G) Posting Legitimacy
(full Block G content)

## H) Draft Application Answers
(only if score >= 4.5, drafts of answers for the application form)

---

## Extracted keywords
(list of 15-20 keywords from the JD for ATS optimization)
```

### 2. Register in the tracker

**ALWAYS** register in `data/applications.md`:
- Next sequential number.
- Current date.
- Company.
- Role.
- Score: match average (1-5).
- Status: `Evaluated`.
- PDF: red X (or green check if auto-pipeline generated a PDF).
- Report: relative link to the report .md (e.g. `[001](reports/001-company-2026-01-01.md)`).

**Tracker format:**

```markdown
| # | Date | Company | Role | Score | Status | PDF | Report |
```
