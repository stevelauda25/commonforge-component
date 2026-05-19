import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="mt-2 text-muted">Page not found.</p>
      <Link to="/" className="mt-4 inline-block text-brand underline">
        Back to Home
      </Link>
    </div>
  );
}
