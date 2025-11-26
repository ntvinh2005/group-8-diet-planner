import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRecipe, useRateRecipe } from "../hooks/useAPI";
import { Link } from "react-router-dom";

export function RecipePage() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: recipe, isLoading, error } = useRecipe(recipeId || "");
  const rateRecipe = useRateRecipe();
  const [rating, setRating] = useState(0);

  if (!recipeId) return <div className="p-4">Recipe not found</div>;

  if (isLoading) return <div className="p-4">Loading...</div>;

  if (error || !recipe) {
    return <div className="p-4 text-red-600">Error loading recipe</div>;
  }

  const handleRate = async (newRating: number) => {
    setRating(newRating);
    await rateRecipe.mutateAsync({ recipeId, rating: newRating });
  };

  const canEdit =
    user?.accountType === "Creator" || user?.accountType === "Admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/recipes" className="text-gray-700 hover:text-gray-900">
            ← Back to Recipes
          </Link>
          <div className="flex gap-2">
            {canEdit && (
              <button
                onClick={() => navigate(`/recipes/${recipeId}/edit`)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
            )}
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {recipe.image && (
          <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {recipe.name}
          </h1>

          <div className="mb-6">
            <p className="text-gray-600 text-lg">{recipe.shortDesciption}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Rating</h2>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleRate(i + 1)}
                    className="text-3xl cursor-pointer transition-colors"
                  >
                    <span
                      className={
                        i < rating ? "text-yellow-400" : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <span className="text-lg text-gray-600">
                {recipe.numberOfStars
                  ? `${recipe.numberOfStars.toFixed(1)}/5`
                  : "Not rated"}
              </span>
            </div>
          </div>

          {recipe.longDesciption && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {recipe.longDesciption}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
