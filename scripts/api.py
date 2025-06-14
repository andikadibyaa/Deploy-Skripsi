from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

import numpy as np
import cv2
from drowsiness_detector import DrowsinessDetector
import os
import tempfile
from video_drowsiness_detector import VideoDrowsinessDetector

detector = DrowsinessDetector()

@app.route('/detect', methods=['POST'])
def detect():
    try:
        file = request.files['image']
        npimg = np.frombuffer(file.read(), np.uint8)
        frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        result = detector.detect_drowsiness(frame)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/analyze_video', methods=['POST'])
def analyze_video():
    try:
        if 'video' not in request.files:
            print("No video file provided")
            return jsonify({"error": "No video file provided"}), 400
        video_file = request.files['video']
        print("Received video:", video_file.filename)
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
            video_file.save(temp_video.name)
            temp_path = temp_video.name
        print("Saved temp video at:", temp_path)

        video_detector = VideoDrowsinessDetector()
        result = video_detector.process_video(temp_path)
        print("Video analysis result:", result)

        closed_frames = result.get('closed_frames', 0)
        open_frames = result.get('open_frames', 0)
        if closed_frames == 0 and open_frames == 0 and 'eye_states' in result:
            closed_frames = sum(result['eye_states'])
            open_frames = len(result['eye_states']) - closed_frames
        result['closed_frames'] = closed_frames
        result['open_frames'] = open_frames

        os.remove(temp_path)
        return jsonify(result)
    except Exception as e:
        print("Error in /analyze_video:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/history', methods=['GET'])
def history():
    return jsonify([])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

