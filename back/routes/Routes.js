const express = require('express')
const router = express.Router()

const taskControllers = require('../Controllers/taskControllers')

router.route('/')
    .get(taskControllers.getAllTasks)
    .post(taskControllers.addNewTask)
router.route('/:id').delete(taskControllers.deleteTaskById)
router.route('/moveup/:id').put(taskControllers.moveUp)
router.route('/movedown/:id').put(taskControllers.moveDown)

module.exports = router