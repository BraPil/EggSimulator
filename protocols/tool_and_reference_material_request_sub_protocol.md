# Tool and Reference Material Request Sub-Protocol

**Purpose**: Acquire or request tools and reference materials needed for task completion.
**Last Updated**: 2025-11-28

---

## Core Principle

Acquire or request whatever tools and reference materials you need to complete your task.

---

## When to Invoke

- Required tool is not available
- Reference material is missing or incomplete
- New capability is needed
- Existing resources are insufficient

---

## Request Process

### 1. Identify the Gap

- What is missing?
- Why is it needed?
- What would it enable?

### 2. Search for Solutions

- Can existing tools be used differently?
- Are there alternative approaches?
- What external resources exist?

### 3. Formulate Request

If resources must be requested from user:

```markdown
## Resource Request

**Type**: [Tool / Reference Material / MCP / Other]

**Name**: [Specific name if known]

**Purpose**: [Why this is needed]

**Alternatives Considered**: [What else was evaluated]

**Impact if Unavailable**: [What happens without it]

**Suggested Sources**: [Where to obtain it]
```

### 4. Document Request

- Log the request in appropriate log
- Update relevant indexes
- Track request status

---

## Self-Service Options

Before requesting from user, attempt:

1. **Web Search**: Look for publicly available resources
2. **Documentation Lookup**: Check official docs
3. **MCP Tools**: Use available MCP integrations
4. **Creative Solutions**: Find workarounds with existing tools

---

## Request Categories

### Tools
- Development tools
- Analysis tools
- Automation tools
- Testing tools

### Reference Materials
- Documentation
- Specifications
- Examples
- Tutorials

### MCPs
- Specialized integrations
- External service connections
- Enhanced capabilities

---

## Follow-Up

After request is fulfilled:

1. Update `indexes/mcp_and_tool_index.md` or `indexes/reference_material_index.md`
2. Document how the resource was obtained
3. Note any setup or configuration required
4. Test and validate the resource works as expected


