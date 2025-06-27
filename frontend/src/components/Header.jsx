// frontend/src/components/Header.jsx
// --- FINAL VERSION WITH ADMIN LINK ---

import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the user from the global auth state
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">SmartTask</Link>
      </div>
      <ul>
        {user ? (
          // If a user is logged in...
          <>
            {/* ...first check if they are an admin */}
            {user.isAdmin && (
              <li>
                <Link to="/admin/users">Admin</Link>
              </li>
            )}
            
            {/* ...then show the Logout button */}
            <li>
              <button className="btn" onClick={onLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          // If no user is logged in, show Login and Register
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;