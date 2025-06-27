// frontend/src/pages/LoginSuccess.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { googleLoginSuccess } from '../features/auth/authSlice';

function LoginSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userDataString = params.get('user');

    if (userDataString) {
      const userData = JSON.parse(decodeURIComponent(userDataString));
      dispatch(googleLoginSuccess(userData));
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, location]);

  return <h1>Logging you in, please wait...</h1>;
}

export default LoginSuccess;