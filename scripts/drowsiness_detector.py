"""
Script Python untuk integrasi dengan model deteksi kantuk yang sudah ada.
Script ini dapat dijalankan sebagai service terpisah atau diintegrasikan dengan backend.
"""

import cv2
import os
import numpy as np
from keras.models import load_model
import json
import sys
from datetime import datetime

class DrowsinessDetector:
    def __init__(self, model_name='resnet'):
        """
        Initialize the drowsiness detector with ResNet model only
        """
        try:
            # Load cascade classifiers
            self.face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_alt.xml')
            self.left_eye_cascade = cv2.CascadeClassifier('haarcascade_lefteye_2splits.xml')
            self.right_eye_cascade = cv2.CascadeClassifier('haarcascade_righteye_2splits.xml')
            
            # Hanya gunakan model ResNet
            model_path = 'models/resnet50_fine_tune.h5'
            self.model = load_model(model_path)
            
            # Initialize variables
            self.labels = ['Closed', 'Open']
            self.score = 0
            self.font = cv2.FONT_HERSHEY_COMPLEX_SMALL
            self.model_name = 'Resnet50'
            
            print("Drowsiness detector initialized with ResNet50 model")
            
        except Exception as e:
            print(f"Error initializing detector: {str(e)}")
            sys.exit(1)
    
    def preprocess_eye(self, eye_img):
        """
        Preprocess eye image for model prediction
        """
        eye_img = cv2.cvtColor(eye_img, cv2.COLOR_BGR2RGB)
        eye_img = cv2.resize(eye_img, (32, 32))
        eye_img = eye_img.reshape((-1, 32, 32, 3))
        return eye_img
    
    def detect_drowsiness(self, frame):
        """
        Detect drowsiness from a single frame
        Returns: dict with detection results
        """
        height, width = frame.shape[:2]
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces and eyes
        faces = self.face_cascade.detectMultiScale(gray, minNeighbors=5, scaleFactor=1.1, minSize=(25,25))
        left_eyes = self.left_eye_cascade.detectMultiScale(gray)
        right_eyes = self.right_eye_cascade.detectMultiScale(gray)
        
        left_eye_status = 'open'
        right_eye_status = 'open'
        
        # Process right eye
        for (x, y, w, h) in right_eyes:
            r_eye = frame[y:y+h, x:x+w]
            r_eye = self.preprocess_eye(r_eye)
            rpred = np.argmax(self.model.predict(r_eye), axis=-1)
            right_eye_status = 'closed' if rpred[0] == 0 else 'open'
            break
        
        # Process left eye
        for (x, y, w, h) in left_eyes:
            l_eye = frame[y:y+h, x:x+w]
            l_eye = self.preprocess_eye(l_eye)
            lpred = np.argmax(self.model.predict(l_eye), axis=-1)
            left_eye_status = 'closed' if lpred[0] == 0 else 'open'
            break
        
        # Update drowsiness score
        if left_eye_status == 'closed' and right_eye_status == 'closed':
            self.score += 1
        else:
            self.score -= 1
        
        if self.score < 0:
            self.score = 0
        
        # Determine if drowsy
        is_drowsy = self.score > 12
        
        return {
            'left_eye': left_eye_status,
            'right_eye': right_eye_status,
            'score': self.score
        }
    
    def process_image_file(self, image_path):
        """
        Process a single image file
        """
        try:
            frame = cv2.imread(image_path)
            if frame is None:
                return {'error': 'Could not load image'}
            
            result = self.detect_drowsiness(frame)
            return result
            
        except Exception as e:
            return {'error': str(e)}

def main():
    """
    Main function for command line usage
    """
    if len(sys.argv) < 3:
        print("Usage: python drowsiness_detector.py <image_path> <model_name>")
        print("model_name: resnet | mobilenet | vgg")
        sys.exit(1)
    
    image_path = sys.argv[1]
    model_name = sys.argv[2]
    detector = DrowsinessDetector(model_name=model_name)
    result = detector.process_image_file(image_path)
    
    # Output result as JSON
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
