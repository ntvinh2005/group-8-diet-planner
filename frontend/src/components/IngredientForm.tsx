import { useState } from "react";
import type { Ingredient } from "../lib/api";
import { Button } from "./Button";
import { TextField } from "./TextField";

const ALLERGEN_OPTIONS = ["Milk", "Eggs", "Nuts", "Sesame", "Wheat", "Soy"];

interface IngredientFormProps {
  ingredient?: Ingredient;
  onSubmit: (data: Partial<Ingredient>) => void;
  isLoading?: boolean;
}

export function IngredientForm({
  ingredient,
  onSubmit,
  isLoading,
}: IngredientFormProps) {
  const [formData, setFormData] = useState({
    name: ingredient?.name || "",
    calories: ingredient?.calories || 0,
    allergenType: ingredient?.allergenType || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "calories" ? parseInt(value) || 0 : value,
    }));
  };

  const toggleAllergen = (allergen: string) => {
    setFormData((prev) => ({
      ...prev,
      allergenType: prev.allergenType.includes(allergen)
        ? prev.allergenType.filter((a) => a !== allergen)
        : [...prev.allergenType, allergen],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        label="Ingredient Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Calories"
        name="calories"
        type="number"
        value={formData.calories}
        onChange={handleChange}
        min={0}
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Allergens
        </label>
        <div className="space-y-2">
          {ALLERGEN_OPTIONS.map((allergen) => (
            <label key={allergen} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.allergenType.includes(allergen)}
                onChange={() => toggleAllergen(allergen)}
                className="mr-2 rounded"
              />
              <span className="text-sm text-gray-700">{allergen}</span>
            </label>
          ))}
        </div>
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading
          ? "Saving..."
          : ingredient
          ? "Update Ingredient"
          : "Create Ingredient"}
      </Button>
    </form>
  );
}
