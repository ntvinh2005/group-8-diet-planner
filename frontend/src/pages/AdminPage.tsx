import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <nav className="bg-white shadow-sm border-b border-red-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-lg">
              👑
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-xs text-gray-500">BudgetBits Control Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
              {user?.role?.toUpperCase()}
            </span>
            <Link
              to="/dashboard"
              className="inline-flex items-center h-10 px-4 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <span className="mr-2">📊</span>
              Dashboard
            </Link>
            <Link
              to="/logout"
              className="inline-flex items-center h-10 px-4 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <span className="mr-2">🚪</span>
              Sign Out
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Admin Panel
          </h2>
          <p className="text-gray-600">
            Manage users, recipes, and application settings.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">1,247</p>
                <p className="text-xs text-gray-400 mt-1">Active members</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Recipes</p>
                <p className="text-3xl font-bold text-orange-600">23</p>
                <p className="text-xs text-gray-400 mt-1">Awaiting review</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Flagged Content</p>
                <p className="text-3xl font-bold text-red-600">5</p>
                <p className="text-xs text-gray-400 mt-1">Requires attention</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Administrative Tools
          </h3>
          <p className="text-gray-600 mb-6">
            User management and content moderation features are coming soon.
          </p>
          <div className="flex gap-4">
            <button
              className="h-12 px-6 rounded-2xl bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            >
              Manage Users
            </button>
            <button
              className="h-12 px-6 rounded-2xl bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            >
              Review Content
            </button>
            <button
              className="h-12 px-6 rounded-2xl bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            >
              Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
