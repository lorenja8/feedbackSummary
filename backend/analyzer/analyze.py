import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from analyzer.models import FeedbackSummary

load_dotenv(override=False)

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("Missing OPENAI_API_KEY")

client = OpenAI(api_key=api_key)


def analyze_feedback_raw(feedback_text: str):
    system_prompt = """
    You are an assistant that analyzes student feedback about a teacher.
    Your task is to extract structured information with high consistency.

    You must follow these rules:
    - Always output JSON that follows the schema exactly.
    - Keep trait names short, consistent, and semantically meaningful.
    - Merge identical traits under a single trait name.
    - Do not invent traits not supported by the text.
    - Keep examples factual and directly quoted from the user text.
    - Include at most one example sentence per user for each trait.
    - Do not include your own commentary.
    """

    user_prompt = f"""
    Analyze the following feedback entries from multiple students.
    
    Your task:
    1. Determine overall_sentiment  
       Choose one of:
       ["positive", "negative", "rather positive", "rather negative", "mixed"]
    
    2. Extract *traits* describing the teacher.  
       Rules for traits:
       - Traits must be short (one to five words).
       - Traits should express a sentiment, avoid merging opposing views into a single trait (e.g. "unfair" and "fair" → "fairness")
       - Merge similar traits (e.g., "humorous" and "funny" → "humorous").
       - Avoid duplicating traits with slightly different names.
       - Do not create traits mentioned by only one person unless strongly emphasized.
    
    3. For each trait, provide examples:
       - One example for each student mentioning the trait      
       - At most one sentence per user
       - Quote the student text verbatim  
       - Examples must clearly illustrate the trait
    
    4. Output must strictly follow the JSON schema.
    
    Feedback to analyze:
    {feedback_text}
    """

    response = client.responses.create(
        model="gpt-4o-mini",
        input=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        text={
            "format": {
                "type": "json_schema",
                "name": "feedback_summary",
                "schema": {
                    "type": "object",
                    "properties": {
                        "overall_sentiment": {"type": "string"},
                        "traits": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "trait": {"type": "string"},
                                    "examples": {
                                        "type": "array",
                                        "items": {"type": "string"}
                                    }
                                },
                                "required": ["trait", "examples"],
                                "additionalProperties": False
                            }
                        }
                    },
                    "required": ["overall_sentiment", "traits"],
                    "additionalProperties": False
                },
                "strict": True
            }
        }
    )

    feedback_summary = response.output_text

    return feedback_summary


def analyze_feedback_model(feedback_text: str) -> FeedbackSummary:
    raw = analyze_feedback_raw(feedback_text)
    return FeedbackSummary(**raw)


def attempt_json_repair(bad_text):
    repair_prompt = f"""
    The following is intended to be valid JSON but contains formatting errors.
    Fix ONLY the JSON so that it becomes valid, without changing the content.

    JSON to fix:
    {bad_text}
    """

    repair_response = client.responses.create(
        model="gpt-4o-mini",
        input=[{"role": "user", "content": repair_prompt}]
    )

    return repair_response.output_text


def safe_parse_json(response_text):
    try:
        return json.loads(response_text)
    except Exception:
        return None


def analyze_feedback_safe(feedback_text, max_retries=2):
    for attempt in range(max_retries):
        try:
            raw = analyze_feedback_raw(feedback_text)

            parsed = safe_parse_json(raw)
            if parsed is not None:
                return parsed

            # try repair
            repaired = attempt_json_repair(raw)
            parsed = safe_parse_json(repaired)
            if parsed is not None:
                return parsed

        except Exception as e:
            print(f"Error on attempt {attempt+1}: {e}")

    # Final fallback (never return None)
    return {
        "overall_sentiment": "mixed",
        "traits": []
    }
