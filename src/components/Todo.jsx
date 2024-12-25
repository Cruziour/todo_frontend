import { useEffect, useState } from 'react';
import axios from 'axios';

const Todo = () => {
  const [task, setTask] = useState(''); // Controlled input for new task
  const [todos, setTodos] = useState([]); // Initialize as an empty array
  const [isEditing, setIsEditing] = useState(false); // Track if updating a task
  const [editId, setEditId] = useState(null); // Track the ID of the task being updated

  const fetchTasks = () => {
    axios
      .get('/api/v1/task')
      .then(response => {
        setTodos(response.data.data); // Assuming response.data.data contains the tasks
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks on component mount
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    if (isEditing) {
      axios
        .put(`/api/v1/task/${editId}`, { task })
        .then(() => {
          fetchTasks(); // Fetch updated tasks
          setTask('');
          setIsEditing(false);
          setEditId(null);
        })
        .catch(error => {
          console.error('Error updating task:', error);
        });
    } else {
      axios
        .post('/api/v1/task', { task })
        .then(() => {
          fetchTasks(); // Fetch updated tasks
          setTask('');
        })
        .catch(error => {
          console.error('Error adding task:', error);
        });
    }
  };

  const handleDelete = (_id) => {
    axios
      .delete(`/api/v1/task/${_id}`)
      .then(() => {
        fetchTasks(); // Fetch updated tasks
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  };

  const handleEdit = (todo) => {
    setTask(todo.task);
    setIsEditing(true);
    setEditId(todo._id);
  };


  return (
    <div className="w-full h-screen flex justify-center mt-10">
      <div>
        <h1 className="text-3xl font-bold text-center">Todo List</h1>
        <div className="mt-4 w-full text-black">
          <input
            type="text"
            id="task"
            className="w-96 h-10 px-2 py-1 text-lg font-medium"
            onChange={(e) => setTask(e.target.value)}
            value={task}
            placeholder="Enter a new task"
          />
          <button
            className={`h-10 w-20 ml-1 text-white border-4 ${isEditing ? 'bg-yellow-500 border-yellow-500' : 'bg-blue-900 border-blue-900'}`}
            onClick={handleAdd}
          >
            {isEditing ? 'Update' : 'Add'}
          </button>
        </div>
        <ul>
          {todos.map((todo, index) => (
            <li key={todo._id || index} className="mt-2">
              <div className="flex justify-between items-center">
                <span>{todo.task}</span>
                <div>
                  <button
                    onClick={() => handleEdit(todo)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded ml-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
