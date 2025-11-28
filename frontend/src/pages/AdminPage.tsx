import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Logo } from "../components/Logo";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Users, FileText, AlertTriangle } from "lucide-react";

export function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 font-semibold text-slate-900 hover:text-slate-700 transition-colors"
          >
            <Logo className="w-10 h-10" />
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                Admin Panel
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                BudgetBits Control
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-700">
              {user?.accountType?.toUpperCase()}
            </span>
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="font-medium">
                Dashboard
              </Button>
            </Link>
            <Link to="/logout">
              <Button variant="destructive" size="sm" className="font-medium">
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-5xl font-bold text-slate-900 tracking-tight">
            Admin Dashboard
          </h2>
          <p className="text-xl text-slate-600">
            Manage users, recipes, and application settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium text-slate-600">
                Total Users
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-50">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold text-slate-900">1,247</div>
              <p className="text-sm text-slate-500">Active members</p>
            </CardContent>
          </Card>

          <Card className="hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium text-slate-600">
                Pending Recipes
              </CardTitle>
              <div className="p-2 rounded-lg bg-orange-50">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold text-slate-900">23</div>
              <p className="text-sm text-slate-500">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium text-slate-600">
                Flagged Content
              </CardTitle>
              <div className="p-2 rounded-lg bg-red-50">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold text-slate-900">5</div>
              <p className="text-sm text-slate-500">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tools */}
        <Card className="border-slate-200/60">
          <CardHeader>
            <CardTitle className="text-2xl">Administrative Tools</CardTitle>
            <CardDescription className="text-base">
              Manage application settings and content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="p-6 border border-slate-200/60 rounded-xl bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                User Management
              </h3>
              <p className="text-base text-slate-600 mb-5">
                View, edit, and manage user accounts and permissions
              </p>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
            <div className="p-6 border border-slate-200/60 rounded-xl bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                Content Moderation
              </h3>
              <p className="text-base text-slate-600 mb-5">
                Review and moderate user-submitted recipes and ingredients
              </p>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
            <div className="p-6 border border-slate-200/60 rounded-xl bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                Application Settings
              </h3>
              <p className="text-base text-slate-600 mb-5">
                Configure system-wide settings and preferences
              </p>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
