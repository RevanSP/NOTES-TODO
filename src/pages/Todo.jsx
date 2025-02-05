import { useState } from "react";
import Layout from "../components/Layout"

const Todo = () => {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks")) || []);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState({ description: "", time: "", index: null });
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModified, setIsModified] = useState(false);

  const updateTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (newTaskDescription && newTaskTime) {
      updateTasks([...tasks, { description: newTaskDescription, time: newTaskTime, completed: false }]);
      setNewTaskDescription("");
      setNewTaskTime("");
      document.getElementById("createTask").close();
    }
  };

  const toggleTaskCompletion = (index) => updateTasks(tasks.map((task, i) => i === index ? { ...task, completed: !task.completed } : task));

  const handleDeleteTask = () => {
    updateTasks(tasks.filter((_, i) => i !== taskToDelete));
    document.getElementById("deleteTask").close();
  };

  const openDeleteDialog = (index) => {
    setTaskToDelete(index);
    document.getElementById("deleteTask").showModal();
  };

  const openUpdateDialog = (index) => {
    setTaskToEdit({ ...tasks[index], index });
    document.getElementById("updateTask").showModal();
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    const { taskDescription, taskTime } = e.target.elements;
    if (taskDescription.value && taskTime.value) {
      const updatedTask = { ...taskToEdit, description: taskDescription.value, time: taskTime.value };
      updateTasks(tasks.map((task, i) => i === taskToEdit.index ? updatedTask : task));
      document.getElementById("updateTask").close();
      setIsModified(false);
    }
  };

  const openCreateDialog = () => {
    setNewTaskDescription("");
    setNewTaskTime("");
    document.getElementById("createTask").showModal();
  };

  const filteredTasks = tasks.filter((task) =>
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = () => {
    setIsModified(true);
  };

  const isFormValid = newTaskDescription && newTaskTime;

  const noTasksFound = filteredTasks.length === 0;

  return (
    <>
      <Layout openCreateDialog={openCreateDialog} onSearch={setSearchTerm}>
        <dialog id="updateTask" className="modal">
          <div className="modal-box shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-none">
            <form onSubmit={handleUpdateTask}>
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              <h3 className="text-lg font-bold mb-4">UPDATE TASK</h3>
              <div className="join w-full">
                <input
                  className="input input-bordered join-item shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-none bg-base-300 w-full text-xs"
                  type="text"
                  name="taskDescription"
                  placeholder="Edit your task ..."
                  value={taskToEdit?.description || ''}
                  onChange={(e) => {
                    setTaskToEdit({ ...taskToEdit, description: e.target.value });
                    setIsModified(true);
                  }}
                  required
                />
                <input
                  className="input input-bordered join-item shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-base-300 rounded-none text-xs"
                  type="time"
                  name="taskTime"
                  value={taskToEdit?.time || ''}
                  onChange={(e) => {
                    setTaskToEdit({ ...taskToEdit, time: e.target.value });
                    setIsModified(true);
                  }}
                  required
                />
                <button
                  className="btn join-item shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-none bg-base-300"
                  disabled={!isModified}
                >
                  <i className="bi bi-check2-circle"></i>
                </button>
              </div>
            </form>
          </div>
        </dialog>
        <dialog id="createTask" className="modal">
          <div className="modal-box shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-none">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("createTask").close()}
            >
              ✕
            </button>
            <form onSubmit={handleCreateTask}>
              <h3 className="text-lg font-bold mb-4">CREATE TASK</h3>
              <div className="join w-full">
                <input
                  name="taskDescription"
                  className="input input-bordered join-item shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-none bg-base-300 w-full text-xs"
                  type="text"
                  placeholder="Add a new task ..."
                  value={newTaskDescription}
                  onChange={(e) => {
                    setNewTaskDescription(e.target.value);
                    handleInputChange();
                  }}
                  required
                />
                <input
                  name="taskTime"
                  className="input input-bordered join-item shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black bg-base-300 rounded-none text-xs"
                  type="time"
                  value={newTaskTime}
                  onChange={(e) => {
                    setNewTaskTime(e.target.value);
                    handleInputChange();
                  }}
                  required
                />
                <button
                  type="submit"
                  className="btn join-item shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-none bg-base-300"
                  disabled={!isFormValid}
                >
                  <i className="bi bi-check2-circle"></i>
                </button>
              </div>
            </form>
          </div>
        </dialog>
        <dialog id="deleteTask" className="modal">
          <div className="modal-box shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-none">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="text-lg font-bold mb-4">DELETE TASK</h3>
            <p>Are you sure you want to delete this task?</p>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="btn join-item shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-none bg-base-300 btn-sm"
                onClick={handleDeleteTask}
              >
                SUBMIT
              </button>
            </div>
          </div>
        </dialog>
        {noTasksFound && (
          <div className="px-4">
            <div className="alert bg-base-100 border-2 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-20">
              <i className="bi bi-info-circle"></i>
              <span>Tasks not found.</span>
            </div>
          </div>
        )}
        <ul className="space-y-4 px-4 mt-20 mb-5">
          {filteredTasks.map((task, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-base-100 border-2 border-black rounded-none p-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex flex-col w-full max-w-[calc(100%-12rem)]">
                <span
                  className={`text-lg font-medium truncate ${task.completed ? "line-through text-gray-500" : ""}`}
                >
                  {task.description}
                </span>
                <small className="text-gray-400 text-sm">
                  <i className="bi bi-clock mr-1"></i>
                  {task.time}
                </small>
              </div>
              <div className="flex space-x-3 mr-1">
                <button onClick={() => toggleTaskCompletion(index)} className="btn btn-sm bg-base-300 border-2 border-black btn-square text-xs rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <i
                    className={`bi bi-check2-circle text-lg hover:text-gray-400 ${task.completed}`}
                  ></i>
                </button>
                <button className="btn btn-sm bg-base-300 border-2 border-black btn-square text-xs rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" onClick={() => openUpdateDialog(index)}>
                  <i className="bi bi-pencil-square text-lg hover:text-gray-400"></i>
                </button>
                <button className="btn btn-sm bg-base-300 border-2 border-black btn-square text-xs rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" onClick={() => openDeleteDialog(index)}>
                  <i className="bi bi-trash text-lg hover:text-gray-400"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Layout>
    </>
  );
};

export default Todo;