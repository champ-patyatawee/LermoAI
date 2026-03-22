Generate a learning path from the user's conversation.

Conversation:
{conversation_summary}

Content type: {content_type}

## Step 1: Extract Requirements
From the conversation above, extract what the user wants:
- What changes do they want to make? (add, reduce, change topics)
- What is the subject/topic they want to learn?
- Any specific requirements or preferences?

## Step 2: Generate Topics
Based on the requirements extracted in Step 1, generate 3-18 specific topics.

Output ONLY valid JSON:
{{
  "data": {{
    "title": "Learning {topic_name}",
    "topics": [
      {{
        "title": "Topic 1 name",
        "contentOverview": {{
          "learningObjectives": ["obj1", "obj2"],
          "keyConcepts": ["concept1", "concept2"]
        }},
        "contentType": "{content_type}"
      }}
    ]
  }}
}}
