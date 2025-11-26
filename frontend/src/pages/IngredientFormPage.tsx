import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useCreateIngredient,
  useUpdateIngredient,
  useIngredient,
} from "../hooks/useAPI";
import { IngredientForm } from "../components/IngredientForm";
import type { Ingredient } from "../lib/api";

export function IngredientFormPage() {
  const { ingredientId } = useParams<{ ingredientId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: ingredient } = useIngredient(
    ingredientId && ingredientId !== "new" ? ingredientId : ""
  );
  const createIngredient = useCreateIngredient();
  const updateIngredientM = useUpdateIngredient(
    ingredientId && ingredientId !== "new" ? ingredientId : ""
  );

  const isEditing = ingredientId && ingredientId !== "new";
  const canCreate =
    user?.accountType === "Creator" || user?.accountType === "Admin";

  if (!canCreate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            You don't have permission to create ingredients
          </p>
          <button
            onClick={() => navigate("/ingredients")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Ingredients
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: Partial<Ingredient>) => {
    try {
      if (isEditing) {
        await updateIngredientM.mutateAsync(data);
        navigate("/ingredients");
      } else {
        await createIngredient.mutateAsync(data);
        navigate("/ingredients");
      }
    } catch (error) {
      console.error("Error saving ingredient:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Edit Ingredient" : "Create Ingredient"}
          </h1>
          <button
            onClick={() => navigate("/ingredients")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <IngredientForm
            ingredient={ingredient}
            onSubmit={handleSubmit}
            isLoading={
              createIngredient.isPending || updateIngredientM.isPending
            }
          />
        </div>
      </main>
    </div>
  );
}
