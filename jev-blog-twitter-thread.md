# Jev blog announcement thread

Draft copy for the SREGym account. Text beneath each heading is the post; images are upload notes and are not part of the character count.

## Post 1/7

Can a small, fast decision model make SRE agents more reliable? 🤔

We gave Luna access to Jev through the Codex harness and tested the setup across 100 SREGym-Lite trajectories.

Three findings stood out. More details in the thread. 🧵

![Results summary comparing SREGym-Lite passes without and with Jev](./public/blog/jev/results-summary.png)


## Post 2/7

Jev is a System One Model built for fast, structured decisions.

Jev did not diagnose incidents itself. Luna could call it through the Codex harness to rank diagnostic tests and review evidence before diagnosis and mitigation submissions.

![Workflow showing how Luna, Jev, and the Conductor interact](./public/blog/jev/workflow.png)


## Post 3/7

Finding 1: Jev improved overall reliability, but not uniformly.

Without Jev: 20/50 passes
With Jev: 24/50 passes

Four faults improved, two regressed, and four were unchanged. This is promising evidence, not a claim of a universal 8-point gain.


## Post 4/7

The biggest gain came from an internal traffic policy fault: 0/5 → 3/5.

Baseline agents chased plausible telemetry noise. Jev rejected a weak causal explanation and helped steer later investigation toward the Service policy and cross-node endpoint placement.


## Post 5/7

Finding 2: Healthy now does not mean reliably repaired.

Agents restored a workload but left a faulty namespace quota in place. They also restored 3 Ready replicas while leaving an unsafe rollout strategy.

The missing evidence was counterfactual: what happens next?


## Post 6/7

Finding 3: Jev can only rank the hypotheses it receives.

When Luna proposed the wrong set of explanations, Jev could approve a coherent but incomplete story. Every required review question had a 0.70 threshold, but a high score cannot compensate for missing evidence.


## Post 7/7

Next, we want to use Jev earlier in the action loop, compare repeated votes, and test it with agents at different capability levels.

We are also interested in prospective mitigation-safety review, but we have not tested that yet.

Read the post: [BLOG LINK]
