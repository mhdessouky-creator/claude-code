#!/data/data/com.termux/files/usr/bin/sh
# =================================================================
# 🚨 Termux Emergency Fix - إصلاح طوارئ Termux
# =================================================================
# لا يحتاج chmod - شغله مباشرة بـ: sh fix-termux-now.sh
# =================================================================

echo "╔════════════════════════════════════════════════════════════╗"
echo "║        🚨 Termux Emergency Fix - إصلاح طوارئ              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# التحقق من apt
echo "▶ Step 1: Checking apt..."
if command -v apt > /dev/null 2>&1; then
    echo "✓ apt found"

    echo ""
    echo "▶ Step 2: Updating package lists..."
    apt update

    echo ""
    echo "▶ Step 3: Installing termux-tools..."
    apt install -y termux-tools

    echo ""
    echo "▶ Step 4: Installing coreutils..."
    apt install -y coreutils

    echo ""
    echo "▶ Step 5: Testing pkg..."
    if command -v pkg > /dev/null 2>&1; then
        echo "✓ pkg is now available!"

        echo ""
        echo "▶ Step 6: Updating with pkg..."
        pkg update

        echo ""
        echo "▶ Step 7: Installing essential tools..."
        pkg install -y nodejs git python

        echo ""
        echo "╔════════════════════════════════════════════════════════════╗"
        echo "║              ✓ Termux Fixed Successfully!                  ║"
        echo "╚════════════════════════════════════════════════════════════╝"
        echo ""
        echo "Next steps:"
        echo "  1. cd ~"
        echo "  2. git clone https://github.com/mhdessouky-creator/claude-code.git"
        echo "  3. cd claude-code"
        echo "  4. sh termux-recovery.sh"
        echo ""
    else
        echo "✗ pkg still not working"
        echo ""
        echo "Please try:"
        echo "  1. termux-change-repo"
        echo "  2. apt update && apt install termux-tools"
        echo "  3. Or reinstall Termux from Settings"
    fi
else
    echo "✗ apt not found!"
    echo ""
    echo "Your Termux installation is severely broken."
    echo "Please reinstall Termux:"
    echo "  1. Settings → Apps → Termux → Clear Data"
    echo "  2. Or uninstall and reinstall Termux"
    echo "  3. Then run this script again"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "For more help, see: TERMUX_FIX_EMERGENCY.md"
echo "═══════════════════════════════════════════════════════════"
