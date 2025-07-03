// frontend/src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import TaskChart from '../components/TaskChart';
import CategoryStats from '../components/CategoryStats';
import { getTasks, getTasksDueToday, getUpcomingTasks, reset as resetTasks, setSortOption, selectSortedTasks } from '../features/tasks/taskSlice';
import { getTaskStats, getPopularCategories, reset as resetStats } from '../features/stats/statsSlice';
import taskService from '../features/tasks/taskService';
import { getCreatedVsCompletedStats } from '../features/stats/statsSlice';
import ComparisonChart from '../components/ComparisonChart';
function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const {
    tasksDueToday, upcomingTasks, isLoading,
    isError, message, sortOption, lastCUDTimestamp,
  } = useSelector((state) => state.task);
  const sortedTasks = useSelector(selectSortedTasks);

  useEffect(() => {
    if (isError) { toast.error(message); }
    if (!user) { navigate('/login'); }
    else {
      dispatch(getTasks());
      dispatch(getTaskStats());
      dispatch(getTasksDueToday());
      dispatch(getUpcomingTasks());
      dispatch(getPopularCategories());
      dispatch(getCreatedVsCompletedStats());
    }
    return () => { dispatch(resetTasks()); dispatch(resetStats()); };
  }, [user, navigate, dispatch]);

  useEffect(() => {
    if (lastCUDTimestamp) {
      dispatch(getTasks());
      dispatch(getTasksDueToday());
      dispatch(getUpcomingTasks());
    }
  }, [lastCUDTimestamp, dispatch]);

  const handleSortChange = (e) => { dispatch(setSortOption(e.target.value)); };
  const onDownload = (format) => {
    if (!user) return;
    toast.info(`Preparing your ${format.toUpperCase()} download...`);
    taskService.downloadTasks(user.token, format).catch(() => toast.error('Download failed.'));
  };

  if (isLoading && sortedTasks.length === 0) { return <h3>Loading Dashboard...</h3>; }

  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.name}</h1>
        <p>Your Tasks Dashboard</p>
      </section>
      <section className="chart-container"><TaskChart /></section>
      <TaskForm />
      <div className="dashboard-columns">
        <section className="content">
          <h2>Tasks Due Today</h2>
          {tasksDueToday && tasksDueToday.length > 0 ? (
            <div className="tasks-condensed">{tasksDueToday.map((task) => (<TaskItem key={task._id} task={task} />))}</div>
          ) : (<h3>No tasks due today</h3>)}
        </section>
        <section className="chart-container">
           <ComparisonChart />
          </section>
        <section className="content">
          <h2>Upcoming Tasks</h2>
          {upcomingTasks && upcomingTasks.length > 0 ? (
            <div className="tasks-condensed">{upcomingTasks.map((task) => (<TaskItem key={task._id} task={task} />))}</div>
          ) : (<h3>No upcoming tasks</h3>)}
        </section>
      </div>
      <section className="content">
        <h2>Stats & Insights</h2>
        <CategoryStats />
      </section>
      <section className="content">
        <div className="content-header">
          <h2>All My Tasks</h2>
          <div className="download-buttons">
            <button className="btn btn-secondary" onClick={() => onDownload('csv')}>CSV</button>
            <button className="btn btn-secondary btn-excel" onClick={() => onDownload('excel')}>Excel</button>
            <button className="btn btn-secondary btn-pdf" onClick={() => onDownload('pdf')}>PDF</button>
          </div>
        </div>
        <div className="sort-container-wrapper">
          <div className="sort-container">
            <label htmlFor="sort">Sort by: </label>
            <select id="sort" value={sortOption} onChange={handleSortChange}>
              <option value="newest-first">Newest First</option>
              <option value="oldest-first">Oldest First</option>
              <option value="due-date">Due Date</option>

            </select>
          </div>
        </div>
        {sortedTasks && sortedTasks.length > 0 ? (
          <div className="tasks">{sortedTasks.map((task) => (<TaskItem key={task._id} task={task} />))}</div>
        ) : (<h3>You have not set any tasks yet</h3>)}
      </section>
    </>
  );
}
export default Dashboard;