# Story Bank -- Master STAR+R Stories

This file accumulates your best interview stories over time. Each evaluation (Block F) adds new stories here. Instead of memorizing 100 answers, maintain 5-10 deep stories that you can bend to answer almost any behavioral question.

## How it works

1. Every time `/career-ops oferta` generates Block F (Interview Plan), new STAR+R stories get appended here
2. Before your next interview, review this file -- your stories are already organized by theme
3. The "Big Three" questions can be answered with stories from this bank:
   - "Tell me about yourself" -> combine 2-3 stories into a narrative
   - "Tell me about your most impactful project" -> pick your highest-impact story
   - "Tell me about a conflict you resolved" -> find a story with a Reflection

## Stories

### [Reliability Engineering] Invite Production Pipeline Ownership
**Source:** Report #034 -- BKW Wind Energy Trading -- Junior Quant Developer
**S (Situation):** Co-founded Invite at 21; had to keep a production analytics stack live for 100k+ users with no infra team.
**T (Task):** Keep the BigQuery pipeline reliable while ingesting 2M+ daily events without losing analytics-driven decisions.
**A (Action):** Built monitoring on row-counts and ETL latency; set alert thresholds; ran a weekly data quality review with the team.
**R (Result):** Zero major data outages despite a 4-person team; KPIs became trustable enough to drive product decisions; 15% retention lift downstream.
**Reflection:** Reliability is a culture, not a tool. The cheapest alerts (row counts, freshness) catch the biggest fraction of incidents.
**Best for questions about:** reliability, monitoring, production systems, ownership, data quality, business-critical infra

### [Quantitative Skills] HFT Signal Builder
**Source:** Report #001 -- TotalEnergies -- Trading Graduate Program
**S (Situation):** EPFL ML for Finance course; had to predict 10-min intraday returns across 50+ US equities.
**T (Task):** Build a model that generates tradeable signals net of transaction costs.
**A (Action):** Built Encoder-only Transformer on limit order book features; benchmarked against OLS, Ridge, Lasso, ARIMA.
**R (Result):** Sharpe 1.05 net of costs, outperforming all linear baselines by 35%+.
**Reflection:** The signal extraction pipeline matters more than model complexity -- simple features with robust preprocessing beat complex architectures with noisy inputs.
**Best for questions about:** quantitative skills, technical problem-solving, trading, ML/AI, analytical rigor

### [Entrepreneurship] Zero to 100K Users
**Source:** Report #001 -- TotalEnergies -- Trading Graduate Program
**S (Situation):** Co-founded Invite with no external funding; had to find product-market fit fast.
**T (Task):** Scale a consumer app from zero users to viability.
**A (Action):** Designed analytics-first approach: BigQuery pipeline for 2M+ daily events, built statistical signals (retention cohorts, engagement decay) to drive all product decisions.
**R (Result):** 100k+ users, 25% MoM engagement growth, 15% retention lift from data-driven changes.
**Reflection:** Would have focused on monetization signals earlier -- engagement growth without revenue signals delayed the business model pivot.
**Best for questions about:** entrepreneurship, scaling, data-driven decisions, startup experience, taking initiative

### [Data-Driven Decision Making] Statistical Signals That Changed Strategy
**Source:** Report #001 -- TotalEnergies -- Trading Graduate Program
**S (Situation):** At Invite, product team was making decisions based on intuition, not data.
**T (Task):** Build decision-support analytics that the team would actually use.
**A (Action):** Designed real-time dashboard tracking 12 KPIs; built retention cohorts and engagement decay curves that became the single source of truth for strategy.
**R (Result):** Team shifted from gut-feel to data-driven decisions; 15% retention lift directly attributed to signal-driven features.
**Reflection:** The hardest part of analytics isn't building the pipeline -- it's designing signals that are actionable, not just informative.
**Best for questions about:** influence without authority, analytics, communication, stakeholder management

### [Adaptability] Three Industries in Five Years
**Source:** Report #001 -- TotalEnergies -- Trading Graduate Program
**S (Situation):** Went from aerospace engineering to consumer tech startup to quantitative finance.
**T (Task):** Reinvent myself in each domain while transferring core quantitative skills.
**A (Action):** Applied numerical methods training to data pipelines (Invite); applied signal processing mindset to financial time series (Prestinvest); used engineering rigor in every domain.
**R (Result):** Each pivot was faster than the last: 4 years in aerospace, 2 years in startup, immediate traction in quant finance.
**Reflection:** The common thread is mathematical modeling under uncertainty -- the domain changes, the toolkit transfers.
**Best for questions about:** adaptability, learning agility, career transitions, growth mindset

### [Leadership] Leading a Technical Team as a First-Time CTO
**Source:** Report #001 -- TotalEnergies -- Trading Graduate Program
**S (Situation):** Co-founded Invite at 21; had to manage a 4-person engineering team with zero management experience.
**T (Task):** Deliver product while building team culture and processes.
**A (Action):** Set up sprint cadence, code review culture, shared analytics dashboards; held weekly retros to surface blockers.
**R (Result):** Team shipped consistently; reduced release cycle friction; maintained low turnover despite startup pressure.
**Reflection:** Would have invested more in written documentation earlier -- tribal knowledge doesn't scale, even in a 4-person team.
**Best for questions about:** leadership, team management, building culture, process improvement

### [Domain Knowledge] Commodities in Multi-Asset Allocation
**Source:** Report #001 -- TotalEnergies -- Trading Graduate Program
**S (Situation):** At Prestinvest, building quantamental allocation toolkit across 8+ asset classes including commodities and alternatives.
**T (Task):** Model commodity exposure within a total portfolio approach, accounting for different risk characteristics vs. equities.
**A (Action):** Implemented mean-variance optimization with conviction-based tilts; built daily risk reporting for commodity positions alongside other asset classes.
**R (Result):** Live models supporting real allocation decisions at a FINMA-regulated AM.
**Reflection:** Commodities behave very differently from equities in tail events -- correlation structures break down exactly when you need diversification most.
**Best for questions about:** commodity markets, risk management, portfolio construction, quantitative analysis

### [Global Mindset] Building Across Borders
**Source:** Report #001 -- TotalEnergies -- Trading Graduate Program
**S (Situation):** Took a remote software role in Lithuania while based in Spain, then moved to Switzerland for EPFL.
**T (Task):** Perform at a high level across cultures and time zones.
**A (Action):** Adapted communication style for each context; learned to over-communicate in async/remote settings; picked up Swiss professional norms quickly.
**R (Result):** Delivered at RatePunk despite being fully remote; smooth transition to EPFL and then Prestinvest in Geneva/Lausanne.
**Reflection:** Remote work taught me that clarity in written communication is a force multiplier -- the same skill applies to trading communication.
**Best for questions about:** global mobility, cross-cultural work, communication, remote collaboration

### [Academic Excellence] First in Class
**Source:** Report #001 -- TotalEnergies -- Trading Graduate Program
**S (Situation):** Entered UPC Aerospace Engineering knowing it was one of Spain's toughest engineering programs.
**T (Task):** Graduate at the top while also pursuing research.
**A (Action):** Treated studying like a job: disciplined schedule, deep practice on problem sets, sought out the Banco Santander research scholarship for additional challenge.
**R (Result):** Graduated 1st out of 60+ (top 1%); won competitive research scholarship (<5% acceptance).
**Reflection:** The ranking itself matters less than the discipline it built -- the same approach to systematic rigor applies to quantitative research.
**Best for questions about:** work ethic, discipline, academic achievement, intellectual curiosity
