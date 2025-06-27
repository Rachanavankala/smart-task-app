// frontend/src/components/AllTasksList.jsx
import { useSelector, useDispatch } from 'react-redux';
import { setSortOption, selectSortedTasks } from '../features/tasks/taskSlice';
import TaskItem from './TaskItem';
import taskService from '../features/tasks/taskService';
import { toast } from 'react-toastify';

function AllTasksList() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { sortOption } = useSelector((state) => state.task);
    const sortedTasks = useSelector(selectSortedTasks);

    const handleSortChange = (e) => { dispatch(setSortOption(e.target.value)); };
    const onDownload = (format) => {
        if (!user) { return toast.error('You must be logged in.'); }
        toast.info(`Preparing your ${format.toUpperCase()} download...`);
        taskService.downloadTasks(user.token, format).catch((err) => toast.error('Download failed.'));
    };

    return (
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
                        <option value="newest-first">Newest</option>
                        <option value="oldest-first">Oldest</option>
                        <option value="due-date">Due Date</option>
                    </select>
                </div>
            </div>
            {sortedTasks.length > 0 ? (
                <div className="tasks">{sortedTasks.map((task) => <TaskItem key={task._id} task={task} />)}</div>
            ) : (<h3>You have not set any tasks yet</h3>)}
        </section>
    );
}
export default AllTasksList;