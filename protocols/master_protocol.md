# Egg Simulator - Master Protocol

**Project**: Egg Simulator: The AAA Video Game
**Version**: 1.0.0
**Last Updated**: 2025-11-28

---

## 1. Identification and Purpose

This master protocol governs all development activities for **Egg Simulator: The AAA Video Game**. It serves as the central index for all protocols, logs, tools, and reference materials.

---

## 2. Prime Directive

> **Create and maintain "Egg Simulator: The AAA Video Game" - a fully-featured, visually stunning, browser-based game that delivers a premium gaming experience centered around egg-based gameplay mechanics, progression systems, and immersive visual/audio design.**

### Success Criteria

- Visually stunning UI/UX that rivals AAA game quality
- Engaging progression system with multiple egg types and upgrades
- Smooth animations and satisfying interactions
- Save/load functionality for persistent progress
- Achievement system and unlockables
- Immersive audio design (when applicable)
- Responsive design for multiple screen sizes

### Non-Goals

- Server-side multiplayer (single-player focus)
- Monetization systems
- External API dependencies (self-contained)

---

## 3. Anti-Sampling Directive (Binding)

**Read every word** of any file you are instructed to read.

- Do NOT only read the first N lines
- Do NOT read scattered snippets and guess the rest
- Do NOT summarize from partial inspection

For files over 10,000 lines: STOP and alert the user for authorization.

---

## 4. Protocol Index

| Protocol | Purpose | When to Invoke | Last Updated |
|----------|---------|----------------|--------------|
| `analysis_sub_protocol.md` | Thorough analysis of all results | Every analysis task | 2025-11-28 |
| `research_sub_protocol.md` | Identify tools and references | Research phases | 2025-11-28 |
| `generation_sub_protocol.md` | Output formatting rules | Every generation | 2025-11-28 |
| `logging_sub_protocol.md` | Logging all interactions | Every prompt | 2025-11-28 |
| `tool_identification_sub_protocol.md` | Find effective tools | Tool selection | 2025-11-28 |
| `reference_material_identification_sub_protocol.md` | Find reference materials | Documentation needs | 2025-11-28 |
| `tool_and_reference_material_request_sub_protocol.md` | Request missing tools | When tools needed | 2025-11-28 |
| `restart_protocol.md` | Context window restart | User-triggered | 2025-11-28 |

### Mandatory Protocols (Every Interaction)

- `logging_sub_protocol.md`
- `generation_sub_protocol.md`
- `analysis_sub_protocol.md`

---

## 5. MCP / Tool / Reference Index Pointers

- **Tools Index**: `indexes/mcp_and_tool_index.md`
- **Reference Materials**: `indexes/reference_material_index.md`

### Tool Selection Guidelines

1. Prefer built-in browser APIs over external libraries
2. Use vanilla JavaScript/CSS for core functionality
3. Consider lightweight libraries only when significant benefit

### Reference Material Guidelines

1. Prioritize official documentation
2. Use MDN for web standards
3. Reference game design best practices

---

## 6. Logging and Master Log Relationship

**Rule**: Every prompt-response pair must be logged.

- Session logs: `logs/sessions/`
- Task logs: `logs/tasks/`
- Issue logs: `logs/issues/`

**Update `logs/master_log.md`** whenever:
- A new log is created
- A log status changes
- Significant milestones are reached

---

## 7. Restart Protocol

When user says: "Engage restart_protocol.md, I am about to restart"

1. Consult `protocols/restart_protocol.md`
2. Review entire chat history
3. Ensure all content is logged
4. Summarize current state
5. Draft restart prompt with full context

---

## 8. Project Structure

```
EggSimulator/
├── .vscode/
│   └── copilot-instructions.md
├── protocols/
│   ├── master_protocol.md
│   ├── analysis_sub_protocol.md
│   ├── research_sub_protocol.md
│   ├── generation_sub_protocol.md
│   ├── logging_sub_protocol.md
│   ├── tool_identification_sub_protocol.md
│   ├── reference_material_identification_sub_protocol.md
│   ├── tool_and_reference_material_request_sub_protocol.md
│   └── restart_protocol.md
├── indexes/
│   ├── mcp_and_tool_index.md
│   └── reference_material_index.md
├── logs/
│   ├── master_log.md
│   ├── sessions/
│   ├── tasks/
│   └── issues/
├── src/
│   ├── index.html
│   ├── css/
│   └── js/
└── README.md
```


