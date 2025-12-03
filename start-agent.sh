#!/data/data/com.termux/files/usr/bin/bash
# =================================================================
# 🤖 Digital Life AI Agent - Termux Startup Script
# =================================================================
# هذا السكريبت يشغل الوكيل الذكي في بيئة Termux
# This script starts the AI Agent in Termux environment
# =================================================================

# الألوان للطباعة الملونة
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# البانر الترحيبي
print_banner() {
    clear
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${MAGENTA}         🤖 Digital Life AI Agent - Termux${CYAN}            ║${NC}"
    echo -e "${CYAN}║          وكيل ذكاء اصطناعي لأتمتة حياتك الرقمية          ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# التحقق من البيئة
check_environment() {
    echo -e "${YELLOW}⏳ جاري التحقق من البيئة...${NC}"

    # التحقق من وجود Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo -e "${GREEN}✓ Node.js موجود: ${NODE_VERSION}${NC}"
        HAS_NODE=true
    else
        echo -e "${RED}✗ Node.js غير مثبت${NC}"
        HAS_NODE=false
    fi

    # التحقق من وجود Python
    if command -v python &> /dev/null; then
        PYTHON_VERSION=$(python --version 2>&1)
        echo -e "${GREEN}✓ Python موجود: ${PYTHON_VERSION}${NC}"
        HAS_PYTHON=true
    else
        echo -e "${RED}✗ Python غير مثبت${NC}"
        HAS_PYTHON=false
    fi

    # التحقق من وجود Git
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version)
        echo -e "${GREEN}✓ Git موجود: ${GIT_VERSION}${NC}"
    else
        echo -e "${YELLOW}⚠ Git غير مثبت (اختياري)${NC}"
    fi

    echo ""
}

# تثبيت المتطلبات
install_dependencies() {
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}هل تريد تثبيت/تحديث المتطلبات؟${NC}"
    echo -e "  1. تثبيت متطلبات Node.js"
    echo -e "  2. تثبيت متطلبات Python"
    echo -e "  3. تثبيت كل المتطلبات"
    echo -e "  4. تخطي"
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"

    read -p "اختر خياراً (1-4): " choice

    case $choice in
        1)
            if [ "$HAS_NODE" = true ]; then
                # تثبيت setuptools أولاً لدعم node-gyp
                if [ "$HAS_PYTHON" = true ]; then
                    echo -e "${YELLOW}⏳ جاري تثبيت setuptools (مطلوب لـ node-gyp)...${NC}"
                    pip install setuptools --upgrade 2>/dev/null || true
                fi
                echo -e "${YELLOW}⏳ جاري تثبيت متطلبات Node.js...${NC}"
                npm install
                echo -e "${GREEN}✓ تم تثبيت متطلبات Node.js${NC}"
            else
                echo -e "${RED}✗ Node.js غير مثبت. قم بتثبيته أولاً باستخدام: pkg install nodejs${NC}"
            fi
            ;;
        2)
            if [ "$HAS_PYTHON" = true ]; then
                echo -e "${YELLOW}⏳ جاري تثبيت متطلبات Python...${NC}"
                pip install --upgrade pip setuptools 2>/dev/null || true
                pip install -r requirements.txt
                echo -e "${GREEN}✓ تم تثبيت متطلبات Python${NC}"
            else
                echo -e "${RED}✗ Python غير مثبت. قم بتثبيته أولاً باستخدام: pkg install python${NC}"
            fi
            ;;
        3)
            if [ "$HAS_PYTHON" = true ]; then
                echo -e "${YELLOW}⏳ جاري تثبيت متطلبات Python وsetuptools...${NC}"
                pip install --upgrade pip setuptools 2>/dev/null || true
                pip install -r requirements.txt
                echo -e "${GREEN}✓ تم تثبيت متطلبات Python${NC}"
            fi
            if [ "$HAS_NODE" = true ]; then
                echo -e "${YELLOW}⏳ جاري تثبيت متطلبات Node.js...${NC}"
                npm install
                echo -e "${GREEN}✓ تم تثبيت متطلبات Node.js${NC}"
            fi
            ;;
        4)
            echo -e "${CYAN}تم التخطي${NC}"
            ;;
        *)
            echo -e "${RED}خيار غير صحيح${NC}"
            ;;
    esac
    echo ""
}

# إعداد ملف البيئة
setup_env() {
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠ ملف .env غير موجود${NC}"
        echo -e "${CYAN}هل تريد إنشاء ملف .env من المثال؟ (y/n)${NC}"
        read -p "> " create_env

        if [ "$create_env" = "y" ] || [ "$create_env" = "Y" ]; then
            if [ -f ".env.example" ]; then
                cp .env.example .env
                echo -e "${GREEN}✓ تم إنشاء ملف .env${NC}"
                echo -e "${YELLOW}⚠ يرجى تعديل .env وإضافة API keys الخاصة بك${NC}"
                echo -e "${CYAN}استخدم الأمر: nano .env${NC}"
                echo ""
                read -p "اضغط Enter للمتابعة بعد تعديل .env..."
            else
                echo -e "${RED}✗ ملف .env.example غير موجود${NC}"
            fi
        fi
    else
        echo -e "${GREEN}✓ ملف .env موجود${NC}"
    fi
    echo ""
}

# اختيار الوكيل للتشغيل
choose_agent() {
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}اختر الوكيل للتشغيل:${NC}"
    echo -e "  ${GREEN}1${NC}. Node.js Agent (وكيل JavaScript)"
    echo -e "  ${GREEN}2${NC}. Python Agent (وكيل Python)"
    echo -e "  ${GREEN}3${NC}. عرض الإعدادات فقط"
    echo -e "  ${GREEN}4${NC}. خروج"
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"

    read -p "اختر خياراً (1-4): " agent_choice

    case $agent_choice in
        1)
            if [ "$HAS_NODE" = true ]; then
                run_nodejs_agent
            else
                echo -e "${RED}✗ Node.js غير مثبت. قم بتثبيته باستخدام: pkg install nodejs${NC}"
            fi
            ;;
        2)
            if [ "$HAS_PYTHON" = true ]; then
                run_python_agent
            else
                echo -e "${RED}✗ Python غير مثبت. قم بتثبيته باستخدام: pkg install python${NC}"
            fi
            ;;
        3)
            show_settings
            ;;
        4)
            echo -e "${GREEN}وداعاً! 👋${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}خيار غير صحيح${NC}"
            choose_agent
            ;;
    esac
}

# تشغيل وكيل Node.js
run_nodejs_agent() {
    echo -e "${MAGENTA}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║           🚀 تشغيل Node.js Agent${NC}                     ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}اختر الوضع:${NC}"
    echo -e "  1. وضع المحادثة التفاعلي (Chat Mode)"
    echo -e "  2. تنفيذ مهمة واحدة (Task Mode)"
    echo -e "  3. عرض الحالة (Status)"
    echo -e "  4. عودة"

    read -p "اختر خياراً (1-4): " mode_choice

    case $mode_choice in
        1)
            echo -e "${GREEN}⏳ جاري تشغيل وضع المحادثة...${NC}"
            echo ""
            node src/cli.js chat
            ;;
        2)
            echo -e "${CYAN}أدخل المهمة المطلوبة:${NC}"
            read -p "> " task
            echo -e "${GREEN}⏳ جاري تنفيذ المهمة...${NC}"
            echo ""
            node src/cli.js task "$task"
            ;;
        3)
            node src/cli.js status
            ;;
        4)
            choose_agent
            ;;
        *)
            echo -e "${RED}خيار غير صحيح${NC}"
            run_nodejs_agent
            ;;
    esac
}

# تشغيل وكيل Python
run_python_agent() {
    echo -e "${MAGENTA}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║           🐍 تشغيل Python Agent${NC}                      ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}⏳ جاري تشغيل الوكيل...${NC}"
    echo ""
    python main.py
}

# عرض الإعدادات
show_settings() {
    echo -e "${MAGENTA}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║              ⚙️  الإعدادات الحالية${NC}                   ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}📁 مسار المشروع:${NC} $(pwd)"
    echo -e "${CYAN}🖥️  البيئة:${NC} Termux (Android)"
    echo ""

    if [ -f ".env" ]; then
        echo -e "${GREEN}✓ ملف .env موجود${NC}"
        echo -e "${CYAN}📝 محتوى .env (الأسطر الأولى):${NC}"
        head -n 5 .env | grep -v "API_KEY" || echo "(فارغ أو يحتوي فقط على API keys)"
    else
        echo -e "${RED}✗ ملف .env غير موجود${NC}"
    fi
    echo ""

    if [ -f "package.json" ]; then
        echo -e "${GREEN}✓ package.json موجود (Node.js project)${NC}"
    fi

    if [ -f "requirements.txt" ]; then
        echo -e "${GREEN}✓ requirements.txt موجود (Python project)${NC}"
    fi
    echo ""

    read -p "اضغط Enter للعودة..." dummy
    choose_agent
}

# معلومات المساعدة
show_help() {
    echo -e "${CYAN}📚 معلومات الاستخدام:${NC}"
    echo ""
    echo -e "${GREEN}الأوامر المباشرة:${NC}"
    echo -e "  ./start-agent.sh          - تشغيل السكريبت التفاعلي"
    echo -e "  node src/cli.js chat      - تشغيل Node.js Agent مباشرة"
    echo -e "  python main.py            - تشغيل Python Agent مباشرة"
    echo ""
    echo -e "${GREEN}التثبيت في Termux:${NC}"
    echo -e "  pkg install nodejs git    - تثبيت Node.js و Git"
    echo -e "  pkg install python        - تثبيت Python"
    echo -e "  npm install               - تثبيت متطلبات Node.js"
    echo -e "  pip install -r requirements.txt  - تثبيت متطلبات Python"
    echo ""
    echo -e "${GREEN}الإعداد:${NC}"
    echo -e "  cp .env.example .env      - نسخ ملف البيئة"
    echo -e "  nano .env                 - تعديل الإعدادات"
    echo ""
    echo -e "${YELLOW}⚠️  ملاحظات مهمة:${NC}"
    echo -e "  • تأكد من إضافة ANTHROPIC_API_KEY في .env"
    echo -e "  • للحصول على API key: https://console.anthropic.com"
    echo -e "  • للدعم: https://github.com/mhdessouky-creator/claude-code"
    echo ""
}

# =================================================================
# البرنامج الرئيسي
# =================================================================

main() {
    # التأكد من أننا في المجلد الصحيح
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "$SCRIPT_DIR"

    # طباعة البانر
    print_banner

    # عرض المساعدة السريعة
    echo -e "${CYAN}💡 نصيحة: استخدم Ctrl+C للخروج في أي وقت${NC}"
    echo ""

    # التحقق من البيئة
    check_environment

    # إعداد البيئة
    setup_env

    # تثبيت المتطلبات (اختياري)
    install_dependencies

    # اختيار الوكيل
    choose_agent
}

# تشغيل البرنامج الرئيسي
main
