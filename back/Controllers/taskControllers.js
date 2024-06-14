const Task = require('../models/dbTasks') 

exports.getAllTasks = async (req, res, next) =>{
    try {
        let tasks = await Task.getAllTasks()
        return res.status(200).json(tasks)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.addNewTask = async (req, res, next) =>{
    try {
        const {body} = req.body
        let task = await Task.addNewTask(body)

        res.status(201).send(task)
    } catch (error) {
        console.log(error)
        next(error)
    }
    
}

exports.deleteTaskById = async (req, res, next) => {
    try {
        const { id } = req.params; // Отримання id з req.params
        let task = await Task.deleteTaskById(id);

        res.status(200).json(task); // Використання статусу 200 для успішного видалення
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.moveUp = async (req, res, next) =>{
    try {
        const { id } = req.params;
        const result = await Task.moveUp(parseInt(id, 10));
        res.status(200).json(result);
      } catch (err) {
        console.error(err);
        next(err);
      }
}

exports.moveDown = async (req, res, next) =>{
    try {
        const { id } = req.params;
        const result = await Task.moveDown(parseInt(id, 10));
        res.status(200).json(result);
      } catch (err) {
        console.error(err);
        next(err);
      }
}