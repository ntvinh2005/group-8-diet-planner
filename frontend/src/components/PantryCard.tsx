import type { PantryItem } from "../lib/api";

interface PantryCardProps {
  item: PantryItem;
  onUpdate?: (count: number) => void;
  onDelete?: () => void;
}

export function PantryCard({ item, onUpdate, onDelete }: PantryCardProps) {
  const totalItemCalories = (item.calories || 0) * (item.count || 1);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-600">
            {item.calories} cal × {item.count} = {totalItemCalories} cal
          </p>
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        )}
      </div>
      {item.allergenType.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {item.allergenType.map((allergen) => (
              <span
                key={allergen}
                className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded"
              >
                {allergen}
              </span>
            ))}
          </div>
        </div>
      )}
      {onUpdate && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdate(Math.max(0, item.count - 1))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            −
          </button>
          <span className="font-medium">{item.count}</span>
          <button
            onClick={() => onUpdate(item.count + 1)}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
