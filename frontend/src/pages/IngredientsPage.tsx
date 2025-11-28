import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useSearchIngredients,
  useDeleteIngredient,
  useAddPantryItem,
} from "../hooks/useAPI";
import { IngredientCard } from "../components/IngredientCard";
import { Logo } from "../components/Logo";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Loader2 } from "lucide-react";

export function IngredientsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: ingredients, isLoading } = useSearchIngredients(searchTerm);
  const deleteIngredient = useDeleteIngredient();
  const addPantryItem = useAddPantryItem(user?.id || "");

  const handleDelete = async (ingredientId: string) => {
    if (confirm("Are you sure you want to delete this ingredient?")) {
      await deleteIngredient.mutateAsync(ingredientId);
    }
  };

  const handleAddToPantry = async (ingredientId: string) => {
    try {
      await addPantryItem.mutateAsync({ sourceId: ingredientId, count: 1 });
      alert("Added to pantry!");
    } catch (error) {
      console.error("Failed to add to pantry:", error);
      alert("Failed to add to pantry");
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
              onClick={() => navigate("/ingredients/new")}
              size="sm"
              className="font-medium shadow-sm"
            >
              + New Ingredient
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
            Ingredients
          </h1>
          <div className="max-w-2xl">
            <Input
              type="text"
              placeholder="Search ingredients by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 text-base shadow-sm"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
            <span className="text-lg text-slate-600 font-medium">
              Loading ingredients...
            </span>
          </div>
        )}

        {/* Ingredients Grid */}
        {ingredients && ingredients.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ingredients.map((ingredient) => (
              <IngredientCard
                key={ingredient._id}
                ingredient={ingredient}
                canEdit={true}
                onEdit={(id) => navigate(`/ingredients/${id}/edit`)}
                onDelete={(id) => handleDelete(id)}
                onAddToPantry={(id) => handleAddToPantry(id)}
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
                  {searchTerm
                    ? "No ingredients found"
                    : "Search for ingredients..."}
                </p>
                <p className="text-slate-600">
                  {searchTerm
                    ? "Try adjusting your search"
                    : "Start typing to find ingredients"}
                </p>
              </div>
              {!searchTerm && (
                <Button
                  onClick={() => navigate("/ingredients/new")}
                  className="mt-6"
                  size="lg"
                >
                  Add New Ingredient
                </Button>
              )}
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  );
}
