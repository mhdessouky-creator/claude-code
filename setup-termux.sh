#!/data/data/com.termux/files/usr/bin/bash
# =================================================================
# 🔧 Termux Environment Setup Script
# =================================================================
# This script sets up all required dependencies for the AI Agent
# يثبت هذا السكريبت جميع المتطلبات اللازمة لتشغيل الوكيل الذكي
# =================================================================

# الألوان
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${MAGENTA}    🔧 Termux Environment Setup for AI Agent${CYAN}           ║${NC}"
echo -e "${CYAN}║        إعداد بيئة Termux للوكيل الذكي                      ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Update packages
echo -e "${YELLOW}📦 Step 1/6: Updating packages...${NC}"
echo -e "${CYAN}تحديث الحزم...${NC}"
pkg update -y && pkg upgrade -y
echo -e "${GREEN}✓ Packages updated${NC}"
echo ""

# Step 2: Install Node.js
echo -e "${YELLOW}📦 Step 2/6: Installing Node.js...${NC}"
echo -e "${CYAN}تثبيت Node.js...${NC}"
pkg install -y nodejs
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js installed: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}✗ Failed to install Node.js${NC}"
    exit 1
fi
echo ""

# Step 3: Install Python and build tools
echo -e "${YELLOW}📦 Step 3/6: Installing Python and build tools...${NC}"
echo -e "${CYAN}تثبيت Python وأدوات البناء...${NC}"
pkg install -y python python-pip
pkg install -y build-essential clang make binutils
echo -e "${GREEN}✓ Python and build tools installed${NC}"
echo ""

# Step 4: Configure npm for Termux
echo -e "${YELLOW}⚙️  Step 4/6: Configuring npm for Termux...${NC}"
echo -e "${CYAN}تكوين npm لبيئة Termux...${NC}"

# Set Python path for node-gyp
npm config set python "$(which python)"

# Configure build flags for Termux
npm config set build-from-source true

echo -e "${GREEN}✓ npm configured for Termux${NC}"
echo ""

# Step 5: Install Git (if not installed)
echo -e "${YELLOW}📦 Step 5/6: Installing Git...${NC}"
echo -e "${CYAN}تثبيت Git...${NC}"
pkg install -y git
echo -e "${GREEN}✓ Git installed${NC}"
echo ""

# Step 6: Display environment info
echo -e "${YELLOW}ℹ️  Step 6/6: Environment Information${NC}"
echo -e "${CYAN}معلومات البيئة:${NC}"
echo ""
echo -e "${CYAN}Node.js:${NC} $(node --version)"
echo -e "${CYAN}npm:${NC} $(npm --version)"
echo -e "${CYAN}Python:${NC} $(python --version)"
echo -e "${CYAN}Git:${NC} $(git --version)"
echo ""

# Final instructions
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✅ Setup Complete! الإعداد مكتمل!             ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}📝 Next Steps - الخطوات التالية:${NC}"
echo ""
echo -e "${YELLOW}1.${NC} Install project dependencies - تثبيت متطلبات المشروع:"
echo -e "   ${CYAN}npm install${NC}"
echo ""
echo -e "${YELLOW}2.${NC} Setup environment file - إعداد ملف البيئة:"
echo -e "   ${CYAN}cp .env.example .env${NC}"
echo -e "   ${CYAN}nano .env${NC}  # Add your ANTHROPIC_API_KEY"
echo ""
echo -e "${YELLOW}3.${NC} Run the agent - تشغيل الوكيل:"
echo -e "   ${CYAN}./start-agent.sh${NC}"
echo ""
echo -e "${MAGENTA}💡 Tip:${NC} If you encounter issues with sqlite3, run:"
echo -e "   ${CYAN}npm rebuild sqlite3${NC}"
echo ""
