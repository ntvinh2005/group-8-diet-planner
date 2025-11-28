import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSearchRecipes, useDeleteRecipe } from "../hooks/useAPI";
import { RecipeCard } from "../components/RecipeCard";
import { Logo } from "../components/Logo";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

export function RecipesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: recipes, isLoading, error } = useSearchRecipes(searchTerm);
  const deleteRecipe = useDeleteRecipe();

  const filteredRecipes = recipes;

  const handleDelete = async (recipeId: string) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      await deleteRecipe.mutateAsync(recipeId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 font-semibold text-slate-900 hover:text-slate-700 transition-colors"
          >
            <Logo className="w-8 h-8" />
            <span className="text-xl">BudgetBits</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/recipes/new")}
              size="sm"
              className="font-medium shadow-sm"
            >
              + New Recipe
            </Button>
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="font-medium">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <div className="space-y-5">
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
            Recipes
          </h1>
          <div className="max-w-2xl">
            <Input
              type="text"
              placeholder="Search recipes by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 text-base shadow-sm"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <span className="text-lg text-slate-600 font-medium">
              Loading delicious recipes...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200/60 bg-red-50/50">
            <CardContent className="pt-8 pb-8 flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-100">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-red-700 font-medium text-lg">
                Error loading recipes. Please try again.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Recipes Grid */}
        {filteredRecipes && filteredRecipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onSelect={(id) => navigate(`/recipes/${id}`)}
                onEdit={(id) => navigate(`/recipes/${id}/edit`)}
                onDelete={() => handleDelete(recipe._id)}
                canEdit={true}
              />
            ))}
          </div>
        ) : !isLoading ? (
          <Card className="border-slate-200/60">
            <CardContent className="pt-16 pb-16 text-center space-y-5">
              <div className="p-4 rounded-2xl bg-slate-100 w-fit mx-auto">
                <Logo className="w-16 h-16" />
              </div>
              <div className="space-y-2">
                <p className="text-slate-900 font-semibold text-xl">
                  {searchTerm ? "No recipes found" : "No recipes available"}
                </p>
                <p className="text-slate-600">
                  {searchTerm
                    ? "Try adjusting your search"
                    : "Get started by creating your first recipe"}
                </p>
              </div>
              {!searchTerm && (
                <Button
                  onClick={() => navigate("/recipes/new")}
                  className="mt-6"
                  size="lg"
                >
                  Create First Recipe
                </Button>
              )}
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  );
}
