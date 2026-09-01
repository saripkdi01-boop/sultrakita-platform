# SultraKita MCP Roadmap

## Delivery sequence

```text
Step 1–24 evidence and gates
        ↓
MCP foundation and contract review
        ↓
Read-only MCP V0.1
        ↓
security/observability verification
        ↓
controlled write V0.2
        ↓
AI automation V0.3
```

## Phases

| Phase | Scope | Exit criteria | Current status |
|---|---|---|---|
| Foundation | Resolve database authority, preserve storage neutrality, finalize API contracts | G-02 and dependencies reviewed | BLOCKED |
| V0.1 | Public listing/category/seller/statistics read tools | schema validation, auth, rate limits, redaction, contract tests | PROPOSED |
| Verification | Security regression, abuse tests, observability, failure drills | deny-by-default and no secret leakage proven | NOT STARTED |
| V0.2 | Carefully selected authenticated/write tools | explicit authorization, idempotency, confirmation, audit, rollback | NOT AUTHORIZED |
| V0.3 | AI prompts/workflows and bounded automation | tool consent, budgets, human oversight, replay safety | NOT AUTHORIZED |

## Dependency matrix

| Prior evidence | MCP dependency | Implication |
|---|---|---|
| Security PR #10/#11 | ID validation and membership safeguards | Reuse; do not bypass |
| Step 16–19 storage | Provider-neutral storage interface | R2 not canonical |
| Step 21–25 database | Service/API adapter, no direct SQL | Authority remains blocked |
| CI | Contract/security tests | Add MCP tests only after design approval |
| Vercel preview issue | Separate release investigation | Do not infer MCP readiness |

MCP is not production-ready and must not accelerate controlled remediation before architecture, database, storage, backup, and release gates are closed.

## References

[1]: ../../../step20-blueprint/SULTRAKITA-STEP20-REMEDIATION-BACKLOG.md "SultraKita remediation backlog"
[2]: ../../../step25-ci-reconstruction/SULTRAKITA-STEP25-DATABASE-AUTHORITY-DECISION.md "Step 25 database authority decision"
