import { useEffect, useState } from 'react';
import axios from 'axios';

const Todo = () => {
  const [task, setTask] = useState(''); // Controlled input for new task
  const [todos, setTodos] = useState([]); // Initialize as an empty array
  const [isEditing, setIsEditing] = useState(false); // Track if updating a task
  const [editId, setEditId] = useState(null); // Track the ID of the task being updated

  useEffect(() => {
    // Fetch tasks on component mount
    axios
      .get('/api/v1/task/read')
      .then(response => {
        setTodos(response.data.data); // Assuming response.data.data contains the tasks
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []); // Run only on component mount

  const handleAdd = (e) => {
    e.preventDefault();
    if (!task.trim()) return; // Prevent adding empty tasks

    if (isEditing) {
      // Update existing task
      axios
        .put(`/api/v1/task/update/${editId}`, { task })
        .then(response => {
          const updatedTask = response.data; // Assuming backend returns updated task
          setTodos(prevTodos =>
            prevTodos.map(todo =>
              todo._id === editId ? { ...todo, task: updatedTask.task } : todo
            )
          );
          setTask(''); // Clear input field
          setIsEditing(false); // Reset editing state
          setEditId(null); // Clear the edit ID
        })
        .catch(error => {
          console.error("Error updating task:", error);
        });
    } else {
      // Add new task
      axios
        .post('/api/v1/task/add', { task })
        .then(response => {
          setTodos(prevTodos => [...prevTodos, response.data.data]); // Update state with new task
          setTask(''); // Clear input field
        })
        .catch(error => {
          console.error("Error adding task:", error);
        });
    }
  };

  const handleDelete = (_id) => {
    axios
      .delete(`/api/v1/task/delete/${_id}`)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo._id !== _id)); // Filter out the deleted task
      })
      .catch(error => {
        console.error("Error deleting task:", error);
      });
  };

  const handleEdit = (todo) => {
    setTask(todo.task); // Set the task in the input field
    setIsEditing(true); // Set editing state to true
    setEditId(todo._id); // Set the ID of the task being edited
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
