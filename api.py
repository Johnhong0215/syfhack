from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pathlib import Path
import tempfile
import shutil
from transcription import convert_to_wav, transcribe_with_faster_whisper
from summary import analyze_action_items
import json

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/process-audio")
async def process_audio(file: UploadFile = File(...)):
    """
    Endpoint to process an audio file and return structured stories
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Validate file extension
    valid_extensions = ['.mp3', '.m4a', '.wav']
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in valid_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Supported types: {', '.join(valid_extensions)}"
        )

    try:
        # Create a temporary directory
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_dir_path = Path(temp_dir)
            
            # Save uploaded file
            temp_file_path = temp_dir_path / file.filename
            with temp_file_path.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # Convert to WAV
            wav_file = convert_to_wav(temp_file_path)
            if not wav_file:
                raise HTTPException(status_code=500, detail="Failed to convert audio file")
            
            # Transcribe
            transcript = transcribe_with_faster_whisper(wav_file)
            
            # Analyze
            stories = analyze_action_items(transcript)
            
            # Clean up
            wav_file.unlink()
            
            # Return the results
            return JSONResponse(
                content={
                    "status": "success",
                    "data": {
                        "transcript": transcript,
                        "stories": stories
                    }
                }
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-transcript")
async def analyze_transcript(transcript: str):
    """
    Endpoint to analyze an existing transcript
    """
    try:
        stories = analyze_action_items(transcript)
        return JSONResponse(
            content={
                "status": "success",
                "data": {
                    "stories": stories
                }
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 