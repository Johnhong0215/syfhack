# MP3 Automation Project

A powerful Python-based automation tool for processing MP3 files, transcribing audio content, and extracting structured information from meeting transcripts.

## Features

- Audio file transcription using Faster Whisper
- Intelligent analysis of meeting transcripts
- Extraction of action items and stories
- Structured JSON output with detailed metadata
- Support for multiple audio formats
- Automated processing pipeline

## Prerequisites

- Python 3.8 or higher
- OpenAI API key
- FFmpeg (for audio processing)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mp3-automation
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the project root and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

## Project Structure

```
mp3-automation/
├── input/              # Directory for input MP3 files
├── output/             # Directory for processed outputs
├── MainDB/            # Database storage
├── main.py            # Main execution script
├── transcription.py   # Audio transcription module
├── summary.py         # Transcript analysis and story extraction
└── requirements.txt   # Project dependencies
```

## Usage

1. Place your MP3 files in the `input/` directory.

2. Run the main script:
```bash
python main.py
```

The script will:
- Process all MP3 files in the input directory
- Generate transcriptions
- Analyze the content
- Create structured JSON outputs with:
  - Story titles
  - Descriptions
  - Required skills
  - Story points
  - Prerequisites
  - Assignees

## Output Format

The system generates JSON files with the following structure:

```json
[
  {
    "title": "Story Title",
    "description": "Detailed description of the story",
    "required_skills": ["Skill1", "Skill2"],
    "story_points": 5,
    "prerequisites": ["Prerequisite1", "Prerequisite2"],
    "assignee": "Assignee Name"
  }
]
```

## Skills Classification

The system recognizes and categorizes skills into four main categories:

1. Programming
   - Python, SQL, R, Pandas, NumPy, etc.

2. Modeling
   - Model Validation, Data Cleaning, Feature Engineering, etc.

3. Business
   - Business Acumen, Lending Decisions, Profitability Analysis

4. Tools
   - Git, Jupyter Notebooks, VS Code, Cloud Platforms

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Add your license information here]

## Support

For support, please [add your contact information or support channels] 
