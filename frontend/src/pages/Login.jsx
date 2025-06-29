// frontend/src/pages/Login.jsx
// --- FINAL VERSION WITH CENTERED LAYOUT ---

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../features/auth/authSlice';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
  console.log("user:", user);
  console.log("isSuccess:", isSuccess);
  console.log("isError:", isError);
  console.log("message:", message);

  if (isError) {
    toast.error(message);
  }

  if (isSuccess || user) {
    navigate('/', { replace: true });

    setTimeout(() => {
      dispatch(reset());
    }, 100);
  }
}, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="form-container">
      <section className="heading">
        <h1>Login</h1>
        <p>Please log in to your account</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block">
              Submit
            </button>
          </div>
        </form>

        <div className="google-login-container">
          <p>OR</p>
          <a
            href="http://localhost:5000/api/auth/google"
            className="btn btn-google btn-block"
          >
            Login with Google
          </a>
        </div>
      </section>
    </div>
  );
}

export default Login;