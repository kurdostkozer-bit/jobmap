# EXCEPTIONS.md: Emergency Override Policy

When and how to override governance rules in emergency situations.

**Principle:** Governance protects the project. But sometimes emergencies require pragmatism.

---

## Exception Levels

```
🟢 GREEN: No exception needed
   ├─ Normal development
   ├─ All rules apply
   └─ Standard process

🟡 YELLOW: Exception allowed
   ├─ Serious issue but manageable
   ├─ Some rules can be modified
   └─ Must document

🔴 RED: Emergency override possible
   ├─ Critical production issue
   ├─ Most rules can be suspended
   ├─ Requires approval
   └─ Must be logged and reviewed
```

---

## When Exceptions Are Allowed

### 🟡 YELLOW Alert (Serious but Manageable)

**Can override SHOULD rules with documentation**

```
Examples:
├─ High-priority bug affecting multiple users
├─ Performance degradation in production
├─ Security vulnerability in non-critical path
├─ Broken feature blocking workflows
├─ Data inconsistency issue
└─ API error affecting batch operations

Process:
1. Identify as YELLOW alert
2. Document in commit: "⚠️ YELLOW ALERT: [reason]"
3. Follow process below
4. Continue monitoring
```

**YELLOW Alert Rules**

Can override:
```
✓ SHOULD rules (with documentation)
✓ Optional review steps
✓ Some optimization checks
✓ Parallel testing procedures
```

Cannot override:
```
✗ MUST read code first
✗ MUST diagnose
✗ MUST test before commit
✗ MUST log in CHANGELOG_AI.md
✗ MUST be reversible
```

---

### 🔴 RED Alert (Critical Emergency)

**Can override SHOULD rules, limited MUST exceptions**

```
Examples:
├─ Production down (0% uptime)
├─ Data corruption in main database
├─ Security breach in progress
├─ Payment system failure
├─ Authentication system broken
├─ All users unable to access
└─ Revenue-impacting outage
```

**RED Alert Process**

```
CRITICAL ISSUE DETECTED
        ↓
1. DECLARE RED ALERT
   └─ Notify: Project lead, tech lead, team

2. QUICK DIAGNOSIS (5-10 minutes max)
   └─ What is broken?
   └─ How many users affected?
   └─ Can we rollback? YES/NO

3. IF ROLLBACK POSSIBLE
   └─ Rollback immediately
   └─ Document what was rolled back
   └─ Investigate after service restored

4. IF ROLLBACK NOT POSSIBLE
   └─ Proceed with emergency fix
   └─ See "RED Alert Fix Process" below

5. IMPLEMENT FIX (as fast as safely possible)
   └─ Still must diagnose
   └─ Still must test minimally
   └─ Still must be reversible

6. DEPLOY FIX

7. MONITOR (24 hours minimum)
   └─ Watch for side effects
   └─ Keep team alert
   └─ Be ready to rollback

8. POST-MORTEM
   └─ After stability: analyze what happened
   └─ After stability: improve processes
   └─ After stability: update governance if needed
```

**RED Alert Rules**

Can override:
```
✓ SHOULD rules (all of them)
✓ Some optimization checks
✓ Some testing procedures
✓ Documentation updates (do later)
```

Cannot override:
```
✗ MUST read code (even quickly)
✗ MUST diagnose (even quickly)
✗ MUST test (even minimally)
✗ MUST be reversible
✗ MUST log in CHANGELOG_AI.md
✗ MUST notify team
```

---

## RED Alert Fix Process

### Step 1: Rapid Diagnosis (5 minutes)

```
Question 1: What is the symptom?
   Output: "Users can't login" OR "Data corrupted" OR "API timing out"

Question 2: When did it start?
   Output: Recent deployment? Recent code change? External issue?

Question 3: Who is affected?
   Output: All users? Specific users? Specific feature?

Question 4: Is rollback feasible?
   Output: YES (rollback to previous version)
          NO (must fix forward)
```

### Step 2: Decision Point

```
Can rollback? ────→ YES ──→ ROLLBACK IMMEDIATELY
                             └─ Investigate after

             └────→ NO ──→ Continue to Step 3
```

### Step 3: Minimal Fix (assume 30-60 minutes)

```
RULES TO FOLLOW (even in RED):
✓ Still diagnose root cause (quickly)
✓ Still read code (quick scan)
✓ Still test minimally
✓ Still be reversible

RULES TO SKIP (RED ALERT ONLY):
✗ Skip extensive testing
✗ Skip optimization
✗ Skip some documentation
✗ Skip code review (do after)

ACTION:
1. Make minimal fix only
2. Test in staging if time allows (5-10 min)
3. Deploy to production
4. Monitor closely (5+ minutes)
5. If stable: LOG AS RED ALERT
6. If unstable: ROLLBACK
```

### Step 4: After Fix (Post-Stabilization)

```
After 30 minutes of stability:

1. Notify team
   └─ "System stabilized"
   └─ "Root cause: [what we think]"
   └─ "Fix applied: [what we did]"
   └─ "Status: monitoring"

2. Continue monitoring (4-24 hours)
   └─ Watch for side effects
   └─ Check logs for anomalies
   └─ Verify performance normal

3. Document in CHANGELOG_AI.md
   └─ Status: RED ALERT
   └─ Duration: [how long down]
   └─ Fix: [what was done]
   └─ Impact: [business impact]
   └─ Root cause: [real cause]
   └─ Post-mortem: [link or date]

4. Post-mortem (next day, after sleep)
   └─ Why did this happen?
   └─ Why didn't we catch it?
   └─ How to prevent next time?
   └─ Process improvements?
```

---

## Exception Request Form

### For YELLOW Alert

```
YELLOW ALERT REQUEST

Situation: [What is happening?]

Severity: HIGH / CRITICAL

Users Affected: [Number or percentage]

Duration: [How long has this been happening?]

Impact: [What can't users do?]

Proposed Fix: [What do you want to do?]

Rules to Override: 
[ ] SHOULD rule 1: [name]
[ ] SHOULD rule 2: [name]

Cannot Override:
[ ] MUST diagnose
[ ] MUST test
[ ] MUST log

Duration: [How long will override be active?]

Justification: [Why is this necessary?]

Approver: [Who approved?]

Date: [When?]

Result: [What happened?]

Follow-up: [Post-incident actions?]
```

### For RED Alert

```
RED ALERT INCIDENT LOG

Incident ID: [auto-generated timestamp]

Start Time: [YYYY-MM-DD HH:MM UTC]

End Time: [YYYY-MM-DD HH:MM UTC]

Duration: [X minutes]

Impact: [% of users affected, revenue impact, etc]

Symptom: [What users saw]

Root Cause: [Technical cause]

Fix Applied: [What was done]

Rules Overridden:
[ ] Rule 1: [name] - Duration: X minutes
[ ] Rule 2: [name] - Duration: X minutes

Emergency Approval:
[ ] Project Lead: [name]
[ ] Tech Lead: [name]
[ ] Time: [when]

Notification:
[ ] Team notified: [time]
[ ] Status page updated: [time]
[ ] Users notified: [time]

Rollback Decisions:
[ ] Considered rollback: YES / NO
[ ] Rollback feasible: YES / NO
[ ] Rollback executed: YES / NO
[ ] Time to rollback: [X minutes]

Post-Incident:
[ ] Root cause analysis done
[ ] Preventive measures identified
[ ] Process improvements documented
[ ] Team trained
[ ] Follow-up: [date]
```

---

## Escalation Path

### YELLOW Alert

```
Developer detects issue
        ↓
Assess severity: YELLOW
        ↓
Notify: Tech Lead
        ↓
Tech Lead approves exception
        ↓
Proceed with fix
        ↓
Log as YELLOW ALERT
        ↓
Team reviews next day
```

### RED Alert

```
User reports outage / System monitoring alerts
        ↓
Assess severity: RED
        ↓
Declare RED ALERT
        ↓
Notify: Project Lead + Tech Lead + Team
        ↓
Rapid diagnosis (5 min)
        ↓
Decision: Rollback OR Fix Forward?
        ↓
If rollback: Execute immediately
If fix: Proceed with emergency fix
        ↓
Deploy fix
        ↓
Monitor (30+ minutes)
        ↓
Post-mortem (next 24 hours)
```

---

## Rules for Exceptions

### Exception must be:

```
✓ Documented
  └─ What exception?
  └─ Why exception?
  └─ Who approved?
  └─ When was it?

✓ Approved
  └─ YELLOW: Tech Lead
  └─ RED: Project Lead + Tech Lead

✓ Time-limited
  └─ YELLOW: 24 hours (then revert)
  └─ RED: Until stabilized

✓ Reversible
  └─ Even emergency fix must be rollbackable
  └─ If not reversible: Don't do it

✓ Communicated
  └─ Team must know
  └─ Stakeholders must know
  └─ Users might need notification

✓ Logged
  └─ CHANGELOG_AI.md
  └─ Incident log
  └─ Post-mortem
```

### Exception must NOT:

```
✗ Skip diagnosis
  └─ Still must understand problem

✗ Skip testing
  └─ Still must verify fix works

✗ Skip reversibility
  └─ Must be able to rollback

✗ Skip logging
  └─ Must document what happened

✗ Become permanent
  └─ Exception is temporary
  └─ Fix processes afterward
```

---

## After Exception: Review Cycle

### Within 24 Hours

```
1. Team debrief
   └─ What happened?
   └─ How did we respond?
   └─ Was exception justified?

2. Document incident
   └─ Timeline
   └─ Root cause
   └─ Fix applied
   └─ Lessons learned
```

### Within 1 Week

```
1. Post-mortem meeting
   └─ Why did this happen?
   └─ Why didn't we catch it earlier?
   └─ What can prevent this?

2. Identify improvements
   └─ Process improvements?
   └─ Testing improvements?
   └─ Monitoring improvements?
   └─ Documentation improvements?

3. Update governance if needed
   └─ Did exception reveal rule flaw?
   └─ Should we adjust processes?
```

### Going Forward

```
1. Implement preventive measures
2. Update monitoring
3. Update tests if needed
4. Update documentation
5. Train team on lessons learned
6. Move on
```

---

## Exception Statistics

Track over time:

```
Quarterly Review:

YELLOW Alerts:
- Count: [N]
- Average duration: [X hours]
- Most common causes: [list]
- Prevented escalation to RED: [Y%]

RED Alerts:
- Count: [N]
- Average downtime: [X minutes]
- Business impact: $[X]
- Root causes: [list]
- Preventable: [Y%]

Trends:
- Increasing or decreasing?
- Any patterns?
- What's working?
- What needs improvement?
```

---

## Real-World Examples

### Example 1: YELLOW Alert

```
SITUATION:
- Customer reports: "Reports are running slow"
- Dashboard takes 30 seconds to load
- Affects 15% of users
- Feature works but slow

EXCEPTION:
- Override: "Skip extended performance testing"
- Reason: "Need to deploy quickly, will monitor"
- Duration: 4 hours
- Approver: Tech Lead

FIX:
- Add database index
- Deploy to production
- Monitor next 2 hours
- Performance returns to normal

FOLLOW-UP:
- Next day: Review why index was missing
- Add to code review checklist
- Update performance testing
```

### Example 2: RED Alert

```
SITUATION:
- 9:45 AM: Payment processing fails
- ALL users affected
- Revenue at $0 for 15 minutes
- Customers calling support

DIAGNOSIS (5 minutes):
- Payment API returned error
- Recent deployment: database migration

DECISION:
- Rollback immediately (faster than fix)

ACTION (5 minutes):
- Revert to previous deployment
- Payment processing works
- Total downtime: 15 minutes

POST-MORTEM (next day):
- Root cause: Migration had subtle bug
- Why not caught: Tests didn't cover edge case
- Prevention: Add integration tests
- Result: Never happens again
```

---

## Remember

```
Exceptions are RARE.

They exist because:
✓ Emergencies happen
✓ Perfect processes can't handle everything
✓ Business continuity sometimes > process perfection

But:
✗ Exceptions are NOT the norm
✗ If exceptions are frequent: Fix the process
✗ Each exception should be surprising
✗ Repeated exceptions = governance failure

Use exceptions wisely.
Review them thoroughly.
Learn from them.
Fix the root causes.

The goal is to need exceptions less and less.
```
