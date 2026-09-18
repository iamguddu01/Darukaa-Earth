import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Geospatial Analytics for the Earth
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Darukaa.Earth is a comprehensive platform for managing and visualizing carbon and biodiversity projects. Track geographical sites and analyze performance over time.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/signup"
              className="rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Get started
            </Link>
            <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
              Log in <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
