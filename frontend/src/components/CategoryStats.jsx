// frontend/src/components/CategoryStats.jsx
import { useSelector } from 'react-redux';

function CategoryStats() {
  const { popularCategories, isLoading } = useSelector((state) => state.stats);

  if (isLoading || !popularCategories || popularCategories.length === 0) {
    return <h4>No category data yet.</h4>;
  }

  return (
    <div className="category-stats">
      <h3>Your Top Categories</h3>
      <ul>
        {popularCategories.map((item, index) => (
          <li key={index}>
            <span className="category-name">{item.category}</span>
            <span className="category-count">{item.count} tasks</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryStats;