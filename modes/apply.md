# Mode: apply - Live Application Assistant

Interactive mode for when the candidate is filling out an application form in Chrome. Reads what is on screen, loads prior context for the role, and generates personalized answers for each form question.

## Requirements

- **Best with Playwright visible**: in visible mode, the candidate sees the browser and Claude can interact with the page.
- **Without Playwright**: the candidate shares a screenshot or pastes the questions manually.

## Workflow

```
1. DETECT     -> Read active Chrome tab (screenshot / URL / title)
2. IDENTIFY   -> Extract company + role from the page
3. SEARCH     -> Match against existing reports in reports/
4. LOAD       -> Read the full report + Section G (if present)
5. COMPARE    -> Does the on-screen role match the evaluated one? If it changed, warn.
6. ANALYZE    -> Identify ALL visible form questions
7. GENERATE   -> For each question, generate a personalized answer
8. PRESENT    -> Show answers formatted for copy-paste
```

## Step 1 - Detect the offer

**With Playwright:** take a snapshot of the active page. Read title, URL, and visible content.

**Without Playwright:** ask the candidate to:
- Share a screenshot of the form (the Read tool reads images)
- Or paste the form questions as text
- Or give company + role so we can look it up

## Step 2 - Identify and load context

1. Extract company name and role title from the page.
2. Search `reports/` by company name (Grep, case-insensitive).
3. If there is a match, load the full report.
4. If a Section G exists, load the prior draft answers as a base.
5. If there is NO match, warn and offer to run a quick auto-pipeline.

## Step 3 - Detect role changes

If the on-screen role differs from the evaluated one:
- **Warn the candidate**: "The role changed from [X] to [Y]. Do you want me to re-evaluate or adapt the answers to the new title?"
- **If adapt**: adjust answers to the new role without re-evaluating.
- **If re-evaluate**: run a full A-F evaluation, update the report, regenerate Section G.
- **Update tracker**: change the role title in applications.md if applicable.

## Step 4 - Analyze form questions

Identify ALL visible questions:
- Free-text fields (cover letter, why this role, etc.)
- Dropdowns (how did you hear, work authorization, etc.)
- Yes / No (relocation, visa, etc.)
- Salary fields (range, expectation)
- Upload fields (resume, cover letter PDF)

Classify each question:
- **Already answered in Section G**: adapt the existing answer.
- **New question**: generate the answer from the report + cv.md.

## Step 5 - Generate answers

For each question, generate the answer following:

1. **Report context**: use proof points from Block B, STAR stories from Block F.
2. **Prior Section G**: if a draft answer exists, use it as a base and refine.
3. **"I'm choosing you" tone**: same framework as auto-pipeline.
4. **Specificity**: reference something concrete from the JD visible on screen.
5. **career-ops proof point**: include it under "Additional info" if such a field exists.

**Output format:**

```
## Answers for [Company] - [Role]

Based on: Report #NNN | Score: X.X/5 | Archetype: [type]

---

### 1. [Exact form question]
> [Answer ready for copy-paste]

### 2. [Next question]
> [Answer]

...

---

Notes:
- [Any observations about the role, changes, etc.]
- [Suggested personalization the candidate should review]
```

## Step 6 - Post-apply (optional)

If the candidate confirms the application was sent:
1. Update status in `applications.md` from "Evaluated" to "Applied".
2. Update Section G of the report with the final answers.
3. Suggest the next step: `/career-ops contacto` for LinkedIn outreach.

## Scroll handling

If the form has more questions than are visible:
- Ask the candidate to scroll and share another screenshot.
- Or paste the remaining questions.
- Process in iterations until the entire form is covered.
