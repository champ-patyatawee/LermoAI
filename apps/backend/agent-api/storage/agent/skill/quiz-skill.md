# Quiz Skill

## Overview
This skill guides you through creating multiple choice quiz questions.

## Output Format

**STRICT JSON ONLY** - No markdown, no explanations, no text before or after.

```json
{
  "questions": [
    {
      "question": "Question text",
      "choices": [
        {"text": "Option A"},
        {"text": "Option B"},
        {"text": "Option C"},
        {"text": "Option D"}
      ],
      "correctAnswer": "a"
    }
  ]
}
```

## Requirements

### Question Structure
Each question must have:
- `question`: The question text (string)
- `choices`: Array of exactly 4 choices
- `correctAnswer`: Letter of correct answer (a, b, c, or d)

### Choice Requirements
- Each choice must have `text` key
- All 4 choices must be distinct
- Only one correct answer
- Choices should be plausible (not obviously wrong)

### Question Quality
- Clear and unambiguous
- Test understanding, not just memorization
- Include variety of difficulty levels
- Avoid trick questions

## Guidelines

1. **Generate questions** that test core concepts
2. **Make choices distinct** - no "all of the above" or "none of the above"
3. **Correct answer** should be genuinely correct, not the longest
4. **Avoid**:
   - Ambiguous wording
   - Multiple correct answers
   - Questions outside the topic
   - Very long questions

## Example

**Input:** Topic: "Python Variables"

**Output:**
```json
{
  "questions": [
    {
      "question": "Which of the following is a valid variable name in Python?",
      "choices": [
        {"text": "2variable"},
        {"text": "my_variable"},
        {"text": "class"},
        {"text": "my-variable"}
      ],
      "correctAnswer": "b"
    }
  ]
}
```

## CRITICAL

- Return ONLY valid JSON
- No markdown code blocks
- No explanations
- Just JSON
