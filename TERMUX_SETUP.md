# Termux Setup Guide - دليل إعداد Termux

This guide helps you set up the AI Agent project in Termux on Android.

هذا الدليل يساعدك على إعداد مشروع الوكيل الذكي في Termux على Android.

## Prerequisites - المتطلبات

### 1. Install Termux Packages

```bash
# Update package lists
pkg update && pkg upgrade

# Install required packages
pkg install nodejs python git

# Install build tools (required for node-gyp)
pkg install build-essential
```

### 2. Install Python setuptools (IMPORTANT!)

**This step is CRITICAL to fix the `distutils` error:**

```bash
# Install/upgrade pip and setuptools
pip install --upgrade pip setuptools
```

### Why setuptools?
- Python 3.10+ deprecated `distutils`
- Python 3.12+ removed `distutils` completely
- `setuptools` provides compatibility for `distutils`
- `node-gyp` requires `distutils` to build native modules like `sqlite3`

## Installation - التثبيت

### Option 1: Using the Interactive Script (Recommended)

```bash
# Clone the repository
git clone https://github.com/mhdessouky-creator/claude-code.git
cd claude-code

# Run the interactive setup script
./start-agent.sh
```

The script will:
1. ✅ Check your environment
2. ✅ Automatically install setuptools before Node.js dependencies
3. ✅ Install all required packages
4. ✅ Help you configure .env file
5. ✅ Launch the agent

### Option 2: Manual Installation

```bash
# Clone the repository
git clone https://github.com/mhdessouky-creator/claude-code.git
cd claude-code

# Install Python dependencies (including setuptools)
pip install -r requirements.txt

# Install Node.js dependencies
npm install

# Create environment file
cp .env.example .env
nano .env  # Add your ANTHROPIC_API_KEY

# Run the agent
node src/cli.js
```

## Common Issues - المشاكل الشائعة

### 1. `ModuleNotFoundError: No module named 'distutils'`

**Solution:**
```bash
pip install --upgrade setuptools
```

### 2. `gyp ERR! configure error` or `node-gyp rebuild` fails

**Solution:**
```bash
# Install build tools
pkg install build-essential

# Upgrade setuptools
pip install --upgrade pip setuptools

# Reinstall node modules
rm -rf node_modules package-lock.json
npm install
```

### 3. `sqlite3` build fails

**Option A - Install pre-built binary (Recommended):**
```bash
npm install sqlite3 --build-from-source
```

**Option B - Skip native modules:**
```bash
npm install --ignore-scripts
```

### 4. Storage permissions

```bash
# Grant storage access
termux-setup-storage
```

## Environment Configuration - إعداد البيئة

### Required API Keys

1. **Anthropic API Key** (Required)
   - Get it from: https://console.anthropic.com
   - Add to `.env`:
     ```
     ANTHROPIC_API_KEY=your_key_here
     ```

### Optional Configuration

```bash
# .env file
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
```

## Running the Agent - تشغيل الوكيل

### Interactive Mode

```bash
./start-agent.sh
```

### Direct Commands

```bash
# Chat mode
node src/cli.js chat

# Task mode
node src/cli.js task "your task here"

# Status check
node src/cli.js status
```

## Troubleshooting - استكشاف الأخطاء

### Check Python Version

```bash
python --version
# Should be Python 3.8+
```

### Check Node.js Version

```bash
node --version
# Should be v18.0.0+
```

### Verify setuptools Installation

```bash
python -c "from distutils.version import StrictVersion; print('OK')"
# Should print "OK"
```

### Clean Reinstall

```bash
# Remove all installed packages
rm -rf node_modules
rm -rf ~/.npm
rm package-lock.json

# Reinstall everything
pip install --upgrade setuptools
npm install
```

## Performance Tips - نصائح الأداء

1. **Use WiFi** - Termux works better on WiFi than mobile data
2. **Acquire wake lock** - Prevents Termux from sleeping:
   ```bash
   termux-wake-lock
   ```
3. **Background execution** - Keep Termux running in background
4. **Close other apps** - Free up RAM for better performance

## Additional Resources - موارد إضافية

- [Termux Wiki](https://wiki.termux.com/)
- [Node.js in Termux](https://wiki.termux.com/wiki/Node.js)
- [Python in Termux](https://wiki.termux.com/wiki/Python)
- [Project Issues](https://github.com/mhdessouky-creator/claude-code/issues)

## Support - الدعم

If you encounter issues:

1. Check this guide first
2. Search existing issues: https://github.com/mhdessouky-creator/claude-code/issues
3. Create a new issue with:
   - Error message
   - `python --version` and `node --version` output
   - Steps to reproduce

---

**Happy coding! 🚀**
**برمجة سعيدة! 🚀**
