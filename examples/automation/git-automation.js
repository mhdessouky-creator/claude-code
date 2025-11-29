/**
 * Git Automation Scripts - سكريبتات أتمتة Git
 * مثال على كيفية أتمتة عمليات Git الشائعة
 * Example of automating common Git operations
 */

const { execSync } = require('child_process');

class GitAutomation {
  /**
   * تنفيذ أمر Git وإرجاع النتيجة
   * Execute Git command and return result
   */
  static executeGitCommand(command) {
    try {
      return execSync(command, { encoding: 'utf-8' }).trim();
    } catch (error) {
      console.error(`خطأ في تنفيذ الأمر: ${command}`);
      console.error(error.message);
      return null;
    }
  }

  /**
   * الحصول على حالة Git الحالية
   * Get current Git status
   */
  static getStatus() {
    return this.executeGitCommand('git status --short');
  }

  /**
   * الحصول على الفرع الحالي
   * Get current branch
   */
  static getCurrentBranch() {
    return this.executeGitCommand('git branch --show-current');
  }

  /**
   * إضافة جميع الملفات المعدلة
   * Add all modified files
   */
  static addAll() {
    return this.executeGitCommand('git add .');
  }

  /**
   * إنشاء commit مع رسالة تلقائية
   * Create commit with automatic message
   */
  static smartCommit() {
    const status = this.getStatus();
    if (!status) {
      console.log('لا توجد تغييرات للحفظ');
      return;
    }

    // تحليل التغييرات لإنشاء رسالة ذكية
    const lines = status.split('\n');
    const changes = {
      added: 0,
      modified: 0,
      deleted: 0,
    };

    lines.forEach(line => {
      if (line.startsWith('A ')) changes.added++;
      else if (line.startsWith('M ')) changes.modified++;
      else if (line.startsWith('D ')) changes.deleted++;
    });

    // بناء رسالة الcommit
    let message = 'Update: ';
    const parts = [];
    if (changes.added > 0) parts.push(`${changes.added} files added`);
    if (changes.modified > 0) parts.push(`${changes.modified} files modified`);
    if (changes.deleted > 0) parts.push(`${changes.deleted} files deleted`);
    message += parts.join(', ');

    this.addAll();
    return this.executeGitCommand(`git commit -m "${message}"`);
  }

  /**
   * إنشاء فرع جديد والانتقال إليه
   * Create new branch and switch to it
   */
  static createAndSwitchBranch(branchName) {
    return this.executeGitCommand(`git checkout -b ${branchName}`);
  }

  /**
   * دمج فرع آخر في الفرع الحالي
   * Merge another branch into current branch
   */
  static mergeBranch(branchName) {
    return this.executeGitCommand(`git merge ${branchName}`);
  }

  /**
   * دفع التغييرات إلى المستودع البعيد
   * Push changes to remote repository
   */
  static push(remote = 'origin', branch = null) {
    const currentBranch = branch || this.getCurrentBranch();
    return this.executeGitCommand(`git push ${remote} ${currentBranch}`);
  }

  /**
   * سحب التغييرات من المستودع البعيد
   * Pull changes from remote repository
   */
  static pull(remote = 'origin', branch = null) {
    const currentBranch = branch || this.getCurrentBranch();
    return this.executeGitCommand(`git pull ${remote} ${currentBranch}`);
  }

  /**
   * الحصول على آخر N من الcommits
   * Get last N commits
   */
  static getRecentCommits(count = 5) {
    return this.executeGitCommand(`git log -${count} --oneline`);
  }

  /**
   * التراجع عن آخر commit (مع الحفاظ على التغييرات)
   * Undo last commit (keep changes)
   */
  static undoLastCommit() {
    return this.executeGitCommand('git reset --soft HEAD~1');
  }

  /**
   * عرض الاختلافات في الملفات
   * Show file differences
   */
  static showDiff() {
    return this.executeGitCommand('git diff');
  }
}

// مثال الاستخدام - Usage Example
if (require.main === module) {
  console.log('=== Git Automation Demo ===\n');

  console.log('الفرع الحالي:', GitAutomation.getCurrentBranch());
  console.log('\nالحالة:');
  console.log(GitAutomation.getStatus() || 'لا توجد تغييرات');

  console.log('\nآخر 5 commits:');
  console.log(GitAutomation.getRecentCommits(5));
}

module.exports = GitAutomation;
