from pathlib import Path
from transcription import convert_to_wav, transcribe_with_faster_whisper
from summary import analyze_action_items
import json

input_folder = Path("input")
output_folder = Path("output")
output_folder.mkdir(exist_ok=True)

supported_extensions = ["*.mp3", "*.m4a", "*.wav"]

all_audio_files = []
for pattern in supported_extensions:
    all_audio_files.extend(input_folder.glob(pattern))

print("[📁] Scanning for audio files in input/ ...")

for audio_file in all_audio_files:
    print(f"\n🎧 Processing file: {audio_file.name}")
    print("=" * 50)

    # Step 1: Convert to WAV
    print("\n[1️⃣] Converting audio to WAV...")
    wav_file = convert_to_wav(audio_file)
    if not wav_file:
        print(f"[⏭️] Skipping {audio_file.name} due to conversion error.\n")
        continue

    # Step 2: Transcribe
    print("\n[2️⃣] Transcribing audio...")
    transcript = transcribe_with_faster_whisper(wav_file)
    
    # Step 3: Save transcript
    base = audio_file.stem
    transcript_file = output_folder / f"{base}_transcript.txt"
    transcript_file.write_text(transcript)
    print(f"[💾] Saved transcript → {transcript_file.name}")

    # Step 4: Analyze transcript
    print("\n[3️⃣] Analyzing transcript...")
    stories = analyze_action_items(transcript)
    
    # Step 5: Save structured output
    json_file = output_folder / f"{base}_stories.json"
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(stories, f, indent=2)
    print(f"[💾] Saved stories → {json_file.name}")

    # Step 6: Cleanup
    wav_file.unlink()
    print(f"[🧹] Cleaned up temporary WAV file: {wav_file.name}")
    print("=" * 50)

print("\n✅ All files processed successfully!")
