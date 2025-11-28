# Logging Sub-Protocol

**Purpose**: Ensure comprehensive logging of all project activities.
**Last Updated**: 2025-11-28

---

## Core Principle

Log everything we do. Every single prompt and prompt response should be logged to a specific issue log or a log that is tracking everything for a particular step.

---

## Logging Requirements

### 1. What to Log

- Every prompt received
- Every response generated
- Decisions made and rationale
- Tools used and results
- Files created, modified, or deleted
- Errors encountered and resolutions
- Milestones achieved

### 2. Log Naming Convention

Format: `[TYPE]_[DESCRIPTION]_[DATE]_[TIME].md`

Examples:
- `session_initial_setup_2025-11-28_1430.md`
- `task_game_core_implementation_2025-11-28_1445.md`
- `issue_bug_save_system_2025-11-28_1500.md`

### 3. Log Location

- Session logs: `logs/sessions/`
- Task logs: `logs/tasks/`
- Issue logs: `logs/issues/`
- Planning logs: `logs/planning/`

---

## Log Structure

Each log entry should contain:

```markdown
## [Timestamp]

### Context
- Current task/goal
- Relevant protocols invoked

### Input
- User prompt or trigger

### Actions Taken
- What was done
- Tools used
- Files affected

### Output
- Results produced
- Decisions made

### Next Steps
- Follow-up items
- Open questions
```

---

## Master Log Updates

After EVERY interaction:

1. Identify which logs were updated
2. Update `logs/master_log.md` with:
   - New log entries
   - Status changes
   - Last updated timestamps

---

## End-of-Response Checklist

Before completing any response:

- [ ] Relevant logs updated
- [ ] Master log reflects current state
- [ ] Log entries are complete and detailed
- [ ] Timestamps are accurate


