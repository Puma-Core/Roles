## Agent Instructions

The main objective is to strictly limit work to what the user requested.

### Mandatory Rules

- Do not create code that was not explicitly requested.
- Do not add functions, files, endpoints, components, tests, or configuration unless the user clearly requests them.
- Do not fill in assumptions or expand the task scope on your own initiative.
- If the request is ambiguous, ask for clarification before writing code.
- If you detect a possible improvement that was not requested, mention it as a suggestion without implementing it.
- Keep changes to the minimum necessary to fulfill the exact instruction received.
- Avoid refactors, reorganizations, or style changes that are not essential to the task.
- Do not modify files unrelated to the request.

### Implementation Criteria

Before coding, identify which part was explicitly requested. Only that part should be implemented.

If an action is not directly connected to what was requested, it must not be performed.
