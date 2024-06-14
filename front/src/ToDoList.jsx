import { useState, useEffect } from 'react';
import axios from 'axios';

function TodoList() {
  const [tasks, setTasks] = useState(['asd']);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  async function addTask() {
    if (newTask.trim() !== '') {
      try {
        const response = await axios.post('http://localhost:5000/api/tasks', { body: newTask });
        if (response.status === 201) {
          fetchTasks();
          setNewTask('');
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  }

  async function deleteTask(id) {
    try {
      const response = await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      if (response.status === 200) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  function getIndexById(id) {
    return tasks.findIndex(task => task.id === id);
  }

  async function moveTaskUp(id) {
    if (id > 1) {
        console.log('asdasdsd')
      try {
        const response = await axios.put(`http://localhost:5000/api/tasks/moveup/${id}`);
        if (response.status === 200) {
          fetchTasks();
        }
      } catch (error) {
        console.error('Error moving task up:', error);
      }
    }
  }

  async function moveTaskDown(id) {
    if (getIndexById(id) < tasks.length - 1) {
      try {
        const response = await axios.put(`http://localhost:5000/api/tasks/movedown/${id}`);
        if (response.status === 200) {
          fetchTasks();
        }
      } catch (error) {
        console.error('Error moving task down:', error);
      }
    }
  }

  return (
    <div className='to-do-list'>
      <h1>To Do List</h1>

      <div className='new-task'>
        <input type='text' value={newTask} onChange={handleInputChange} placeholder='Enter a task' />
        <button className='add-button' onClick={addTask}>Add</button>
      </div>
      <ol>
        {tasks.map((task) => (
          <li key={task.id}>
            <span className='text'>{task.body}</span>
            <button className='up-button' onClick={() => moveTaskUp(task.id)}>Up</button>
            <button className='down-button' onClick={() => moveTaskDown(task.id)}>Down</button>
            <button className='delete-button' onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default TodoList;
