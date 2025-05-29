import json
from pathlib import Path
import subprocess
from typing import List, Dict, Optional

# Predefined list of relevant skills
CREDIT_MODELING_SKILLS = {
    "Programming": [
        "Python",
        "SQL",
        "R",
        "Pandas",
        "NumPy",
        "Scikit-learn",
        "XGBoost",
        "LightGBM"
    ],
    "Modeling": [
        "Model Validation",
        "Data Cleaning",
        "Feature Engineering",
        "Time Series Analysis",
        "Credit Risk Modeling",
        "FICO Score Interpretation",
        "Regulatory Compliance",
        "Fraud Detection",
        "Scorecard Development",
        "Model Governance Documentation"
    ],
    "Business": [
        "Business Acumen",
        "Lending Decisions",
        "Profitability Analysis"
    ],
    "Tools": [
        "Git",
        "Jupyter Notebooks",
        "VS Code",
        "AWS",
        "GCP",
        "Azure"
    ]
}

def count_action_items(transcript: str) -> int:
    """
    First model call: Count the number of distinct action items in the transcript.
    """
    prompt = f"""
    Analyze this meeting transcript and determine how many distinct actionable stories or tasks are discussed.
    Only count items that are actual tasks or stories that need to be completed. 
    Return just the number as an integer. Just the number. 

    Transcript:
    {transcript}
    """
    
    result = subprocess.run(
        ["ollama", "run", "llama3.2", prompt],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    try:
        num_stories = int(result.stdout.strip())
        return min(10, num_stories)  # Cap at 10 stories
    except ValueError:
        print("Warning: Could not parse number of stories, defaulting to 5")
        return 5

def extract_story_titles(transcript: str, num_stories: int) -> List[str]:
    """
    Second model call: Extract titles for each story.
    """
    prompt = f"""
    Extract {num_stories} distinct story titles from this meeting transcript.
    Return them as a JSON array of strings.
    Each title should be clear and concise.

    Transcript:
    {transcript}
    """
    
    result = subprocess.run(
        ["ollama", "run", "llama3.2", prompt],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    try:
        return json.loads(result.stdout.strip())
    except json.JSONDecodeError:
        print("Warning: Could not parse story titles")
        return [f"Story {i+1}" for i in range(num_stories)]

def extract_story_description(transcript: str, story_title: str) -> str:
    """
    New function: Extract detailed description for a specific story.
    """
    prompt = f"""
    For the story titled "{story_title}", write a concise description (2-3 sentences) based on this transcript.
    Rules:
    - Start directly with the description, no introductory text
    - No line breaks or formatting
    - Focus on what needs to be done
    - Include key requirements and deadlines
    - Be direct and clear

    Transcript:
    {transcript}
    """
    
    result = subprocess.run(
        ["ollama", "run", "llama3.2", prompt],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Clean up the output
    description = result.stdout.strip()
    # Remove any "Here is..." or similar introductory text
    description = description.replace("Here is a detailed description based on the transcript:", "")
    description = description.replace("Here is the description:", "")
    # Remove multiple newlines and extra spaces
    description = " ".join(description.split())
    return description

def extract_required_skills(transcript: str, story_title: str) -> List[str]:
    """
    Third model call: Extract required skills for a specific story.
    """
    # First, get the model's analysis of which skills are needed
    prompt = f"""
    For the story titled "{story_title}", analyze which skills from this list would be required:
    {json.dumps(CREDIT_MODELING_SKILLS, indent=2)}

    Return a JSON array of skill names that are relevant to this story.
    Rules:
    - Only include skills that are explicitly mentioned or clearly implied
    - Return ONLY the JSON array, no additional text
    - Use exact skill names from the provided list
    - If no skills are clearly needed, return an empty array []

    Transcript:
    {transcript}
    """
    
    result = subprocess.run(
        ["ollama", "run", "llama3.2", prompt],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    try:
        # Clean up the output to ensure we only get the JSON array
        output = result.stdout.strip()
        # Remove any text before or after the JSON array
        start_idx = output.find('[')
        end_idx = output.rfind(']') + 1
        if start_idx >= 0 and end_idx > start_idx:
            output = output[start_idx:end_idx]
        return json.loads(output)
    except json.JSONDecodeError:
        print(f"Warning: Could not parse skills for story: {story_title}")
        return []

def estimate_story_points(transcript: str, story_title: str) -> int:
    """
    Fourth model call: Estimate story points for a specific story.
    """
    prompt = f"""
    For the story titled "{story_title}", estimate the story points (1-5) based on complexity.
    Return just the number as an integer.

    Transcript:
    {transcript}
    """
    
    result = subprocess.run(
        ["ollama", "run", "llama3.2", prompt],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    try:
        points = int(result.stdout.strip())
        return max(1, min(5, points))  # Ensure points are between 1 and 5
    except ValueError:
        return 3  # Default to middle value

def extract_prerequisites(transcript: str, story_title: str) -> List[str]:
    """
    Fifth model call: Extract prerequisites for a specific story.
    """
    prompt = f"""
    For the story titled "{story_title}", extract any prerequisites from this transcript.
    Return them as a JSON array of strings.
    Only include prerequisites that are explicitly mentioned.

    Transcript:
    {transcript}
    """
    
    result = subprocess.run(
        ["ollama", "run", "llama3.2", prompt],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    try:
        return json.loads(result.stdout.strip())
    except json.JSONDecodeError:
        return []

def extract_assignee(transcript: str, story_title: str) -> Optional[str]:
    """
    Sixth model call: Extract assignee for a specific story.
    """
    prompt = f"""
    For the story titled "{story_title}", extract the assignee(s) from this transcript.
    Rules:
    - Return a JSON array of names
    - Only include names that are explicitly assigned to this story
    - Return [] if no assignee is mentioned (it can be empty)
    - Do not include any explanatory text
    - Names should be in the format they appear in the transcript

    Transcript:
    {transcript}
    """
    
    result = subprocess.run(
        ["ollama", "run", "llama3.2", prompt],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    try:
        # Clean up the output to ensure we only get the JSON array
        output = result.stdout.strip()
        # Remove any text before or after the JSON array
        start_idx = output.find('[')
        end_idx = output.rfind(']') + 1
        if start_idx >= 0 and end_idx > start_idx:
            output = output[start_idx:end_idx]
        assignees = json.loads(output)
        return assignees[0] if assignees else None  # Return first assignee or None
    except (json.JSONDecodeError, IndexError):
        return None

def analyze_action_items(transcript: str) -> List[Dict]:
    """
    Main function that orchestrates all the model calls and combines the results.
    """
    print("[1️⃣] Counting action items...")
    num_stories = count_action_items(transcript)
    
    print("[2️⃣] Extracting story titles...")
    titles = extract_story_titles(transcript, num_stories)
    
    stories = []
    for i, title in enumerate(titles, 1):
        print(f"[📝] Processing story {i}/{num_stories}: {title}")
        
        print("  [3️⃣] Extracting story description...")
        description = extract_story_description(transcript, title)
        
        print("  [4️⃣] Extracting required skills...")
        skills = extract_required_skills(transcript, title)
        
        print("  [5️⃣] Estimating story points...")
        points = estimate_story_points(transcript, title)
        
        print("  [6️⃣] Extracting prerequisites...")
        prereqs = extract_prerequisites(transcript, title)
        
        print("  [7️⃣] Extracting assignee...")
        assignee = extract_assignee(transcript, title)
        
        story = {
            "title": title,
            "description": description,
            "required_skills": skills,
            "story_points": points,
            "prerequisites": prereqs,
            "assignee": assignee
        }
        stories.append(story)
    
    return stories

def process_transcript(transcript_path: Path) -> None:
    """
    Process a transcript file and generate a structured JSON output.
    """
    print(f"[📝] Processing transcript: {transcript_path.name}")
    
    # Read the transcript
    with open(transcript_path, 'r', encoding='utf-8') as f:
        transcript = f.read()
    
    # Analyze the transcript
    print("[🧠] Analyzing transcript for action items...")
    stories = analyze_action_items(transcript)
    
    # Save the results
    output_path = transcript_path.with_suffix('.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(stories, f, indent=2)
    
    print(f"[✅] Saved {len(stories)} stories to {output_path.name}")

def main():
    # Get all transcript files in the current directory
    transcript_files = list(Path('.').glob('*.txt'))
    
    if not transcript_files:
        print("[❌] No transcript files found!")
        return
    
    for transcript_file in transcript_files:
        process_transcript(transcript_file)

if __name__ == "__main__":
    main()
