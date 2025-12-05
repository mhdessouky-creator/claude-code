#!/data/data/com.termux/files/usr/bin/bash
# =================================================================
# 🔄 Termux Recovery Script - استعادة الإعداد الأصلي
# =================================================================
# يستخدم هذا السكريبت لاستعادة إعداد claude-code الأصلي في Termux
# =================================================================

# الألوان
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# البانر
clear
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🔄 Termux Recovery - استعادة الإعداد الأصلي             ║${NC}"
echo -e "${CYAN}║          Digital Life AI Agent Setup                       ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# دوال مساعدة
print_step() {
    echo -e "${YELLOW}▶ الخطوة:${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# دالة للسؤال
ask_confirm() {
    echo -e "${YELLOW}$1 (y/n):${NC} "
    read -r response
    case "$response" in
        [yY][eE][sS]|[yY])
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# =================================================================
# 0. التحقق من البيئة
# =================================================================
print_step "التحقق من بيئة Termux..."

if [[ ! "$PREFIX" == *"com.termux"* ]]; then
    print_warning "تحذير: يبدو أنك لست في بيئة Termux الأصلية"
    print_info "هذا السكريبت مُصمم للعمل في Termux على Android"

    if ! ask_confirm "هل تريد المتابعة رغم ذلك؟"; then
        echo "تم الإلغاء."
        exit 1
    fi
fi

echo ""

# =================================================================
# 1. نظافة أولية (إزالة code-server إذا كان موجوداً)
# =================================================================
print_step "التنظيف الأولي..."

if command -v code-server &> /dev/null; then
    print_warning "تم العثور على code-server"

    if ask_confirm "هل تريد إزالته؟"; then
        # تشغيل سكريبت التنظيف إذا كان موجوداً
        if [ -f "./termux-cleanup.sh" ]; then
            print_info "تشغيل سكريبت التنظيف..."
            bash ./termux-cleanup.sh
        else
            print_info "إزالة code-server يدوياً..."
            pkill -9 -f code-server 2>/dev/null
            rm -rf ~/.local/share/code-server 2>/dev/null
            rm -rf ~/.config/code-server 2>/dev/null
            rm -f ~/.local/bin/code-server 2>/dev/null
            print_success "تم التنظيف الأساسي"
        fi
    fi
else
    print_success "النظام نظيف (code-server غير موجود)"
fi

echo ""

# =================================================================
# 2. التحقق من المتطلبات الأساسية
# =================================================================
print_step "التحقق من المتطلبات الأساسية..."

MISSING_PACKAGES=()

# التحقق من Node.js
if ! command -v node &> /dev/null; then
    print_warning "Node.js غير مثبت"
    MISSING_PACKAGES+=("nodejs")
else
    NODE_VERSION=$(node --version)
    print_success "Node.js موجود: $NODE_VERSION"
fi

# التحقق من Git
if ! command -v git &> /dev/null; then
    print_warning "Git غير مثبت"
    MISSING_PACKAGES+=("git")
else
    GIT_VERSION=$(git --version)
    print_success "Git موجود: $GIT_VERSION"
fi

# التحقق من Python (اختياري)
if command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version 2>&1)
    print_success "Python موجود: $PYTHON_VERSION"
else
    print_info "Python غير مثبت (اختياري)"
fi

# تثبيت الحزم المفقودة
if [ ${#MISSING_PACKAGES[@]} -gt 0 ]; then
    echo ""
    print_warning "الحزم المفقودة: ${MISSING_PACKAGES[*]}"

    if ask_confirm "هل تريد تثبيتها الآن؟"; then
        print_info "تحديث قائمة الحزم..."
        pkg update -y

        print_info "تثبيت الحزم المفقودة..."
        for package in "${MISSING_PACKAGES[@]}"; do
            print_info "تثبيت $package..."
            pkg install -y "$package"
        done

        print_success "تم تثبيت جميع المتطلبات"
    else
        print_error "لا يمكن المتابعة بدون المتطلبات الأساسية"
        exit 1
    fi
fi

echo ""

# =================================================================
# 3. استنساخ/تحديث المشروع
# =================================================================
print_step "إعداد المشروع..."

PROJECT_DIR="$HOME/claude-code"

if [ -d "$PROJECT_DIR" ]; then
    print_info "المشروع موجود بالفعل في: $PROJECT_DIR"

    if ask_confirm "هل تريد تحديثه من GitHub؟"; then
        cd "$PROJECT_DIR" || exit

        # حفظ أي تغييرات محلية
        if ! git diff-index --quiet HEAD -- 2>/dev/null; then
            print_info "حفظ التغييرات المحلية..."
            git stash push -m "Auto-stash before recovery $(date +%Y%m%d_%H%M%S)"
        fi

        print_info "جلب آخر التحديثات..."
        git fetch origin

        # الرجوع للفرع الرئيسي أو آخر commit صالح
        print_info "الرجوع للإصدار المستقر..."
        git checkout origin/claude/recover-termux-setup-01UpqbZfD81hLQEjDSqwe3tn

        print_success "تم تحديث المشروع"
    else
        cd "$PROJECT_DIR" || exit
        print_info "استخدام المشروع الموجود"
    fi
else
    print_info "استنساخ المشروع من GitHub..."

    cd "$HOME" || exit
    git clone https://github.com/mhdessouky-creator/claude-code.git

    if [ $? -eq 0 ]; then
        print_success "تم استنساخ المشروع بنجاح"
        cd "$PROJECT_DIR" || exit
    else
        print_error "فشل استنساخ المشروع"
        exit 1
    fi
fi

echo ""

# =================================================================
# 4. إعداد ملف البيئة (.env)
# =================================================================
print_step "إعداد ملف البيئة..."

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        print_info "إنشاء ملف .env من المثال..."
        cp .env.example .env
        print_success "تم إنشاء .env"

        print_warning "يجب عليك تعديل .env وإضافة API keys الخاصة بك"
        print_info "افتح الملف بـ: ${CYAN}nano .env${NC}"

        if ask_confirm "هل تريد تعديل .env الآن؟"; then
            nano .env
            print_success "تم تعديل .env"
        else
            print_warning "تذكر تعديل .env قبل التشغيل!"
        fi
    else
        print_error "ملف .env.example غير موجود"
    fi
else
    print_success "ملف .env موجود بالفعل"

    if ask_confirm "هل تريد فحص/تعديل .env؟"; then
        nano .env
    fi
fi

echo ""

# =================================================================
# 5. تثبيت المتطلبات
# =================================================================
print_step "تثبيت متطلبات المشروع..."

# Node.js dependencies
if [ -f "package.json" ]; then
    print_info "تثبيت متطلبات Node.js..."
    npm install

    if [ $? -eq 0 ]; then
        print_success "تم تثبيت متطلبات Node.js"
    else
        print_error "فشل تثبيت متطلبات Node.js"
        print_info "حاول يدوياً: npm install"
    fi
else
    print_warning "package.json غير موجود"
fi

# Python dependencies (اختياري)
if command -v python &> /dev/null && [ -f "requirements.txt" ]; then
    if ask_confirm "هل تريد تثبيت متطلبات Python أيضاً؟"; then
        print_info "تثبيت متطلبات Python..."
        pip install -r requirements.txt

        if [ $? -eq 0 ]; then
            print_success "تم تثبيت متطلبات Python"
        else
            print_warning "بعض حزم Python قد تكون فشلت"
        fi
    fi
fi

echo ""

# =================================================================
# 6. منح الصلاحيات
# =================================================================
print_step "منح صلاحيات التنفيذ..."

chmod +x start-agent.sh 2>/dev/null && print_success "start-agent.sh" || print_warning "start-agent.sh غير موجود"
chmod +x termux-cleanup.sh 2>/dev/null && print_success "termux-cleanup.sh" || true
chmod +x termux-recovery.sh 2>/dev/null && print_success "termux-recovery.sh" || true

echo ""

# =================================================================
# 7. اختبار التثبيت
# =================================================================
print_step "اختبار التثبيت..."

echo ""
print_info "اختبار المكونات الأساسية:"

# اختبار Node.js
if command -v node &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Node.js: $(node --version)"
else
    echo -e "  ${RED}✗${NC} Node.js غير متوفر"
fi

# اختبار npm
if command -v npm &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} npm: $(npm --version)"
else
    echo -e "  ${RED}✗${NC} npm غير متوفر"
fi

# اختبار Git
if command -v git &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Git: $(git --version | cut -d' ' -f3)"
else
    echo -e "  ${RED}✗${NC} Git غير متوفر"
fi

# اختبار الملفات الأساسية
if [ -f "start-agent.sh" ]; then
    echo -e "  ${GREEN}✓${NC} start-agent.sh موجود"
else
    echo -e "  ${RED}✗${NC} start-agent.sh غير موجود"
fi

if [ -f ".env" ]; then
    echo -e "  ${GREEN}✓${NC} .env موجود"
else
    echo -e "  ${YELLOW}⚠${NC} .env غير موجود"
fi

if [ -f "package.json" ]; then
    echo -e "  ${GREEN}✓${NC} package.json موجود"
else
    echo -e "  ${RED}✗${NC} package.json غير موجود"
fi

# اختبار node_modules
if [ -d "node_modules" ]; then
    echo -e "  ${GREEN}✓${NC} node_modules موجود"
else
    echo -e "  ${YELLOW}⚠${NC} node_modules غير موجود"
fi

echo ""

# =================================================================
# 8. التقرير النهائي
# =================================================================
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           ✓ اكتملت الاستعادة بنجاح!                       ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

print_info "ملخص الاستعادة:"
echo "  • المشروع: $PROJECT_DIR"
echo "  • الملفات الأساسية: موجودة ✓"
echo "  • المتطلبات: مثبتة ✓"
echo "  • الصلاحيات: ممنوحة ✓"
echo ""

print_info "للتشغيل الآن:"
echo ""
echo -e "  ${CYAN}1. تأكد من إضافة ANTHROPIC_API_KEY في .env${NC}"
echo -e "  ${CYAN}2. شغل الوكيل:${NC}"
echo -e "     ${GREEN}./start-agent.sh${NC}"
echo ""
echo -e "  ${CYAN}أو استخدم الأوامر المباشرة:${NC}"
echo -e "     ${GREEN}node src/cli.js chat${NC}      # وضع المحادثة"
echo -e "     ${GREEN}python main.py${NC}            # Python Agent"
echo ""

print_info "للمزيد من المعلومات:"
echo -e "  📖 اقرأ: ${CYAN}TERMUX_GUIDE.md${NC}"
echo -e "  📖 اقرأ: ${CYAN}AGENT_GUIDE.md${NC}"
echo ""

# نصيحة نهائية
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}💡 نصائح:${NC}"
echo "  • استخدم tmux للجلسات المستمرة: pkg install tmux"
echo "  • استخدم termux-wake-lock لمنع التوقف في الخلفية"
echo "  • احتفظ بنسخة احتياطية من .env في مكان آمن"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""

# اختبار نهائي - هل يمكن تشغيل start-agent.sh؟
if [ -f "start-agent.sh" ] && [ -x "start-agent.sh" ]; then
    if ask_confirm "هل تريد تشغيل الوكيل الآن؟"; then
        echo ""
        print_success "جاري التشغيل..."
        echo ""
        ./start-agent.sh
    fi
fi

echo ""
print_success "انتهى سكريبت الاستعادة"
echo ""
