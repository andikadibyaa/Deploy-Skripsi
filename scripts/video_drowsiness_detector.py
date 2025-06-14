"""
Video Drowsiness Detection Script
Adapted from the provided Python code for backend integration
"""

import cv2
import numpy as np
import sys
import json
import math
from tensorflow.keras.models import load_model
import os

class VideoDrowsinessDetector:
    def __init__(self, model_path='models/resnet50_fine_tune.h5'):
        """
        Initialize the video drowsiness detector
        """
        try:
            # Load cascade classifiers
            self.face_cascade = cv2.CascadeClassifier('models/haarcascade_frontalface_alt.xml')
            self.left_eye_cascade = cv2.CascadeClassifier('models/haarcascade_lefteye_2splits.xml')
            self.right_eye_cascade = cv2.CascadeClassifier('models/haarcascade_righteye_2splits.xml')

            # Load the trained model
            self.model = load_model(model_path)
            
            self.font = cv2.FONT_HERSHEY_SIMPLEX
            
        except Exception as e:
            print(f"Error initializing detector: {str(e)}", file=sys.stderr)
            sys.exit(1)
    
    def process_video(self, video_path):
        """
        Process video file and return drowsiness analysis
        """
        try:
            cap = cv2.VideoCapture(video_path)
            
            if not cap.isOpened():
                raise Exception("Cannot open video file")
            
            # Get video properties
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            if not fps or fps == 0:
                raise Exception("FPS is zero or not detected in video")
            duration = total_frames / fps
            # Threshold for drowsiness detection (300ms in frames)
            threshold_frames = math.ceil(0.3 * fps)

            # Variables to store eye states per frame
            eye_states = []
            
            frame_count = 0
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame_count += 1
                
                # Process frame for eye detection
                eye_status = self.detect_eyes_in_frame(frame)
                eye_states.append(1 if eye_status == 'Closed' else 0)
                
                # Optional: Add progress tracking here if needed
                if frame_count % 100 == 0:
                    progress = (frame_count / total_frames) * 100
                    print(f"Processing: {progress:.1f}%", file=sys.stderr)
        
            cap.release()
            
            # Analyze eye states for drowsiness
            analysis_result = self.analyze_drowsiness(eye_states, threshold_frames)
            
            # Hitung jumlah frame mata tertutup & terbuka
            closed_frames = sum(eye_states)
            open_frames = len(eye_states) - closed_frames

            # Prepare final result
            result = {
                'is_drowsy': analysis_result['max_closed_streak'] >= threshold_frames,
                'drowsy_episodes': analysis_result['drowsy_count'],
                'max_closed_streak': analysis_result['max_closed_streak'],
                'total_frames': total_frames,
                'fps': fps,
                'duration': duration,
                'threshold_frames': threshold_frames,
                'closed_frames': closed_frames,
                'open_frames': open_frames,
                # 'eye_states': eye_states, # Uncomment if you want to debug
            }
            
            return result
            
        except Exception as e:
            raise Exception(f"Error processing video: {str(e)}")
    
    def detect_eyes_in_frame(self, frame):
        """
        Detect eye status in a single frame
        """
        height, width = frame.shape[:2]
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect eyes
        left_eyes = self.left_eye_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
        right_eyes = self.right_eye_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
        
        eye_closed_count = 0
        
        # Check right eye
        for (x, y, w, h) in right_eyes:
            r_eye = frame[y:y + h, x:x + w]
            r_eye = cv2.cvtColor(r_eye, cv2.COLOR_BGR2RGB)
            r_eye = cv2.resize(r_eye, (32, 32))
            r_eye = r_eye.reshape((-1, 32, 32, 3))
            
            rpred = np.argmax(self.model.predict(r_eye, verbose=0), axis=-1)
            if rpred[0] == 0:  # 0 = closed, 1 = open
                eye_closed_count += 1
            break
        
        # Check left eye
        for (x, y, w, h) in left_eyes:
            l_eye = frame[y:y + h, x:x + w]
            l_eye = cv2.cvtColor(l_eye, cv2.COLOR_BGR2RGB)
            l_eye = cv2.resize(l_eye, (32, 32))
            l_eye = l_eye.reshape((-1, 32, 32, 3))
            
            lpred = np.argmax(self.model.predict(l_eye, verbose=0), axis=-1)
            if lpred[0] == 0:  # 0 = closed, 1 = open
                eye_closed_count += 1
            break
        
        # Debugging output
        print(
            f"Right eyes: {len(right_eyes)}, Left eyes: {len(left_eyes)}, "
            f"rpred: {rpred if len(right_eyes) > 0 else 'N/A'}, "
            f"lpred: {lpred if len(left_eyes) > 0 else 'N/A'}"
        )
        
        # Return status based on closed eye count
        return 'Closed' if eye_closed_count == 2 else 'Open'
    
    def analyze_drowsiness(self, eye_states, threshold_frames):
        """
        Analyze eye states to determine drowsiness episodes
        """
        max_closed_streak = 0
        current_closed_streak = 0
        drowsy_count = 0
        
        for frame_state in eye_states:
            if frame_state == 1:  # Eyes closed
                current_closed_streak += 1
                max_closed_streak = max(max_closed_streak, current_closed_streak)
            else:  # Eyes open
                # Check if previous streak was drowsy episode
                if current_closed_streak >= threshold_frames:
                    drowsy_count += 1
                current_closed_streak = 0
        
        # Check final streak if video ends with eyes closed
        if current_closed_streak >= threshold_frames:
            drowsy_count += 1
        
        return {
            'max_closed_streak': max_closed_streak,
            'drowsy_count': drowsy_count
        }

def main():
    """
    Main function for command line usage
    """
    if len(sys.argv) < 2:
        print("Usage: python video_drowsiness_detector.py <video_path>", file=sys.stderr)
        sys.exit(1)
    
    video_path = sys.argv[1]
    
    try:
        detector = VideoDrowsinessDetector()
        result = detector.process_video(video_path)
        
        # Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
