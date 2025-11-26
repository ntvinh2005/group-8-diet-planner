import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCreateRecipe, useUpdateRecipe, useRecipe } from "../hooks/useAPI";
import { RecipeForm } from "../components/RecipeForm";
import type { Recipe } from "../lib/api";

export function RecipeFormPage() {
  const { recipeId } = useParams<{ recipeId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: recipe } = useRecipe(
    recipeId && recipeId !== "new" ? recipeId : ""
  );
  const createRecipe = useCreateRecipe();
  const updateRecipeM = useUpdateRecipe(
    recipeId && recipeId !== "new" ? recipeId : ""
  );

  const isEditing = recipeId && recipeId !== "new";
  const canCreate =
    user?.accountType === "Creator" || user?.accountType === "Admin";

  if (!canCreate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            You don't have permission to create recipes
          </p>
          <button
            onClick={() => navigate("/recipes")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: Partial<Recipe>) => {
    try {
      if (isEditing) {
        await updateRecipeM.mutateAsync(data);
        navigate(`/recipes/${recipeId}`);
      } else {
        const result = await createRecipe.mutateAsync(data);
        navigate(`/recipes/${result._id}`);
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Edit Recipe" : "Create Recipe"}
          </h1>
          <button
            onClick={() => navigate("/recipes")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <RecipeForm
            recipe={recipe}
            onSubmit={handleSubmit}
            isLoading={createRecipe.isPending || updateRecipeM.isPending}
          />
        </div>
      </main>
    </div>
  );
}
