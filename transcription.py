from faster_whisper import WhisperModel
from pydub import AudioSegment
from pathlib import Path

def convert_to_wav(audio_path):
    print(f"[🔄] Converting {audio_path.name} to WAV...")
    try:
        audio = AudioSegment.from_file(audio_path)  # 자동 포맷 감지 (.mp3, .m4a, .wav 등)
        wav_path = audio_path.with_suffix(".wav")
        audio.export(wav_path, format="wav")
        print(f"[✅] Saved WAV as {wav_path.name}")
        return wav_path
    except Exception as e:
        print(f"[❌] Failed to convert {audio_path.name}: {e}")
        return None

def transcribe_with_faster_whisper(audio_path):
    print(f"[🧠] Loading faster-whisper model...")
    model = WhisperModel("base", compute_type="int8")

    print(f"[📜] Transcribing {audio_path.name}...")
    segments, _ = model.transcribe(str(audio_path))
    
    transcript = " ".join([seg.text for seg in segments])
    print(f"[✅] Transcription complete. Length: {len(transcript)} characters")
    return transcript
