# Flashcard Skill

## Overview
This skill guides you through creating educational flashcards.

## Output Format

**STRICT JSON ONLY** - No markdown, no explanations, no text before or after.

```json
[
  {
    "front": {"html": "<div>Question?</div>"},
    "back": {"html": "<div>Answer</div>"}
  }
]
```

## Requirements

Each flashcard must have:
- `front`: The question or prompt (with HTML)
- `back`: The answer or explanation (with HTML)

### HTML Guidelines
- Use simple HTML tags: `<div>`, `<strong>`, `<em>`, `<ul>`, `<li>`
- Keep content concise
- Use proper HTML structure

## Card Content

### Types of Flashcards

1. **Definition** - Term and definition
   - Front: "What is X?"
   - Back: The definition of X

2. **Concept** - Question and answer
   - Front: "How does X work?"
   - Back: Explanation of how X works

3. **Formula** - Formula and meaning
   - Front: "What does E = mc² mean?"
   - Back: E = energy, m = mass, c = speed of light

4. **Terminology** - Word and meaning
   - Front: "Define X"
   - Back: Brief definition

## Guidelines

1. **Generate** a JSON array of flashcards
2. **Use clear, simple** language appropriate for learning
3. **Include** key definitions, concepts, and terminology
4. **Keep content** concise and focused
5. **One concept** per card

## Example

**Input:** Topic: "HTTP Methods"

**Output:**
```json
[
  {
    "front": {"html": "<div>What is GET method?</div>"},
    "back": {"html": "<div>GET requests data from a specified resource. It should only retrieve data, not modify it.</div>"}
  },
  {
    "front": {"html": "<div>What is POST method?</div>"},
    "back": {"html": "<div>POST sends data to a server to create a new resource. It modifies data on the server.</div>"}
  },
  {
    "front": {"html": "<div>What is PUT method?</div>"},
    "back": {"html": "<div>PUT replaces an existing resource with the new data sent in the request.</div>"}
  }
]
```

## CRITICAL

- Return ONLY valid JSON
- No markdown code blocks
- No explanations
- Just JSON array
- Use `front.html` and `back.html` structure
