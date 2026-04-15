# Mode: pipeline - URL Inbox (Second Brain)

Processes offer URLs queued in `data/pipeline.md`. The user adds URLs whenever and then runs `/career-ops pipeline` to process them all.

## Workflow

1. **Read** `data/pipeline.md`, find `- [ ]` items in the "Pending" section.
2. **For each pending URL**:
   a. Compute the next sequential `REPORT_NUM` (read `reports/`, take max + 1).
   b. **Extract JD** via Playwright (browser_navigate + browser_snapshot) then WebFetch then WebSearch.
   c. If the URL is not reachable, mark it as `- [!]` with a note and continue.
   d. **Run the full auto-pipeline**: A-F evaluation, Report .md, PDF (if score >= 3.0), Tracker.
   e. **Move from "Pending" to "Processed"**: `- [x] #NNN | URL | Company | Role | Score/5 | PDF green check / red X`.
3. **If there are 3+ pending URLs**, launch agents in parallel (Agent tool with `run_in_background`) to maximize speed.
4. **When done**, show a summary table:

```
| # | Company | Role | Score | PDF | Recommended action |
```

## pipeline.md format

```markdown
## Pending
- [ ] https://jobs.example.com/posting/123
- [ ] https://boards.greenhouse.io/company/jobs/456 | Company Inc | Senior PM
- [!] https://private.url/job - Error: login required

## Processed
- [x] #143 | https://jobs.example.com/posting/789 | Acme Corp | AI PM | 4.2/5 | PDF ok
- [x] #144 | https://boards.greenhouse.io/xyz/jobs/012 | BigCo | SA | 2.1/5 | PDF missing
```

## Smart JD extraction from URL

1. **Playwright (preferred):** `browser_navigate` + `browser_snapshot`. Works with all SPAs.
2. **WebFetch (fallback):** for static pages or when Playwright is unavailable.
3. **WebSearch (last resort):** look up the JD on secondary portals that index it.

**Special cases:**
- **LinkedIn:** may require login. Mark `[!]` and ask the user to paste the text.
- **PDF:** if the URL points to a PDF, read it directly with the Read tool.
- **`local:` prefix:** read the local file. Example: `local:jds/linkedin-pm-ai.md` reads `jds/linkedin-pm-ai.md`.

## Automatic numbering

1. List all files in `reports/`.
2. Extract the number from the prefix (e.g. `142-medispend...` gives 142).
3. New number = max found + 1.

## Source sync

Before processing any URL, verify sync:
```bash
node cv-sync-check.mjs
```
If there is a desync, warn the user before continuing.
