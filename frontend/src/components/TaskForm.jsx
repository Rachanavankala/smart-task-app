// frontend/src/components/TaskForm.jsx
// --- FINAL, CORRECTED VERSION ---

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  createTask,
  getTasks,
  getTasksDueToday,
  getUpcomingTasks,
} from '../features/tasks/taskSlice';
import aiService from '../features/ai/aiService';
import { toast } from 'react-toastify';

function TaskForm() {
  const [formData, setFormData] = useState({
    text: '',
    description: '',
    category: '',
    dueDate: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const { text, description, category, dueDate } = formData;
  const dispatch = useDispatch();

  // useEffect for category prediction
  useEffect(() => {
    if (!text || text.length < 5) { // Don't predict for very short text
      return;
    }
    const timer = setTimeout(() => {
      aiService.predictCategory(text)
        .then((data) => {
          // Only update if the category field is still empty
          if (!formData.category) {
            setFormData((prevState) => ({ ...prevState, category: data.category }));
          }
        })
        .catch((err) => console.error("Category prediction failed:", err));
    }, 1200); // Wait a little longer
    return () => clearTimeout(timer);
  }, [text, formData.category]); // Re-added formData.category to dependency array


  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // --- THIS FUNCTION IS NOW CORRECT ---
  const handleGenerateDesc = async () => {
    if (!text) {
      toast.error('Please enter a Task Name first.');
      return;
    }
    setIsGenerating(true);
    try {
      const data = await aiService.generateDescription(text);
      // This correctly updates only the description field
      setFormData((prevState) => ({ ...prevState, description: data.description }));
    } catch (error) {
      toast.error('Failed to generate AI description.');
    } finally {
      // This ensures the button is always re-enabled
      setIsGenerating(false);
    }
  };

  // --- THIS FUNCTION IS NOW CORRECT ---
  const onSubmit = (e) => {
    e.preventDefault();
    // It now dispatches the entire formData object
    dispatch(createTask(formData))
      .unwrap()
      .then(() => {
        toast.success('Task Added!');
        setFormData({ text: '', description: '', category: '', dueDate: '' }); // Reset form
        // Re-fetch all lists to keep the UI in sync
        dispatch(getTasks());
        dispatch(getTasksDueToday());
        dispatch(getUpcomingTasks());
      })
      .catch((err) => {
        const message = typeof err === 'string' ? err : 'Failed to create task.';
        toast.error(message);
      });
  };

  return (
    <section className="form">
      <form onSubmit={onSubmit}>
        {/* Task Name Input */}
        <div className="form-group">
          <label htmlFor="text">Task Name</label>
          <input
            type="text"
            name="text"
            id="text"
            value={text}
            onChange={onChange}
            required
          />
        </div>
        {/* Description Input & Button */}
        <div className="form-group">
          <div className="description-header">
            <label htmlFor="description">Description</label>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleGenerateDesc}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate AI'}
            </button>
          </div>
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={onChange}
            rows="4"
          ></textarea>
        </div>
        {/* Category Input */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            name="category"
            id="category"
            value={category}
            onChange={onChange}
            placeholder="AI will predict this..."
          />
        </div>
        {/* Due Date Input */}
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            value={dueDate}
            onChange={onChange}
          />
        </div>
        {/* Submit Button */}
        <div className="form-group">
          <button className="btn btn-block" type="submit">
            Add Task
          </button>
        </div>
      </form>
    </section>
  );
}

export default TaskForm;