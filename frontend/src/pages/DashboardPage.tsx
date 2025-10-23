import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                BudgetBits
              </h1>
              <p className="text-xs text-gray-500">
                Your meal planning companion
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="inline-flex items-center h-10 px-4 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <span className="mr-2">⚙️</span>
                Admin
              </Link>
            )}
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
            Welcome back, {user?.username}! 👋
          </h2>
          <p className="text-gray-600">
            Plan your meals, save money, and enjoy stress-free cooking.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Pantry Items Expiring
                </p>
                <p className="text-3xl font-bold text-green-600">12</p>
                <p className="text-xs text-gray-400 mt-1">
                  Check your pantry soon
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">🥗</span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Saved This Week</p>
                <p className="text-3xl font-bold text-amber-600">$18</p>
                <p className="text-xs text-gray-400 mt-1">
                  Keep up the great work!
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Ready to start planning?
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first meal plan and start saving money today.
          </p>
          <button className="inline-flex items-center justify-center h-12 px-8 text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
            Plan My Meals
          </button>
        </div>
      </main>
    </div>
  );
}
