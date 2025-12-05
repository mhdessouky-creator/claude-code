#!/data/data/com.termux/files/usr/bin/bash
# =================================================================
# 🧹 Termux Cleanup Script - تنظيف Termux من التثبيتات الخاطئة
# =================================================================
# يستخدم هذا السكريبت لإزالة code-server وأي تثبيتات غير مرغوب فيها
# =================================================================

# الألوان
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     🧹 Termux Cleanup - تنظيف وإزالة التثبيتات الخاطئة    ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# دالة للطباعة الملونة
print_step() {
    echo -e "${YELLOW}▶${NC} $1"
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

# =================================================================
# 1. إزالة code-server
# =================================================================
print_step "البحث عن code-server..."

if command -v code-server &> /dev/null; then
    print_info "تم العثور على code-server، جاري الإزالة..."

    # إيقاف code-server إذا كان يعمل
    pkill -f code-server 2>/dev/null
    print_success "تم إيقاف code-server"

    # إزالة الملف التنفيذي
    rm -f "$(which code-server)" 2>/dev/null
    rm -f ~/.local/bin/code-server 2>/dev/null
    rm -f ~/bin/code-server 2>/dev/null
    rm -f /data/data/com.termux/files/usr/bin/code-server 2>/dev/null
    print_success "تم حذف الملف التنفيذي"

    # إزالة مجلدات الإعداد
    rm -rf ~/.config/code-server 2>/dev/null
    rm -rf ~/.local/share/code-server 2>/dev/null
    rm -rf ~/.cache/code-server 2>/dev/null
    print_success "تم حذف مجلدات الإعداد"
else
    print_success "code-server غير موجود (جيد)"
fi

# =================================================================
# 2. تنظيف ملفات البيئة المؤقتة
# =================================================================
print_step "تنظيف ملفات البيئة المؤقتة..."

# حذف ملفات التنزيل المؤقتة
rm -f /tmp/code-server* 2>/dev/null
rm -f ~/install.sh 2>/dev/null
rm -f ~/.install.sh 2>/dev/null
print_success "تم تنظيف الملفات المؤقتة"

# =================================================================
# 3. تنظيف PATH من أي إضافات غير مرغوبة
# =================================================================
print_step "فحص ملفات البيئة..."

# فحص .bashrc
if [ -f ~/.bashrc ]; then
    if grep -q "code-server" ~/.bashrc; then
        print_info "تم العثور على إشارات لـ code-server في .bashrc"

        # إنشاء نسخة احتياطية
        cp ~/.bashrc ~/.bashrc.backup.$(date +%Y%m%d_%H%M%S)
        print_success "تم إنشاء نسخة احتياطية من .bashrc"

        # إزالة السطور المتعلقة بـ code-server
        grep -v "code-server" ~/.bashrc > ~/.bashrc.tmp
        mv ~/.bashrc.tmp ~/.bashrc
        print_success "تم تنظيف .bashrc"
    else
        print_success ".bashrc نظيف"
    fi
fi

# فحص .bash_profile
if [ -f ~/.bash_profile ]; then
    if grep -q "code-server" ~/.bash_profile; then
        cp ~/.bash_profile ~/.bash_profile.backup.$(date +%Y%m%d_%H%M%S)
        grep -v "code-server" ~/.bash_profile > ~/.bash_profile.tmp
        mv ~/.bash_profile.tmp ~/.bash_profile
        print_success "تم تنظيف .bash_profile"
    else
        print_success ".bash_profile نظيف"
    fi
fi

# فحص .profile
if [ -f ~/.profile ]; then
    if grep -q "code-server" ~/.profile; then
        cp ~/.profile ~/.profile.backup.$(date +%Y%m%d_%H%M%S)
        grep -v "code-server" ~/.profile > ~/.profile.tmp
        mv ~/.profile.tmp ~/.profile
        print_success "تم تنظيف .profile"
    else
        print_success ".profile نظيف"
    fi
fi

# =================================================================
# 4. تنظيف systemd services (إذا كانت موجودة)
# =================================================================
print_step "فحص الخدمات..."

if [ -d ~/.config/systemd/user ]; then
    if [ -f ~/.config/systemd/user/code-server.service ]; then
        systemctl --user stop code-server 2>/dev/null
        systemctl --user disable code-server 2>/dev/null
        rm -f ~/.config/systemd/user/code-server.service
        systemctl --user daemon-reload
        print_success "تم إزالة خدمة code-server"
    else
        print_success "لا توجد خدمات code-server"
    fi
fi

# =================================================================
# 5. تنظيف العمليات المعلقة
# =================================================================
print_step "فحص العمليات المعلقة..."

# قتل أي عمليات متعلقة بـ code-server
pkill -9 -f "code-server" 2>/dev/null && print_success "تم إيقاف العمليات المعلقة" || print_success "لا توجد عمليات معلقة"

# =================================================================
# 6. فحص المساحة المستردة
# =================================================================
print_step "فحص المساحة..."

# حساب المساحة
BEFORE_CLEANUP=$(du -sh ~ 2>/dev/null | cut -f1)
print_info "المساحة المستخدمة في المجلد الرئيسي: $BEFORE_CLEANUP"

# =================================================================
# 7. التقرير النهائي
# =================================================================
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✓ اكتمل التنظيف بنجاح                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

print_info "ملخص التنظيف:"
echo "  • تم إزالة code-server من النظام"
echo "  • تم تنظيف ملفات الإعداد والبيئة"
echo "  • تم إيقاف جميع الخدمات والعمليات المرتبطة"
echo "  • تم إنشاء نسخ احتياطية من ملفات البيئة"
echo ""

print_info "الخطوات التالية:"
echo "  1. أعد تشغيل الجلسة: ${CYAN}exit${NC} ثم افتح Termux مرة أخرى"
echo "  2. أو أعد تحميل البيئة: ${CYAN}source ~/.bashrc${NC}"
echo "  3. تحقق من النظافة: ${CYAN}which code-server${NC} (يجب ألا يجد شيء)"
echo ""

print_info "للعودة للإعداد الأصلي:"
echo "  ${CYAN}./termux-recovery.sh${NC}"
echo ""

# =================================================================
# 8. اختبار نهائي
# =================================================================
print_step "اختبار التنظيف..."

if command -v code-server &> /dev/null; then
    print_error "تحذير: code-server لا يزال موجوداً!"
    echo "  الموقع: $(which code-server)"
    echo "  يُنصح بحذفه يدوياً"
else
    print_success "ممتاز! code-server تم إزالته بالكامل"
fi

echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}💡 نصيحة:${NC} إذا واجهت أي مشاكل، تحقق من النسخ الاحتياطية:"
echo "   ~/.bashrc.backup.*"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""
