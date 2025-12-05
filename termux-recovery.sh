#!/data/data/com.termux/files/usr/bin/bash
# =================================================================
# 🔧 Termux Recovery & Troubleshooting Script
# =================================================================
# Automatically detects and fixes common Termux issues
# نظام استرداد وإصلاح مشاكل Termux الشائعة
# =================================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Recovery mode flag
RECOVERY_MODE=false
ISSUES_FOUND=0
ISSUES_FIXED=0

# =================================================================
# Banner
# =================================================================
print_banner() {
    clear
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${MAGENTA}        🔧 Termux Recovery & Diagnostic Tool${CYAN}            ║${NC}"
    echo -e "${CYAN}║          أداة الاسترداد والتشخيص لـ Termux               ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# =================================================================
# Logging Functions
# =================================================================
log_info() {
    echo -e "${CYAN}[ℹ]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_step() {
    echo -e "${MAGENTA}[→]${NC} $1"
}

# =================================================================
# Issue Detection Functions
# =================================================================

check_package_manager() {
    log_step "Checking package manager..."

    if command -v pkg &> /dev/null; then
        log_success "Package manager (pkg) is working"
        return 0
    else
        log_error "Package manager (pkg) not found"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
        return 1
    fi
}

check_internet() {
    log_step "Checking internet connectivity..."

    if ping -c 1 -W 2 8.8.8.8 &> /dev/null; then
        log_success "Internet connection is active"
        return 0
    else
        log_warning "No internet connection detected"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
        return 1
    fi
}

check_storage_permission() {
    log_step "Checking storage permissions..."

    if [ -d ~/storage ]; then
        log_success "Storage access is configured"
        return 0
    else
        log_warning "Storage access not configured"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
        return 1
    fi
}

check_required_packages() {
    log_step "Checking required packages..."

    local missing_packages=()
    local packages=("git" "nodejs" "python")

    for pkg in "${packages[@]}"; do
        if ! command -v "$pkg" &> /dev/null; then
            log_warning "$pkg is not installed"
            missing_packages+=("$pkg")
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        else
            local version=$($pkg --version 2>&1 | head -n1)
            log_success "$pkg is installed: $version"
        fi
    done

    if [ ${#missing_packages[@]} -eq 0 ]; then
        return 0
    else
        echo -e "${YELLOW}Missing packages: ${missing_packages[*]}${NC}"
        return 1
    fi
}

check_project_files() {
    log_step "Checking project files..."

    local critical_files=("package.json" "main.py" "start-agent.sh")
    local missing_files=()

    for file in "${critical_files[@]}"; do
        if [ ! -f "$file" ]; then
            log_warning "$file not found"
            missing_files+=("$file")
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi
    done

    if [ ${#missing_files[@]} -eq 0 ]; then
        log_success "All critical project files present"
        return 0
    else
        log_error "Missing files: ${missing_files[*]}"
        return 1
    fi
}

check_env_file() {
    log_step "Checking environment configuration..."

    if [ -f ".env" ]; then
        if grep -q "ANTHROPIC_API_KEY=sk-ant-" .env 2>/dev/null; then
            log_success ".env file exists and appears configured"
            return 0
        else
            log_warning ".env exists but may not be properly configured"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
            return 1
        fi
    else
        log_warning ".env file not found"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
        return 1
    fi
}

check_node_modules() {
    log_step "Checking Node.js dependencies..."

    if [ -d "node_modules" ] && [ -f "package.json" ]; then
        log_success "Node modules are installed"
        return 0
    elif [ -f "package.json" ]; then
        log_warning "Node modules need to be installed"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
        return 1
    else
        log_info "No package.json found, skipping Node modules check"
        return 0
    fi
}

check_python_venv() {
    log_step "Checking Python environment..."

    if [ -f "requirements.txt" ]; then
        if command -v pip &> /dev/null; then
            log_success "Python package manager available"
            return 0
        else
            log_warning "pip not found"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
            return 1
        fi
    else
        log_info "No requirements.txt found, skipping Python check"
        return 0
    fi
}

check_disk_space() {
    log_step "Checking available disk space..."

    local available=$(df -h . | awk 'NR==2 {print $4}')
    local used_percent=$(df -h . | awk 'NR==2 {print $5}' | tr -d '%')

    if [ "$used_percent" -lt 90 ]; then
        log_success "Disk space available: $available"
        return 0
    else
        log_warning "Low disk space: only $available remaining"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
        return 1
    fi
}

# =================================================================
# Auto-Fix Functions
# =================================================================

fix_package_sources() {
    log_step "Attempting to fix package sources..."

    echo -e "${CYAN}This will update package repositories.${NC}"
    read -p "Proceed? (y/n): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        pkg update -y && pkg upgrade -y
        log_success "Package sources updated"
        ISSUES_FIXED=$((ISSUES_FIXED + 1))
        return 0
    else
        log_info "Skipped"
        return 1
    fi
}

fix_storage_permission() {
    log_step "Setting up storage access..."

    termux-setup-storage
    sleep 2

    if [ -d ~/storage ]; then
        log_success "Storage access configured"
        ISSUES_FIXED=$((ISSUES_FIXED + 1))
        return 0
    else
        log_error "Failed to setup storage access"
        return 1
    fi
}

fix_missing_packages() {
    log_step "Installing missing packages..."

    local packages=()

    if ! command -v git &> /dev/null; then
        packages+=("git")
    fi

    if ! command -v node &> /dev/null; then
        packages+=("nodejs")
    fi

    if ! command -v python &> /dev/null; then
        packages+=("python")
    fi

    if [ ${#packages[@]} -gt 0 ]; then
        echo -e "${CYAN}Will install: ${packages[*]}${NC}"
        read -p "Proceed? (y/n): " -n 1 -r
        echo

        if [[ $REPLY =~ ^[Yy]$ ]]; then
            pkg install -y "${packages[@]}"
            log_success "Packages installed"
            ISSUES_FIXED=$((ISSUES_FIXED + 1))
            return 0
        else
            log_info "Skipped"
            return 1
        fi
    else
        log_info "No packages to install"
        return 0
    fi
}

fix_env_file() {
    log_step "Setting up .env file..."

    if [ -f ".env.example" ]; then
        cp .env.example .env
        log_success ".env file created from template"
        log_warning "Remember to add your ANTHROPIC_API_KEY to .env"
        echo -e "${YELLOW}Edit with: nano .env${NC}"
        ISSUES_FIXED=$((ISSUES_FIXED + 1))
        return 0
    else
        log_error ".env.example not found"
        return 1
    fi
}

fix_node_modules() {
    log_step "Installing Node.js dependencies..."

    if [ -f "package.json" ] && command -v npm &> /dev/null; then
        read -p "Run npm install? (y/n): " -n 1 -r
        echo

        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm install
            log_success "Node modules installed"
            ISSUES_FIXED=$((ISSUES_FIXED + 1))
            return 0
        else
            log_info "Skipped"
            return 1
        fi
    else
        log_error "Cannot install - missing package.json or npm"
        return 1
    fi
}

fix_python_requirements() {
    log_step "Installing Python dependencies..."

    if [ -f "requirements.txt" ] && command -v pip &> /dev/null; then
        read -p "Run pip install? (y/n): " -n 1 -r
        echo

        if [[ $REPLY =~ ^[Yy]$ ]]; then
            pip install -r requirements.txt
            log_success "Python packages installed"
            ISSUES_FIXED=$((ISSUES_FIXED + 1))
            return 0
        else
            log_info "Skipped"
            return 1
        fi
    else
        log_error "Cannot install - missing requirements.txt or pip"
        return 1
    fi
}

fix_permissions() {
    log_step "Fixing file permissions..."

    if [ -f "start-agent.sh" ]; then
        chmod +x start-agent.sh
        log_success "start-agent.sh is now executable"
    fi

    if [ -f "termux-recovery.sh" ]; then
        chmod +x termux-recovery.sh
        log_success "termux-recovery.sh is now executable"
    fi

    ISSUES_FIXED=$((ISSUES_FIXED + 1))
    return 0
}

# =================================================================
# Main Diagnostic Sequence
# =================================================================

run_diagnostics() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}Running system diagnostics...${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""

    # Reset counters
    ISSUES_FOUND=0

    # Run all checks
    check_package_manager
    check_internet
    check_storage_permission
    check_required_packages
    check_disk_space

    # Only check project files if we're in a project directory
    if [ -f "package.json" ] || [ -f "main.py" ]; then
        echo ""
        echo -e "${BLUE}Project-specific checks:${NC}"
        check_project_files
        check_env_file
        check_node_modules
        check_python_venv
    fi

    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

    if [ $ISSUES_FOUND -eq 0 ]; then
        log_success "No issues detected! System is healthy."
    else
        log_warning "Found $ISSUES_FOUND issue(s)"
    fi

    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

# =================================================================
# Auto-Recovery Sequence
# =================================================================

run_recovery() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}Starting auto-recovery process...${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""

    ISSUES_FIXED=0

    # Fix common issues
    if ! command -v pkg &> /dev/null; then
        fix_package_sources
    fi

    if [ ! -d ~/storage ]; then
        fix_storage_permission
    fi

    fix_missing_packages

    # Project-specific fixes
    if [ -f "package.json" ] || [ -f "main.py" ]; then
        if [ ! -f ".env" ]; then
            fix_env_file
        fi

        if [ -f "package.json" ] && [ ! -d "node_modules" ]; then
            fix_node_modules
        fi

        if [ -f "requirements.txt" ]; then
            fix_python_requirements
        fi

        fix_permissions
    fi

    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    log_success "Recovery complete! Fixed $ISSUES_FIXED issue(s)."
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

# =================================================================
# Interactive Menu
# =================================================================

show_menu() {
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}What would you like to do?${NC}"
    echo -e "${CYAN}ماذا تريد أن تفعل؟${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  ${GREEN}1${NC}. Run Diagnostics (تشخيص المشاكل)"
    echo -e "  ${GREEN}2${NC}. Auto-Recovery (إصلاح تلقائي)"
    echo -e "  ${GREEN}3${NC}. Check System Info (معلومات النظام)"
    echo -e "  ${GREEN}4${NC}. Clean Cache (تنظيف الذاكرة)"
    echo -e "  ${GREEN}5${NC}. Reset Project (إعادة تعيين المشروع)"
    echo -e "  ${GREEN}6${NC}. Run start-agent.sh (تشغيل الوكيل)"
    echo -e "  ${GREEN}7${NC}. Help (مساعدة)"
    echo -e "  ${GREEN}8${NC}. Exit (خروج)"
    echo ""
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
}

show_system_info() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}System Information:${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""

    echo -e "${CYAN}📱 Device:${NC}"
    uname -a
    echo ""

    echo -e "${CYAN}📊 Storage:${NC}"
    df -h ~
    echo ""

    echo -e "${CYAN}📦 Installed Tools:${NC}"
    for cmd in bash pkg git node npm python pip; do
        if command -v $cmd &> /dev/null; then
            version=$($cmd --version 2>&1 | head -n1)
            echo -e "  ${GREEN}✓${NC} $cmd: $version"
        else
            echo -e "  ${RED}✗${NC} $cmd: not installed"
        fi
    done
    echo ""

    echo -e "${CYAN}📁 Current Directory:${NC}"
    pwd
    echo ""

    echo -e "${CYAN}📄 Project Files:${NC}"
    ls -lh | head -n 10
    echo ""

    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
}

clean_cache() {
    log_step "Cleaning caches..."

    echo -e "${YELLOW}This will clean:${NC}"
    echo "  - APT cache"
    echo "  - NPM cache (if exists)"
    echo "  - Python cache (if exists)"
    echo ""

    read -p "Proceed? (y/n): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Clean package cache
        pkg clean

        # Clean npm cache
        if command -v npm &> /dev/null; then
            npm cache clean --force
        fi

        # Clean Python cache
        find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
        find . -type f -name "*.pyc" -delete 2>/dev/null

        log_success "Cache cleaned"
    else
        log_info "Cancelled"
    fi
}

reset_project() {
    log_warning "This will reset the project to initial state!"
    echo -e "${YELLOW}This will:${NC}"
    echo "  - Remove node_modules"
    echo "  - Remove .env (backup to .env.backup)"
    echo "  - Clean caches"
    echo ""

    read -p "Are you sure? (y/n): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Backup .env
        if [ -f ".env" ]; then
            cp .env .env.backup
            log_success "Backed up .env to .env.backup"
        fi

        # Remove node_modules
        if [ -d "node_modules" ]; then
            rm -rf node_modules
            log_success "Removed node_modules"
        fi

        # Remove .env
        if [ -f ".env" ]; then
            rm .env
            log_success "Removed .env"
        fi

        clean_cache

        log_success "Project reset complete"
        log_info "Run recovery to reinstall dependencies"
    else
        log_info "Cancelled"
    fi
}

show_help() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}🆘 Help / المساعدة${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""

    echo -e "${GREEN}Common Commands:${NC}"
    echo -e "  ${CYAN}./termux-recovery.sh${NC}     - Run this recovery tool"
    echo -e "  ${CYAN}./start-agent.sh${NC}         - Start the AI agent"
    echo -e "  ${CYAN}nano .env${NC}                - Edit environment file"
    echo -e "  ${CYAN}pkg update${NC}               - Update packages"
    echo ""

    echo -e "${GREEN}Troubleshooting:${NC}"
    echo -e "  ${YELLOW}Permission denied?${NC}"
    echo -e "    → Run: ${CYAN}chmod +x termux-recovery.sh${NC}"
    echo ""
    echo -e "  ${YELLOW}No command found?${NC}"
    echo -e "    → Install: ${CYAN}pkg install <package-name>${NC}"
    echo ""
    echo -e "  ${YELLOW}API key missing?${NC}"
    echo -e "    → Edit: ${CYAN}nano .env${NC}"
    echo -e "    → Add: ${CYAN}ANTHROPIC_API_KEY=sk-ant-...${NC}"
    echo ""

    echo -e "${GREEN}Resources:${NC}"
    echo -e "  📖 TERMUX_GUIDE.md - Full Termux guide"
    echo -e "  📖 AGENT_GUIDE.md - Agent usage guide"
    echo -e "  🌐 https://github.com/mhdessouky-creator/claude-code"
    echo ""

    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
}

# =================================================================
# Main Program
# =================================================================

main() {
    # Make sure we're in the script directory
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "$SCRIPT_DIR"

    # Print banner
    print_banner

    # Quick tip
    echo -e "${CYAN}💡 Tip: Use Ctrl+C to exit at any time${NC}"
    echo -e "${CYAN}💡 نصيحة: استخدم Ctrl+C للخروج في أي وقت${NC}"
    echo ""

    # Check if argument provided
    if [ $# -eq 1 ]; then
        case "$1" in
            --diagnose|-d)
                run_diagnostics
                exit 0
                ;;
            --fix|-f)
                run_recovery
                exit 0
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            --info|-i)
                show_system_info
                exit 0
                ;;
            *)
                log_error "Unknown argument: $1"
                echo "Use --help for available options"
                exit 1
                ;;
        esac
    fi

    # Interactive mode
    while true; do
        show_menu
        read -p "Choose option (1-8): " choice
        echo ""

        case $choice in
            1)
                run_diagnostics
                echo ""
                read -p "Press Enter to continue..."
                print_banner
                ;;
            2)
                run_recovery
                echo ""
                read -p "Press Enter to continue..."
                print_banner
                ;;
            3)
                show_system_info
                echo ""
                read -p "Press Enter to continue..."
                print_banner
                ;;
            4)
                clean_cache
                echo ""
                read -p "Press Enter to continue..."
                print_banner
                ;;
            5)
                reset_project
                echo ""
                read -p "Press Enter to continue..."
                print_banner
                ;;
            6)
                if [ -f "start-agent.sh" ]; then
                    log_info "Launching start-agent.sh..."
                    chmod +x start-agent.sh
                    ./start-agent.sh
                else
                    log_error "start-agent.sh not found"
                fi
                ;;
            7)
                show_help
                echo ""
                read -p "Press Enter to continue..."
                print_banner
                ;;
            8)
                echo -e "${GREEN}👋 Goodbye! / وداعاً${NC}"
                exit 0
                ;;
            *)
                log_error "Invalid option"
                sleep 1
                print_banner
                ;;
        esac
    done
}

# Run main program
main "$@"
