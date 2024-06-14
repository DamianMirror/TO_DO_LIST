const db = require('../config/db')

class Task{
    static async addNewTask(task) {
        // SQL to find the maximum current ID
        const getMaxIdSql = `SELECT MAX(id) AS maxId FROM tasks;`;
        // SQL to insert a new task
        const insertTaskSql = `INSERT INTO tasks (id, body) VALUES (?, ?);`;
    
        try {
            // Get the maximum current ID
            const [rows] = await db.query(getMaxIdSql);
            const maxId = rows[0].maxId || 0; // Default to 0 if no rows exist
            const newId = maxId + 1; // Increment the max ID by 1
    
            // Insert the new task with the new ID
            const [result] = await db.query(insertTaskSql, [newId, task]);
            return result;
        } catch (error) {
            console.error('Ошибка при добавлении задачи:', error);
            throw error;
        }
    }
    

    static async getAllTasks() {
        const sql = `
          SELECT * FROM tasks;
        `;
    
        try {
            const [result] = await db.query(sql);
            return result;
        } catch (error) {
            console.error('Ошибка при добавлении задачи:', error);
            throw error;
        }
    }

    static async deleteTaskById(id) {

        const deleteSql = `DELETE FROM tasks WHERE id = ?`;
        const updateSql = `UPDATE tasks SET id = id - 1 WHERE id > ?`;
        try {
            let [result] = await db.query(deleteSql, [id]);
            [result] = await db.query(updateSql, [id]);
            return result;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }

    static async moveUp(id) {
        // Перевіряємо, чи існує завдання з даним id
        const checkTaskSql = `
          SELECT id, body FROM tasks WHERE id = ?;
        `;
    
        // Отримуємо id і body завдання, яке знаходиться перед поточним завданням
        const getPreviousTaskSql = `
          SELECT id, body FROM tasks WHERE id < ? ORDER BY id DESC LIMIT 1;
        `;
    
        // Оновлюємо body завдань, змінюючи їх місцями
        const updateTaskSql = `
          UPDATE tasks SET body = ? WHERE id = ?;
        `;
    
        try {
          const [taskRows] = await db.query(checkTaskSql, [id]);
          if (taskRows.length === 0) {
            return { message: 'Завдання не існує' };
          }
    
          const [previousTaskRows] = await db.query(getPreviousTaskSql, [id]);
    
          const currentTask = taskRows[0];
          const previousTask = previousTaskRows[0];
    
          // Обмінюємо значення body місцями
          await db.query(updateTaskSql, [previousTask.body, currentTask.id]);
          await db.query(updateTaskSql, [currentTask.body, previousTask.id]);
    
          return { message: 'Завдання переміщено вгору' };
        } catch (error) {
          console.error('Помилка при переміщенні завдання:', error);
          throw error;
        }
      }

      static async moveDown(id) {
        // Перевіряємо, чи існує завдання з даним id
        const checkTaskSql = `
          SELECT id, body FROM tasks WHERE id = ?;
        `;
    
        // Отримуємо id і body завдання, яке знаходиться після поточного завдання
        const getNextTaskSql = `
          SELECT id, body FROM tasks WHERE id > ? ORDER BY id ASC LIMIT 1;
        `;
    
        // Оновлюємо body завдань, змінюючи їх місцями
        const updateTaskSql = `
          UPDATE tasks SET body = ? WHERE id = ?;
        `;
    
        try {
          const [taskRows] = await db.query(checkTaskSql, [id]);
          if (taskRows.length === 0) {
            return { message: 'Завдання не існує' };
          }
    
          const [nextTaskRows] = await db.query(getNextTaskSql, [id]);
    
          const currentTask = taskRows[0];
          const nextTask = nextTaskRows[0];
    
          // Обмінюємо значення body місцями
          await db.query(updateTaskSql, [nextTask.body, currentTask.id]);
          await db.query(updateTaskSql, [currentTask.body, nextTask.id]);
    
          return { message: 'Завдання переміщено вниз' };
        } catch (error) {
          console.error('Помилка при переміщенні завдання:', error);
          throw error;
        }
      }
}

module.exports = Task