from pydub import AudioSegment
import os

def convert_mp3_to_wav(input_path):
    """Convert MP3 to WAV format"""
    try:
        output_path = input_path.replace('.mp3', '.wav')
        audio = AudioSegment.from_mp3(input_path)
        audio.export(output_path, format="wav")
        return output_path
    except Exception as e:
        print(f"Audio conversion error: {e}")
        print("Please install ffmpeg: https://ffmpeg.org/download.html")
        return None

def convert_wav_to_mp3(input_path):
    """Convert WAV to MP3 format"""
    try:
        output_path = input_path.replace('.wav', '.mp3')
        audio = AudioSegment.from_wav(input_path)
        audio.export(output_path, format="mp3")
        return output_path
    except Exception as e:
        print(f"Audio conversion error: {e}")
        return None

def convert_mp3_to_m4a(input_path):
    """Convert MP3 to M4A format"""
    try:
        output_path = input_path.replace('.mp3', '.m4a')
        audio = AudioSegment.from_mp3(input_path)
        audio.export(output_path, format="ipod")
        return output_path
    except Exception as e:
        print(f"Audio conversion error: {e}")
        return None

def convert_wav_to_m4a(input_path):
    """Convert WAV to M4A format"""
    try:
        output_path = input_path.replace('.wav', '.m4a')
        audio = AudioSegment.from_wav(input_path)
        audio.export(output_path, format="ipod")
        return output_path
    except Exception as e:
        print(f"Audio conversion error: {e}")
        return None

def convert_m4a_to_mp3(input_path):
    """Convert M4A to MP3 format"""
    try:
        output_path = input_path.replace('.m4a', '.mp3')
        audio = AudioSegment.from_file(input_path, format="m4a")
        audio.export(output_path, format="mp3")
        return output_path
    except Exception as e:
        print(f"Audio conversion error: {e}")
        return None

def convert_m4a_to_wav(input_path):
    """Convert M4A to WAV format"""
    try:
        output_path = input_path.replace('.m4a', '.wav')
        audio = AudioSegment.from_file(input_path, format="m4a")
        audio.export(output_path, format="wav")
        return output_path
    except Exception as e:
        print(f"Audio conversion error: {e}")
        return None