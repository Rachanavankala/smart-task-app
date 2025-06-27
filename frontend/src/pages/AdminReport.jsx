// frontend/src/pages/AdminReport.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { generateReport, resetReport } from '../features/admin/adminSlice';
import { toast } from 'react-toastify';

function AdminReport() {
  const dispatch = useDispatch();
  const { report, isLoading, isError, message } = useSelector((state) => state.admin);

  useEffect(() => {
    if (isError) toast.error(message);
    // Cleanup when leaving the page
    return () => dispatch(resetReport());
  }, [isError, message, dispatch]);

  const handleGenerate = () => dispatch(generateReport());

  return (
    <>
      <Link to="/admin/users" className="btn btn-secondary" style={{marginBottom: '20px', display: 'inline-block'}}>
        ← Back to User List
      </Link>
      <section className="heading">
        <h1>Critical Tasks Report</h1>
        <p>Generate an AI-powered summary of all overdue tasks across all users.</p>
      </section>
      <div className="form-group">
        <button className="btn btn-block" onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'Generating Report...' : 'Generate AI Report'}
        </button>
      </div>
      {report && (
        <div className="report-container">
          <h3>Generated Executive Report:</h3>
          <p>{report.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>
        </div>
      )}
    </>
  );
}
export default AdminReport;