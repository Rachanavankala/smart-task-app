// frontend/src/components/TaskItem.jsx
import { useDispatch } from 'react-redux';
import { deleteTask, updateTask } from '../features/tasks/taskSlice';
import { toast } from 'react-toastify';

function TaskItem({ task }) {
  const dispatch = useDispatch();

  const handleUpdate = () => {
    dispatch(updateTask({ ...task, isCompleted: !task.isCompleted }))
      .unwrap()
      .then(() => window.location.reload()) // Just reload on success
      .catch(toast.error);
  };

  const handleDelete = () => {
    dispatch(deleteTask(task._id))
      .unwrap()
      .then(() => {
        toast.success('Task Deleted');
        window.location.reload(); // Just reload on success
      })
      .catch(toast.error);
  };

  return (
    <div className={`task ${task.isCompleted ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={handleUpdate}
        className="task-checkbox"
      />
      <div className="task-content">
        <div>{new Date(task.createdAt).toLocaleString('en-US')}</div>
        <h2>{task.text}</h2>
        {/* We will remove the extra details for now to ensure stability */}
      </div>
      <button onClick={handleDelete} className="close">X</button>
    </div>
  );
}
export default TaskItem;