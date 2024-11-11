import React, { useState } from 'react'
import './ToDoListComponent.css'



const ToDoListComponent = () => {
    const [tasks, setTasks] = useState({
        todo: [],
        inProgress: [],
        completed: []
    });

    const [currentTask, setCurrentTask] = useState({
        task: ' ',
        note: ' ',
        state: 'todo'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTaskIndex, setEditingTaskIndex] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const openModal = (state) => {
        const newTask = {
            task: currentTask.task,
            note: currentTask.note,
            state: state
        }
        setCurrentTask(newTask);
        setModalOpen(true);
        setIsEditing(false);
    };

    const openEditModal = (state, index) => {
        const taskToEdit = tasks[state][index];
        const editTask = {
            task: taskToEdit.task,
            note: taskToEdit.note,
            state: state
        };
        setCurrentTask(editTask);
        setEditingTaskIndex(index);
        setIsEditing(true);
        setModalOpen(true);
    };

    const closeModal = () => {
        const newTask = {
            task: '',
            note: '',
            state: 'todo'
        }
        setCurrentTask(newTask);
        setIsEditing(false);
        setModalOpen(false);
        setEditingTaskIndex(null);
    };

    const openDeleteModal = (state, index) => {
        setDeleteModalOpen(true);
        setTaskToDelete({
            state: state,
            index: index
        });
    };

    const closeDeleteModal = () => setDeleteModalOpen(false);

    const handleTaskInputChange = (e) => {
        const newTask = {
            task: e.target.value,
            note: currentTask.note,
            state: currentTask.state
        };
        setCurrentTask(newTask);
    };

    const handleNoteInputChange = (e) => {
        const newTask = {
            task: currentTask.task,
            note: e.target.value,
            state: currentTask.state
        };
        setCurrentTask(newTask);
    };

    const addTask = () => {
        if (currentTask.task.trim()) {
            if (isEditing) {
                const updatedTasks = {
                    todo: [...tasks.todo],
                    inProgress: [...tasks.inProgress],
                    completed: [...tasks.completed]
                };

                const newTask = {
                    task: currentTask.task,
                    note: currentTask.note
                };

                updatedTasks[currentTask.state][editingTaskIndex] = newTask;
                setTasks(updatedTasks);
            } else {
                const newTask = {
                    task: currentTask.task,
                    note: currentTask.note
                };

                const updatedTasks = {
                    todo: [...tasks.todo],
                    inProgress: [...tasks.inProgress],
                    completed: [...tasks.completed]
                };

                updatedTasks[currentTask.state].push(newTask);
                setTasks(updatedTasks);
            }
            closeModal();
        } else {
            alert("Task is a required field.");
        }
    };

    const moveTask = (fromState, toState, index) => {
        const taskToMove = tasks[fromState][index];
        const updatedTasks = {
            todo: [...tasks.todo],
            inProgress: [...tasks.inProgress],
            completed: [...tasks.completed]
        };

       
        updatedTasks[fromState].splice(index, 1);
    
        updatedTasks[toState].push(taskToMove);

        setTasks(updatedTasks);
    };

    const deleteTask = () => {

        const updatedTasks = {
            todo: [...tasks.todo],
            inProgress: [...tasks.inProgress],
            completed: [...tasks.completed]
        };

        updatedTasks[taskToDelete.state].splice(taskToDelete.index, 1);
        setTasks(updatedTasks);
        closeDeleteModal();
    };

    const renderTasks = (state) => (
        tasks[state].map((task, index) => (
            <div key={index} className="task-card">
                <h4 className='task'>{task.task}</h4>
                {task.note && <p className="task-note"><strong>Note:</strong> {task.note}</p>}
                <div className="task-actions">
                    <button
                        className="edit-btn"
                        onClick={() => openEditModal(state, index)}
                        title="Edit"
                    >
                        ✎
                    </button>
                    <button
                        className="delete-btn"
                        onClick={() => openDeleteModal(state, index)}
                        title="Delete"
                    >
                        ✕
                    </button>
                </div>
                <div className="state-buttons">
                    {state !== 'inProgress' && (
                        <button className='state-btn' onClick={() => moveTask(state, 'inProgress', index)}>
                            In Progress
                        </button>
                    )}
                    {state !== 'todo' && (
                        <button className='state-btn' onClick={() => moveTask(state, 'todo', index)}>
                            To Do
                        </button>
                    )}
                    {state !== 'completed' && (
                        <button className='state-btn' onClick={() => moveTask(state, 'completed', index)}>
                            Completed
                        </button>
                    )}
                </div>
            </div>
        ))
    );

    return (
        <div className='app-container'>
            <h1>To-Do List</h1>
            <div className='task-borad'>
                <div className='task-column'>
                    <h2>To-Do</h2>
                    <button onClick={() => openModal('todo')}>Create Task</button>
                    {renderTasks('todo')}
                </div>
                <div className='task-column'>
                    <h2>In Progress</h2>
                    <button onClick={() => openModal('inProgress')}>Create Task</button>
                    {renderTasks('inProgress')}
                </div>
                <div className='task-column'>
                    <h2>Completed</h2>
                    <button onClick={() => openModal('completed')}>Create Task</button>
                    {renderTasks('completed')}
                </div>
            </div>

            {modalOpen && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h3>{isEditing ? 'Edit Task' : 'Add Task'}</h3>
                        <input
                            type="text"
                            placeholder="Task (required)"
                            value={currentTask.task}
                            onChange={handleTaskInputChange}
                        />
                        <textarea
                            placeholder="Note (optional)"
                            value={currentTask.note}
                            onChange={handleNoteInputChange}
                        />
                        <div className='modal-buttons'>
                            <button onClick={addTask} className='primary-btn'>
                                {isEditing ? 'Save Changes' : 'Add Task'}
                            </button>
                            <button onClick={closeModal} className='secondary-btn'>Cancel</button>
                        </div>

                    </div>
                </div>
            )}

            {deleteModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Are you sure you want to delete this task?</h3>
                        <div className='modal-buttons'>
                            <button onClick={deleteTask} className='danger-btn'>Yes, Delete</button>
                            <button onClick={closeDeleteModal} className='secondary-btn'>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default ToDoListComponent