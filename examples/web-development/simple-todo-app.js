/**
 * Simple Todo App - مثال تطبيق قائمة المهام
 * Created with Claude Code
 */

class TodoApp {
  constructor() {
    this.todos = [];
    this.nextId = 1;
  }

  // إضافة مهمة جديدة - Add new task
  addTodo(title, description = '') {
    const todo = {
      id: this.nextId++,
      title,
      description,
      completed: false,
      createdAt: new Date(),
    };
    this.todos.push(todo);
    return todo;
  }

  // الحصول على جميع المهام - Get all tasks
  getAllTodos() {
    return this.todos;
  }

  // الحصول على مهمة محددة - Get specific task
  getTodoById(id) {
    return this.todos.find(todo => todo.id === id);
  }

  // تحديث مهمة - Update task
  updateTodo(id, updates) {
    const todo = this.getTodoById(id);
    if (todo) {
      Object.assign(todo, updates);
      return todo;
    }
    return null;
  }

  // تبديل حالة الإكمال - Toggle completion status
  toggleTodo(id) {
    const todo = this.getTodoById(id);
    if (todo) {
      todo.completed = !todo.completed;
      return todo;
    }
    return null;
  }

  // حذف مهمة - Delete task
  deleteTodo(id) {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      return this.todos.splice(index, 1)[0];
    }
    return null;
  }

  // الحصول على المهام المكتملة - Get completed tasks
  getCompletedTodos() {
    return this.todos.filter(todo => todo.completed);
  }

  // الحصول على المهام الغير مكتملة - Get pending tasks
  getPendingTodos() {
    return this.todos.filter(todo => !todo.completed);
  }

  // مسح جميع المهام المكتملة - Clear all completed tasks
  clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.completed);
  }
}

// مثال الاستخدام - Usage Example
const app = new TodoApp();

app.addTodo('تعلم Claude Code', 'قراءة التوثيق والأمثلة');
app.addTodo('بناء مشروع', 'إنشاء تطبيق ويب باستخدام React');
app.addTodo('كتابة الاختبارات', 'إضافة unit tests للتطبيق');

console.log('جميع المهام:', app.getAllTodos());
console.log('المهام المعلقة:', app.getPendingTodos());

app.toggleTodo(1);
console.log('بعد إكمال المهمة الأولى:', app.getCompletedTodos());

module.exports = TodoApp;
