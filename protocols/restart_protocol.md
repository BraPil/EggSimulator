# Restart Protocol

**Purpose**: Safely close out a context window and prepare for seamless continuation.
**Last Updated**: 2025-11-28

---

## Trigger

User says: "Engage restart_protocol.md, I am about to restart"

---

## Execution Steps

### Step 1: Review Chat History

- Look back through the ENTIRE chat history
- Identify all significant interactions
- Note all decisions, changes, and outcomes

### Step 2: Ensure Comprehensive Logging

- Verify all interactions are logged
- Check that logs are properly organized
- Confirm `master_log.md` is up to date
- Fill any gaps in documentation

### Step 3: Summarize Current State

Document:
- Where we started (initial state)
- What has been accomplished
- Current project state
- Active tasks and their status
- Known issues or blockers
- Recent decisions and rationale

### Step 4: Consult Overall Plan

If `Overall_Plan.md` exists:
- Review the plan
- Analyze progress against plan
- Identify deviations or updates needed
- Update plan if necessary

### Step 5: Analyze Next Steps

- Where we are in the project
- Where we need to go
- Immediate next actions
- Dependencies and blockers

### Step 6: Generate Restart Prompt

Create a comprehensive prompt containing:

```markdown
# Egg Simulator - Restart Context

## Project Status
[Current state summary]

## Recent Progress
[What was accomplished in last session]

## Active Tasks
[Current work in progress]

## Next Steps
[Immediate actions to take]

## Key File Index
- `protocols/master_protocol.md` - Master protocol and prime directive
- `logs/master_log.md` - Log index
- `indexes/mcp_and_tool_index.md` - Available tools
- `indexes/reference_material_index.md` - Reference materials
- [Other critical files]

## Important Context
[Any critical information for continuity]

## Instruction
Please review the above context and the referenced files, then continue work on [specific next task].
```

### Step 7: Confirm Coverage

Before presenting restart prompt, verify:

- [ ] All relevant logs are updated
- [ ] `master_log.md` reflects current state
- [ ] `master_protocol.md` is current
- [ ] Restart prompt contains all necessary context
- [ ] File index is complete and accurate

---

## Output

Present to user:
1. Confirmation that restart protocol was executed
2. Summary of what was logged/documented
3. The restart prompt to copy/paste into new window


