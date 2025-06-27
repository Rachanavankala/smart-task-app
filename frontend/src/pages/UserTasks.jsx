// frontend/src/pages/UserTasks.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getUserTasks, resetUserTasks } from '../features/admin/adminSlice';
import { toast } from 'react-toastify';
import TaskItem from '../components/TaskItem'; // We can reuse our TaskItem component!

function UserTasks() {
  const dispatch = useDispatch();
  const { id } = useParams(); // Get the user ID from the URL

  const { userTasks, isLoading, isError, message } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getUserTasks(id));

    // Cleanup when we leave the page
    return () => {
      dispatch(resetUserTasks());
    };
  }, [dispatch, id, isError, message]);

  if (isLoading) {
    return <h3>Loading user tasks...</h3>;
  }

  return (
    <>
      <Link to="/admin/users" className="btn btn-secondary">
        ← Back to User List
      </Link>
      <section className="heading">
        <h1>User's Task List</h1>
        <p>Viewing all tasks for this user</p>
      </section>
      <section className="content">
        {userTasks && userTasks.length > 0 ? (
          <div className="tasks">
            {userTasks.map((task) => (
              <TaskItem key={task._id} task={task} />
            ))}
          </div>
        ) : (
          <h3>This user has not set any tasks</h3>
        )}
      </section>
    </>
  );
}

export default UserTasks;