class Todo {
  constructor(id, owner, content, completed = false) {
    this.id = id;
    this.owner = owner;
    this.content = content;
    this.completed = completed;
  }

  update(content, completed) {
    if (content !== undefined) this.content = content;
    if (completed !== undefined) this.completed = completed;
  }

  getData() {
    return {
      id: this.id,
      owner: this.owner,
      content: this.content,
      completed: this.completed,
    };
  }
}

class TodoManager {
  constructor() {
    this.todos = [];
    this.nextId = 1;
  }

  createTodo(owner, content) {
    const newTodo = new Todo(this.nextId++, owner, content);
    this.todos.push(newTodo);
    return newTodo;
  }

  getTodoById(id) {
    return this.todos.find(todo => todo.id === id);
  }

  getAllTodos() {
    return this.todos;
  }

  deleteTodoById(owner, id) {
    const index = this.todos.findIndex(todo => todo.id === id && todo.owner === owner);
    if (index === -1) return false;
    this.todos.splice(index, 1);
    return true;
  }

  updateTodoById(owner, id, content, completed) {
    const todo = this.getTodoById(owner, id);
    if (!todo) return false;
    todo.update(content, completed);
    return todo;
  }
}

export const todoManager = new TodoManager();
