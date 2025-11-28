import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Logo } from "../components/Logo";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { ArrowRight, UtensilsCrossed, PackageOpen, Carrot } from "lucide-react";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Logo className="w-11 h-11" />
            <div>
              <h1 className="text-xl font-bold text-slate-900">BudgetBits</h1>
              <p className="text-xs text-slate-500 font-medium">
                Smart Meal Planning
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="font-medium">
                Profile
              </Button>
            </Link>
            {user?.accountType === "Admin" && (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="font-medium">
                  Admin
                </Button>
              </Link>
            )}
            <Link to="/logout">
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50 font-medium"
              >
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16 space-y-16">
        {/* Header Section */}
        <div className="space-y-3 text-center md:text-left">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.username}! 👋
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl">
            Plan your meals, save money, and enjoy stress-free cooking.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <Link to="/recipes" className="group">
            <Card className="h-full cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200/60">
              <CardHeader className="space-y-4 pb-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <UtensilsCrossed className="w-7 h-7 text-blue-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <CardTitle className="text-2xl">Recipes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Discover delicious meals and explore culinary options
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/pantry" className="group">
            <Card className="h-full cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200/60">
              <CardHeader className="space-y-4 pb-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-green-50 group-hover:bg-green-100 transition-colors">
                    <PackageOpen className="w-7 h-7 text-green-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                </div>
                <CardTitle className="text-2xl">Pantry</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Manage and organize your stored ingredients
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/ingredients" className="group">
            <Card className="h-full cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200/60">
              <CardHeader className="space-y-4 pb-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-orange-50 group-hover:bg-orange-100 transition-colors">
                    <Carrot className="w-7 h-7 text-orange-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                </div>
                <CardTitle className="text-2xl">Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Browse and search all available ingredients
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Call to Action */}
        <Card className="border-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-3xl font-bold">
              Start Your Meal Planning Journey
            </CardTitle>
            <CardDescription className="text-blue-100 text-lg mt-2">
              Explore recipes, manage your pantry, and create nutritious meal
              plans while staying within your budget.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Link to="/recipes">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Explore Recipes <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
