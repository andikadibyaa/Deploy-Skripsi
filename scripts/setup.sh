#!/bin/bash

echo "🚀 Setting up DrowsyGuard application..."

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p temp
mkdir -p public/models
mkdir -p scripts

# Check if Python is installed
echo "🐍 Checking Python installation..."
if command -v python3 &> /dev/null; then
    echo "✅ Python3 is installed"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    echo "✅ Python is installed"
    PYTHON_CMD="python"
else
    echo "❌ Python is not installed. Please install Python first."
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
$PYTHON_CMD -m pip install --upgrade pip
$PYTHON_CMD -m pip install opencv-python tensorflow keras numpy pillow

# Check Node.js installation
echo "📦 Checking Node.js installation..."
if command -v npm &> /dev/null; then
    echo "✅ Node.js and npm are installed"
else
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOL
# Environment variables for DrowsyGuard
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
EOL
fi

# Download OpenCV cascade files if they don't exist
echo "📥 Checking OpenCV cascade files..."
MODELS_DIR="public/models"

if [ ! -f "$MODELS_DIR/haarcascade_frontalface_alt.xml" ]; then
    echo "📥 Downloading face cascade..."
    curl -o "$MODELS_DIR/haarcascade_frontalface_alt.xml" https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_alt.xml
fi

if [ ! -f "$MODELS_DIR/haarcascade_lefteye_2splits.xml" ]; then
    echo "📥 Downloading left eye cascade..."
    curl -o "$MODELS_DIR/haarcascade_lefteye_2splits.xml" https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_lefteye_2splits.xml
fi

if [ ! -f "$MODELS_DIR/haarcascade_righteye_2splits.xml" ]; then
    echo "📥 Downloading right eye cascade..."
    curl -o "$MODELS_DIR/haarcascade_righteye_2splits.xml" https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_righteye_2splits.xml
fi

echo "✅ Setup completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Place your trained model file (attentive.h5) in public/models/"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📝 Note: If you don't have the trained model file, the application will work in simulation mode."
