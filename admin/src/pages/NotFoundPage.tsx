import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="admin-empty">
      <h2>Page not found.</h2>
      <p style={{ marginBottom: 16 }}>That route doesn't exist in the admin panel.</p>
      <Link to="/dashboard" className="btn btn--primary">Back to dashboard</Link>
    </div>
  );
}