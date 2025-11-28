# MCP and Tool Index

**Project**: Egg Simulator
**Last Updated**: 2025-11-28

---

## Available Tools

### File Operations

| Tool | Purpose | Usage |
|------|---------|-------|
| `read_file` | Read file contents | Reading source files, configs, docs |
| `write` | Create/overwrite files | Creating new files |
| `search_replace` | Edit existing files | Modifying code |
| `list_dir` | List directory contents | Exploring project structure |
| `glob_file_search` | Find files by pattern | Locating specific file types |
| `delete_file` | Remove files | Cleanup operations |

### Search and Analysis

| Tool | Purpose | Usage |
|------|---------|-------|
| `grep` | Search file contents | Finding code patterns |
| `codebase_search` | Semantic code search | Understanding code by meaning |
| `read_lints` | Get linter errors | Code quality checks |

### External Resources

| Tool | Purpose | Usage |
|------|---------|-------|
| `web_search` | Search the web | Finding current information |
| `mcp_Context7_*` | Library documentation | Getting up-to-date docs |
| `mcp_Supabase_*` | Supabase operations | Database operations (if needed) |
| `mcp_Hugging_Face_*` | ML resources | AI/ML capabilities (if needed) |

### Development

| Tool | Purpose | Usage |
|------|---------|-------|
| `run_terminal_cmd` | Execute commands | Running builds, servers, scripts |
| `todo_write` | Task management | Tracking work items |

---

## Tool Selection Guidelines

### For Egg Simulator Development

1. **File Creation**: Use `write` for new files
2. **File Editing**: Use `search_replace` for modifications
3. **Code Search**: Use `grep` for exact matches, `codebase_search` for semantic
4. **Documentation**: Use `web_search` or Context7 MCPs for library docs

### Performance Considerations

- Prefer targeted file reads over broad searches
- Use `grep` with specific patterns for efficiency
- Batch related operations when possible

---

## MCPs Available

### Context7
- `resolve-library-id`: Find library IDs
- `get-library-docs`: Fetch documentation

### Supabase (if database needed)
- Full suite of database and project management tools

### Hugging Face (if AI features needed)
- Model search, documentation, image generation

---

## Tool Requests Log

| Date | Tool Requested | Status | Resolution |
|------|---------------|--------|------------|
| 2025-11-28 | Initial setup | Complete | All core tools available |


