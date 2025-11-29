#!/bin/bash

# Project Setup Script - سكريبت إعداد المشروع
# Automated project initialization
# Created with Claude Code

set -e  # Exit on error

echo "🚀 Claude Code Project Setup"
echo "============================"
echo ""

# ألوان للطباعة - Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# دالة للطباعة الملونة - Colored print function
print_color() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# دالة للتحقق من وجود أمر - Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# التحقق من Node.js - Check Node.js
print_color "$BLUE" "📦 Checking Node.js..."
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_color "$GREEN" "✓ Node.js $NODE_VERSION installed"
else
    print_color "$RED" "✗ Node.js not found. Please install Node.js first."
    exit 1
fi

# التحقق من npm - Check npm
print_color "$BLUE" "📦 Checking npm..."
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_color "$GREEN" "✓ npm $NPM_VERSION installed"
else
    print_color "$RED" "✗ npm not found."
    exit 1
fi

# التحقق من Git - Check Git
print_color "$BLUE" "📦 Checking Git..."
if command_exists git; then
    GIT_VERSION=$(git --version)
    print_color "$GREEN" "✓ $GIT_VERSION installed"
else
    print_color "$YELLOW" "⚠ Git not found. Some features may not work."
fi

echo ""
print_color "$BLUE" "🎯 Project Type Selection"
echo "=========================="
echo "1) Node.js/Express API"
echo "2) React Application"
echo "3) Python Flask API"
echo "4) Simple HTML/CSS/JS"
echo "5) Full Stack (React + Express)"
echo ""
read -p "Select project type (1-5): " project_type

case $project_type in
    1)
        PROJECT_NAME="express-api"
        print_color "$GREEN" "Creating Node.js/Express API project..."
        ;;
    2)
        PROJECT_NAME="react-app"
        print_color "$GREEN" "Creating React Application..."
        ;;
    3)
        PROJECT_NAME="flask-api"
        print_color "$GREEN" "Creating Python Flask API..."
        ;;
    4)
        PROJECT_NAME="static-site"
        print_color "$GREEN" "Creating Static HTML/CSS/JS site..."
        ;;
    5)
        PROJECT_NAME="fullstack-app"
        print_color "$GREEN" "Creating Full Stack Application..."
        ;;
    *)
        print_color "$RED" "Invalid selection!"
        exit 1
        ;;
esac

echo ""
read -p "Enter project name [$PROJECT_NAME]: " custom_name
PROJECT_NAME=${custom_name:-$PROJECT_NAME}

# إنشاء مجلد المشروع - Create project directory
print_color "$BLUE" "📁 Creating project directory..."
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# تهيئة Git - Initialize Git
if command_exists git; then
    print_color "$BLUE" "🔧 Initializing Git..."
    git init
    print_color "$GREEN" "✓ Git initialized"
fi

# إنشاء الملفات بناءً على نوع المشروع
# Create files based on project type
case $project_type in
    1)
        # Express API
        npm init -y
        npm install express dotenv cors helmet
        npm install --save-dev nodemon jest

        # إنشاء server.js
        cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
EOF

        # إنشاء .env
        cat > .env << 'EOF'
PORT=3000
NODE_ENV=development
EOF

        print_color "$GREEN" "✓ Express API project created!"
        ;;

    2)
        # React App
        if command_exists npx; then
            npx create-react-app .
            print_color "$GREEN" "✓ React project created!"
        else
            print_color "$RED" "✗ npx not found. Cannot create React app."
        fi
        ;;

    3)
        # Flask API
        if command_exists python3; then
            python3 -m venv venv

            cat > app.py << 'EOF'
from flask import Flask, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify(message='Welcome to Flask API!')

@app.route('/api/health')
def health():
    return jsonify(status='OK', timestamp=datetime.now().isoformat())

if __name__ == '__main__':
    app.run(debug=True)
EOF

            cat > requirements.txt << 'EOF'
Flask==3.0.0
python-dotenv==1.0.0
EOF

            print_color "$GREEN" "✓ Flask API project created!"
            print_color "$YELLOW" "⚠ Run 'source venv/bin/activate' to activate virtual environment"
        else
            print_color "$RED" "✗ Python3 not found."
        fi
        ;;

    4)
        # Static Site
        mkdir -p css js

        cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مشروعي - My Project</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <h1>مرحباً بك - Welcome</h1>
    </header>

    <main>
        <section>
            <h2>About</h2>
            <p>This is a simple static website.</p>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 Created with Claude Code</p>
    </footer>

    <script src="js/main.js"></script>
</body>
</html>
EOF

        cat > css/style.css << 'EOF'
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}

header {
    background: #007bff;
    color: white;
    padding: 2rem;
    text-align: center;
}

main {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
}

footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 1rem;
    margin-top: 2rem;
}
EOF

        cat > js/main.js << 'EOF'
// Main JavaScript file
console.log('Website loaded successfully!');

// Add your JavaScript code here
EOF

        print_color "$GREEN" "✓ Static site project created!"
        ;;
esac

# إنشاء .gitignore - Create .gitignore
print_color "$BLUE" "📝 Creating .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
venv/
__pycache__/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Build
dist/
build/
*.log
EOF

# إنشاء README - Create README
print_color "$BLUE" "📝 Creating README..."
cat > README.md << EOF
# $PROJECT_NAME

مشروع تم إنشاؤه باستخدام Claude Code
Project created with Claude Code

## Setup

\`\`\`bash
# Install dependencies
npm install  # or pip install -r requirements.txt for Python

# Run
npm start    # or python app.py for Python
\`\`\`

## Features

- Feature 1
- Feature 2
- Feature 3

## License

MIT
EOF

print_color "$GREEN" "✓ .gitignore and README created!"

# Initial commit
if command_exists git; then
    print_color "$BLUE" "💾 Creating initial commit..."
    git add .
    git commit -m "Initial commit - Project setup with Claude Code"
    print_color "$GREEN" "✓ Initial commit created!"
fi

echo ""
print_color "$GREEN" "========================================="
print_color "$GREEN" "🎉 Project setup complete!"
print_color "$GREEN" "========================================="
echo ""
print_color "$BLUE" "Next steps:"
echo "  1. cd $PROJECT_NAME"
echo "  2. Start coding with Claude Code!"
echo ""
print_color "$YELLOW" "Tip: Use 'claude' command for AI assistance"
