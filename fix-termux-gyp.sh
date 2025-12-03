#!/data/data/com.termux/files/usr/bin/bash
# =================================================================
# 🔧 Termux node-gyp Fix Script
# =================================================================
# This script fixes the "ModuleNotFoundError: No module named 'distutils'" error
# يصلح هذا السكريبت خطأ distutils في Termux
# =================================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║           🔧 Termux node-gyp Distutils Fix                ║${NC}"
echo -e "${CYAN}║             إصلاح مشكلة distutils في Termux               ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check Python
echo -e "${YELLOW}[1/5] Checking Python...${NC}"
if command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version 2>&1)
    echo -e "${GREEN}✓ Python found: ${PYTHON_VERSION}${NC}"
else
    echo -e "${RED}✗ Python not found!${NC}"
    echo -e "${YELLOW}Install Python with: pkg install python${NC}"
    exit 1
fi
echo ""

# Step 2: Check/Install build tools
echo -e "${YELLOW}[2/5] Checking build tools...${NC}"
if pkg list-installed | grep -q "build-essential"; then
    echo -e "${GREEN}✓ build-essential installed${NC}"
else
    echo -e "${YELLOW}⏳ Installing build-essential...${NC}"
    pkg install build-essential -y
    echo -e "${GREEN}✓ build-essential installed${NC}"
fi
echo ""

# Step 3: Upgrade pip
echo -e "${YELLOW}[3/5] Upgrading pip...${NC}"
python -m pip install --upgrade pip
echo -e "${GREEN}✓ pip upgraded${NC}"
echo ""

# Step 4: Install setuptools (CRITICAL FIX)
echo -e "${YELLOW}[4/5] Installing setuptools (fixes distutils error)...${NC}"
pip install --upgrade setuptools
echo -e "${GREEN}✓ setuptools installed${NC}"
echo ""

# Step 5: Verify distutils works
echo -e "${YELLOW}[5/5] Verifying distutils...${NC}"
if python -c "from distutils.version import StrictVersion; print('OK')" 2>/dev/null; then
    echo -e "${GREEN}✓ distutils is working!${NC}"
else
    echo -e "${RED}✗ distutils still not working${NC}"
    echo -e "${YELLOW}Try: pip install --force-reinstall setuptools${NC}"
    exit 1
fi
echo ""

# Success message
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                   ✅ Fix Applied Successfully!             ║${NC}"
echo -e "${GREEN}║                تم تطبيق الإصلاح بنجاح!                     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Next steps
echo -e "${CYAN}📋 Next steps:${NC}"
echo -e "  1. Clean reinstall Node modules:"
echo -e "     ${YELLOW}rm -rf node_modules package-lock.json${NC}"
echo -e "     ${YELLOW}npm install${NC}"
echo ""
echo -e "  2. Or run the interactive setup:"
echo -e "     ${YELLOW}./start-agent.sh${NC}"
echo ""

# Offer to reinstall node_modules
read -p "$(echo -e ${CYAN}Do you want to reinstall node_modules now? [y/N]:${NC} )" -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏳ Cleaning old node_modules...${NC}"
    rm -rf node_modules package-lock.json

    echo -e "${YELLOW}⏳ Installing Node.js dependencies...${NC}"
    npm install

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Node.js dependencies installed successfully!${NC}"
        echo -e "${GREEN}🎉 Setup complete! You can now run the agent.${NC}"
    else
        echo -e "${RED}✗ npm install failed. Check the error above.${NC}"
        echo -e "${YELLOW}Try running: npm install --verbose${NC}"
    fi
else
    echo -e "${CYAN}Skipped. Run 'npm install' manually when ready.${NC}"
fi
echo ""
