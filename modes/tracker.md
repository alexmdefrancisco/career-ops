# Mode: tracker - Applications Tracker

Read and display `data/applications.md`.

**Tracker format:**
```markdown
| # | Date | Company | Role | Score | Status | PDF | Report |
```

Possible statuses (canonical, per `templates/states.yml`): `Evaluated` → `Applied` → `Responded` → `Interview` → `Offer` / `Rejected` / `Discarded` / `SKIP`

Workflow notes (descriptive, not separate states):
- `Applied` = the candidate sent the application (outbound).
- `Responded` = a recruiter / company reached out and the candidate responded (inbound).
- Proactive candidate outreach (e.g. LinkedIn power move) is recorded as `Applied` with a note in the Notes column; it is not a separate canonical state.

If the user asks to update a status, edit the corresponding row.

Also show statistics:
- Total applications
- By status
- Average score
- % with PDF generated
- % with report generated
