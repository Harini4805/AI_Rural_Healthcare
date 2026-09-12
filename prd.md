AI Rural Healthcare Dashboard — ML-Enabled, End-to-End Functional Build
0. What changed from v1 (read this first)

The original PRD (v1) had two problems this version fixes:

Fabricated impact claims (90% response-time reduction, 25% mortality decrease, 35% efficiency gain, $50B market, "pilots demonstrating 28% mortality reduction") — none of these were backed by an actual study. v2 reframes all of these as target hypotheses to validate, not achieved results.
"AI-powered" with no actual AI — the real backend that got built is plain CRUD (District/Village/HealthRecord) with a rule-based weighted risk formula, no trained model anywhere. v2 adds genuine, specific, justified ML models — not a generic "AI/ML" label — each with a stated reason it's the right tool, not the fanciest one.

This document builds on the actual existing system (FastAPI + SQLite backend, React frontend with role-based views, the risk-score/ranking/simulate endpoints already scoped) — it does not restart from scratch.

1. Introduction
1.1 Purpose: Extend the existing rule-based risk dashboard into a real, trained, end-to-end ML pipeline that predicts village-level disease risk, forecasts near-term case trends, flags emerging outbreaks early, and recommends an optimized resource allocation under real budget constraints.
1.2 Objectives (as hypotheses, not claims): Reduce the time between an emerging risk pattern and a resource-allocation decision; make every prediction explainable to a non-technical health officer; make resource allocation provably optimal given a stated constraint (not just "highest risk first").
1.3 Scope: Backend ML services (training + inference), new API endpoints layered onto the existing FastAPI app, and frontend additions (forecast charts, anomaly alerts, an optimizer-driven allocation screen) layered onto the existing React dashboard and its three role views (Admin / District Health Officer / Field Health Worker).
1.4 Out of scope for this version: authentication/RBAC enforcement, offline sync, national-scale deployment, mobile app packaging, satellite/wearable/federated-learning integrations — these remain future roadmap items (Section 12), not part of "end-to-end functional" here. "End-to-end functional" means: real data → real trained model → real API → real UI, at the scale of a working prototype, not a production SLA.
2. System Architecture (end-to-end)
[SQLite DB: District, Village, VillageResource, HealthRecord]
        ↓
[Feature Engineering Layer] (Python, pandas)
  - per-village-per-disease time-series features
  - staff vacancy %, medicine stock %, infra score
  - seasonal indicators (month, monsoon flag)
        ↓
[Training Pipeline] (offline, run as a script/notebook, not live)
  - Model A: Risk Scoring (Gradient Boosted Trees)
  - Model B: Case Forecasting (per village-disease time series)
  - Model C: Anomaly/Outbreak Detection
  - Model D: Village Clustering
        ↓ (saved as .joblib artifacts)
[Model Registry] (simple: /models directory + a version.json manifest —
                  no MLflow/heavy infra needed at this scale)
        ↓
[Inference Layer] (new FastAPI routers, loading saved models at startup)
  - GET  /api/v1/ml/risk-score/{village_id}
  - GET  /api/v1/ml/forecast/{village_id}/{disease_type}
  - GET  /api/v1/ml/anomalies
  - GET  /api/v1/ml/clusters
  - POST /api/v1/ml/optimize-allocation
        ↓
[React Frontend] — existing dashboard extended with forecast charts,
                    anomaly banner, cluster panel, allocation-plan screen

Why this shape: training and inference are deliberately separated. Training runs offline (on-demand or scheduled), producing lightweight saved model files; the live API only loads and scores — this keeps the FastAPI app fast and simple instead of retraining on every request.

3. Data & Feature Engineering

Available real fields (from the existing schema):

District: population, area_sq_km
Village: population, latitude, longitude
VillageResource: staff_count, staff_required, medicine_stock_pct, infrastructure_score
HealthRecord: disease_type, case_count, severity_level, intervention_type, outcome_status, recorded_at

Engineered features (derived, computed in the feature-engineering layer, not stored redundantly):

staff_vacancy_pct = 1 − (staff_count / staff_required)
case_count_7d_avg, case_count_trend_slope (rolling window over HealthRecord.recorded_at per village+disease)
severity_weighted_load = case_count × severity weight (low=1, medium=2, high=3, critical=4)
month, is_monsoon_season (derived from recorded_at — a real, defensible seasonal signal even without external climate data)
population_density = population / area_sq_km (district-level, joined down to village)

Honest data-scarcity note: the current dataset is a small, seeded demo set. Every model below is chosen specifically because it works reasonably on small tabular data — none of them assume big data. Section 11 covers what happens as real data volume grows.

4. ML Models & Algorithms (the core of this version)
Model A — Disease Risk Scoring
Algorithm: Gradient Boosted Trees (XGBoost or LightGBM), regression target = composite risk score (0–100).
Why this, not deep learning: tabular data with a few dozen engineered features and a small row count is exactly where gradient-boosted trees outperform neural networks — they handle mixed feature types well, need far less data, train in seconds, and support built-in feature importance. This directly replaces the earlier hand-set weighted formula with a learned weighting, while keeping the same explainability requirement.
Inputs: all engineered features above.
Output: risk score (0–100) + SHAP value per feature (replaces the manual "45% staffing + 25% seasonal..." breakdown with a genuinely computed one).
Training data: existing HealthRecord + VillageResource history; if too sparse to train meaningfully, fall back to the existing rule-based formula and clearly label the model as "rule-based (insufficient training data)" in the API response — never silently return an undertrained model's output as if it were reliable.
Evaluation: cross-validated MAE against held-out records; report this number in the UI/demo rather than an accuracy figure that oversells a small dataset.
Model B — Case Forecasting (early-warning)
Algorithm: per village-disease time series, use Holt-Winters exponential smoothing (or Prophet if enough history exists — at least ~2 seasonal cycles of data).
Why this, not a complex forecasting model: with limited historical depth, exponential smoothing is honest and stable; Prophet is a reasonable upgrade once more history accumulates, but it needs more data to be trustworthy than a small seed dataset provides.
Inputs: the case_count time series per village-disease pair.
Output: a projected case-count trend for the next 2–4 weeks with a confidence interval.
This is what makes the platform genuinely "predictive, not reactive" — it's the direct technical answer to that specific requirement in the original brief.
Model C — Outbreak Anomaly Detection
Algorithm: a rolling statistical control chart (flag when case_count exceeds rolling mean + k×std, k≈2–3) as the primary method, with Isolation Forest as an optional secondary check once enough multi-feature history exists.
Why this, not a fancier detector: a control chart is transparent, needs almost no training data, and is exactly what epidemiological surveillance systems actually use in practice — it's a defensible, real-world-aligned choice, not a toy.
Output: a flagged alert list ("Village X: dengue cases 3.2 std above rolling baseline this week").
Model D — Village Similarity Clustering
Algorithm: K-Means (k chosen via elbow method) over population, infra_score, staff_vacancy_pct, historical disease burden.
Why this matters: solves the cold-start problem — a new village with little/no health-record history can still get a reasonable initial risk estimate by inheriting the profile of its nearest cluster, instead of showing "insufficient data."
Output: cluster ID per village + the cluster's average risk/needs profile, surfaced as a "villages like this one" panel.
Model E — Resource Allocation Optimizer (a real algorithm, not ML, and just as important)
Algorithm: Linear/Integer Programming (via PuLP or scipy.optimize.linprog) — maximize total risk-reduction across all villages in a district, subject to real constraints: N specialists available, M mobile-unit routes, a medicine budget.
Why this is the right tool: "recommend where to send resources" is fundamentally a constrained-optimization problem, not a prediction problem — using an actual solver here (instead of a greedy "top-N highest risk gets it" rule) is what makes the allocation provably the best possible given the stated constraints, and it's a genuinely defensible upgrade from the earlier greedy rule.
This becomes the new "what-if simulator++": instead of simulating one village at a time, an officer sets district-wide constraints (e.g. "I have 3 specialists and 2 MMU routes this month") and gets the mathematically optimal district-wide plan back.
5. New API Endpoints (added to the existing FastAPI app, same /api/v1 prefix)
Endpoint	Method	Purpose
/ml/risk-score/{village_id}	GET	Model A score + SHAP-based driver breakdown
/ml/forecast/{village_id}/{disease_type}	GET	Model B projected trend + confidence band
/ml/anomalies	GET	Model C — current flagged villages/diseases
/ml/clusters	GET	Model D — cluster assignments + profiles
/ml/optimize-allocation	POST	Model E — takes {district_id, specialists_available, mmu_routes_available, medicine_budget}, returns the optimal per-village allocation plan

Each endpoint should return a model_status field ("trained" or "fallback_rule_based") so the frontend can honestly indicate when a model had enough data versus when it's using the safer rule-based fallback.

6. Frontend Additions
Forecast chart: add a projected-trend line (with shaded confidence band) to the existing village trend chart.
Anomaly banner: a dismissible alert strip at the top of the district view listing current flagged villages from Model C.
"Similar villages" panel: on the village detail screen, show 2–3 cluster-mates from Model D, useful for a village with little own history.
District Allocation Planner screen (new): inputs for specialists/MMU/medicine budget → calls /ml/optimize-allocation → renders the optimal plan as a ranked table with the amount allocated per village and the projected district-wide risk reduction. This becomes the flagship demo moment — replaces the single-village what-if slider as the headline feature.
Every model-derived number in the UI should carry a small "model: trained on N records" or "model: rule-based fallback" tag — this is the honesty mechanism carried over from v1's lessons.
7. Model Lifecycle
Training: a standalone script (train_models.py), run manually or via a simple scheduled job — not triggered on every API request.
Storage: save each model as a .joblib file in a /models directory with a version.json recording training date, row count used, and evaluation metric. No MLflow/Kubeflow needed at this scale — that infrastructure would be complexity without payoff for a prototype's actual data volume.
Retraining trigger: manual re-run whenever the HealthRecord table grows meaningfully (e.g., after each new batch of records is added) — not continuous/real-time retraining, which isn't justified by how fast this data actually accumulates.
8. Non-Functional Requirements (revised to be honest)
Runs correctly as a single local/small-deployment instance — no claim of 99.5% uptime or 1000+ concurrent users; those are production-scale claims this prototype doesn't need to make.
Model inference responds within a few seconds on the existing dataset size — no need for the "5 second real-time SLA" language from v1.
Data privacy: only aggregate, non-personal village/district statistics are used — no individual patient records.
Scaling beyond this prototype's data volume is explicitly a future-roadmap item (Section 12), not a current requirement.
9. Success Metrics (stated as targets to validate, never as results already achieved)
Model A cross-validated MAE on held-out risk scores (report the actual number once trained — don't invent one).
Model B forecast error (MAPE) on a held-out time window.
Model C: number of true anomalies caught vs. false positives, once enough labeled outbreak history exists to check against.
Model E: total risk-reduction achieved by the optimizer's plan vs. a naive "highest-risk-first" baseline — this comparison is easy to compute and is a genuinely strong, honest demo statistic (compute it live from your own data, don't estimate it).
10. Risks Specific to Adding ML
Risk	Impact	Mitigation
Training data too sparse for Models A/B to be meaningful	Overconfident, misleading outputs	Explicit model_status: fallback_rule_based flag; never present an undertrained model's number as equivalent to a validated one
Overfitting on a small dataset	Model looks accurate in-sample, fails on new villages	Cross-validation reported honestly; keep tree depth/complexity low (few hundred rows ≠ deep model)
Cold start for brand-new villages	No history to score against	Model D clustering provides a reasoned fallback estimate instead of a blank/undefined score
Model drift as real data patterns shift	Stale predictions over time	Manual retraining trigger tied to meaningful data growth (Section 7), not a "set and forget" claim
Optimizer infeasible constraints (e.g., budget too small for any meaningful allocation)	Solver returns no solution	Handle gracefully in the API — return the best partial allocation with a clear message, not an error page
11. Data Growth Path

As real HealthRecord volume grows beyond the seeded demo set:

Swap Holt-Winters for Prophet once ~2 seasonal cycles of real data exist.
Add Isolation Forest as a secondary anomaly check once multi-feature history is deep enough to train it meaningfully.
Consider a proper model registry (MLflow) only once retraining becomes frequent enough to need automated tracking — not before.
12. Roadmap
Now (this version): Models A–E running end-to-end on the existing schema, with honest fallback behavior and the Allocation Planner as the new flagship screen.
Phase 2: real multi-district, multi-year data ingestion (once available), swap in Prophet/Isolation Forest per Section 11.
Phase 3 (production, not this prototype): role-based auth/RBAC enforcement, offline field-worker sync, live HMIS/Poshan Tracker API ingestion, ABDM integration, national-scale deployment.
13. What to tell your coding agent

When you hand this to Antigravity (or any coding agent) to implement: build Section 4's five models exactly as specified (algorithm choice, not "some ML model"), wire them through Section 5's endpoints, and make sure every model response includes the model_status honesty field from Section 5/6 — that field is what keeps this version defensible under judge or reviewer questioning, the same way labeling illustrative data was in v1.