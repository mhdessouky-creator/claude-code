#!/bin/bash

# Quick Start Script for Termux
# Simple script to run AI Agent on Termux

clear
echo "=================================="
echo "  AI Agent - Quick Start"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Setting up .env file..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "Created .env from .env.example"
        echo ""
        echo "IMPORTANT: Edit .env and add your ANTHROPIC_API_KEY"
        echo "Run: nano .env"
        echo ""
        read -p "Press Enter after you add your API key..."
    else
        echo "Error: .env.example not found"
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Error installing dependencies"
        exit 1
    fi
fi

# Main menu
echo ""
echo "Choose an option:"
echo "1. Chat mode (Interactive)"
echo "2. Quick task"
echo "3. Check status"
echo "4. Install/Update dependencies"
echo "5. Setup .env file"
echo "6. Exit"
echo ""
read -p "Enter choice (1-6): " choice

case $choice in
    1)
        echo "Starting chat mode..."
        node src/cli.js chat
        ;;
    2)
        echo ""
        read -p "Enter task: " task
        node src/cli.js task "$task"
        ;;
    3)
        node src/cli.js status
        ;;
    4)
        echo "Updating dependencies..."
        npm install
        ;;
    5)
        nano .env
        ;;
    6)
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
