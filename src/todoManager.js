class TodoManager {
  constructor() {
    this.todos = [];
  }

  createTodo(sender, content) {
    const id = this.todos.length + 1;
    const todo = { id, sender, content, completed: false };
    this.todos.push(todo);
    return todo;
  }

  getTodos(sender) {
    return this.todos;
    // .filter((todo) => todo.sender === sender);
  }

  getTodoById(sender, id) {
    return this.todos.find((todo) => todo.id === id);
    // && todo.sender === sender);
  }

  updateTodo(sender, id, content, completed) {
    const todo = this.todos.find(
      (todo) => todo.id === id && todo.sender === sender
    );
    if (todo) {
      todo.content = content;
      todo.completed = completed;
    }
    return todo;
  }

  deleteTodo(sender, id) {
    const index = this.todos.findIndex(
      (todo) => todo.id === id && todo.sender === sender
    );
    if (index !== -1) {
      this.todos.splice(index, 1);
      return true;
    }
    return false;
  }
}

module.exports = TodoManager;
