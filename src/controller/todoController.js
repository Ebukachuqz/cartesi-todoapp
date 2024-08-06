import { RollupStateHandler } from '../utils/rollupStateHandler';
import { todoManager } from '../todoManager';

export class TodoController {
  static async createTodoAction(sender, data) {
    if (!data.content) {
      return await RollupStateHandler.handleReport({
        error: "Content must be provided.",
      });
    }

    return await RollupStateHandler.advanceWrapper(() => {
      const newTodo = todoManager.createTodo(sender, data.content);

      return {
        ok: true,
        message: `Todo created!`,
        data: newTodo.getData(),
      };
    });
  }

  static async deleteTodoAction(sender, data) {
    if (!data.id)
      await RollupStateHandler.handleReport({
        error: "Todo Id must be provided.",
      });

    const deleteSuccess = todoManager.deleteTodoById(sender, data.id);
    if (!deleteSuccess) {
      return await RollupStateHandler.handleReport({
        error: `Todo ${data.id} not found`,
      });
    }
    return await RollupStateHandler.advanceWrapper(() => {
      return {
        ok: true,
        message: `Todo ${data.id} deleted`,
      };
    });
  }

  static async updateTodoAction(sender, data) {
    const updatedTodo = todoManager.updateTodoById(
      sender,
      data.id,
      data.content,
      data.completed
    );
    if (!updatedTodo) {
      return await RollupStateHandler.handleReport({
        error: `Todo ${data.id} not found`,
      });
    }
    return await RollupStateHandler.advanceWrapper(() => {
      return {
        ok: true,
        message: `Todo Updated`,
        data: updatedTodo.getData(),
      };
    });
  }

  static async getTodoById(id) {
    const todo = todoManager.getTodoById(id);
    if (todo) {
      return await RollupStateHandler.inspectWrapper(() => {
        return {
          ok: true,
          message: `Todo Found`,
          data: todo,
        };
      });
    }
    return await RollupStateHandler.handleReport({
      error: `Todo ${id} not found`,
    });
  }

  static async getAllTodos() {
    const todos = todoManager.getAllTodos();
    return await RollupStateHandler.inspectWrapper(() => {
      return { ok: true, message: `Todos List`, data: todos };
    });
  }
}
