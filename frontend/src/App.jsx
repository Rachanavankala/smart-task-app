// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import LoginSuccess from './pages/LoginSuccess';
import AdminDashboard from './pages/AdminDashboard';
import UserTasks from './pages/UserTasks';
import AdminReport from './pages/AdminReport';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/success" element={<LoginSuccess />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/users" element={<AdminRoute />}>
              <Route path="" element={<AdminDashboard />} />
            </Route>
            <Route path="/admin/users/:id/tasks" element={<AdminRoute />}>
              <Route path="" element={<UserTasks />} />
            </Route>
            <Route path="/admin/report" element={<AdminRoute />}>
              <Route path="" element={<AdminReport />} />
            </Route>
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}
export default App;