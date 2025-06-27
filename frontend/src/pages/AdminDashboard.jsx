// frontend/src/pages/AdminDashboard.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUsers, deactivateUser, reset } from '../features/admin/adminSlice';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const dispatch = useDispatch();
  const { users, isLoading, isError, message } = useSelector((state) => state.admin);

  useEffect(() => {
    if (isError) toast.error(message);
    dispatch(getUsers());
    return () => { dispatch(reset()); };
  }, [dispatch, isError, message]);

  const handleDeactivate = (userId) => {
    if (window.confirm('Are you sure? This action cannot be undone.')) {
        dispatch(deactivateUser(userId));
    }
  };

  if (isLoading) return <h3>Loading users...</h3>;

  return (
    <div>
      <div className="content-header">
          <h1>Admin Dashboard</h1>
          <Link to="/admin/report" className="btn">Generate Overdue Report</Link>
      </div>
      <p>Manage user accounts.</p>
      <table className="user-table">
        <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td><Link to={`/admin/users/${user._id}/tasks`}>{user.name}</Link></td>
              <td>{user.email}</td>
              <td><span className={`status ${user.isActive ? 'status-active' : 'status-inactive'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
              <td>{user.isActive ? (<button className="btn-danger" onClick={() => handleDeactivate(user._id)}>Deactivate</button>) : (<span>-</span>)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default AdminDashboard;