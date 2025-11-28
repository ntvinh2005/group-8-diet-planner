import type { Ingredient } from "../lib/api";

interface IngredientCardProps {
  ingredient: Ingredient;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddToPantry?: (id: string) => void;
  canEdit?: boolean;
}

export function IngredientCard({
  ingredient,
  onSelect,
  onEdit,
  onDelete,
  onAddToPantry,
  canEdit,
}: IngredientCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4">
      <h3 className="font-semibold text-lg text-gray-800 mb-2">
        {ingredient.name}
      </h3>
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">
          Calories: <span className="font-medium">{ingredient.calories}</span>
        </p>
        {ingredient.allergenType.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Allergens:</p>
            <div className="flex flex-wrap gap-2">
              {ingredient.allergenType.map((allergen) => (
                <span
                  key={allergen}
                  className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                >
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {onAddToPantry && (
          <button
            onClick={() => onAddToPantry(ingredient._id)}
            className="flex-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm min-w-fit"
          >
            Add to Pantry
          </button>
        )}
        {onSelect && (
          <button
            onClick={() => onSelect(ingredient._id)}
            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            View
          </button>
        )}
        {canEdit && onEdit && (
          <button
            onClick={() => onEdit(ingredient._id)}
            className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
          >
            Edit
          </button>
        )}
        {canEdit && onDelete && (
          <button
            onClick={() => onDelete(ingredient._id)}
            className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
