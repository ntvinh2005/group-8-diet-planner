import type { Recipe } from "../lib/api";

interface RecipeCardProps {
  recipe: Recipe;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  canEdit?: boolean;
}

export function RecipeCard({
  recipe,
  onSelect,
  onEdit,
  onDelete,
  canEdit,
}: RecipeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">
          {recipe.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {recipe.shortDesciption}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={
                  i < Math.round(recipe.numberOfStars || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({(recipe.numberOfStars || 0).toFixed(1)})
          </span>
        </div>
        <div className="flex gap-2">
          {onSelect && (
            <button
              onClick={() => onSelect(recipe._id)}
              className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              View
            </button>
          )}
          {canEdit && onEdit && (
            <button
              onClick={() => onEdit(recipe._id)}
              className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
            >
              Edit
            </button>
          )}
          {canEdit && onDelete && (
            <button
              onClick={() => onDelete(recipe._id)}
              className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
