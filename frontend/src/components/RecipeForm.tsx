import { useState, useEffect } from "react";
import type { Recipe } from "../lib/api";
import { Button } from "./Button";
import { TextField } from "./TextField";

interface RecipeFormProps {
  recipe?: Recipe;
  onSubmit: (data: Partial<Recipe>) => void;
  isLoading?: boolean;
}

export function RecipeForm({ recipe, onSubmit, isLoading }: RecipeFormProps) {
  const [formData, setFormData] = useState({
    name: recipe?.name || "",
    shortDesciption: recipe?.shortDesciption || "",
    longDesciption: recipe?.longDesciption || "",
    image: recipe?.image || "",
  });

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name || "",
        shortDesciption: recipe.shortDesciption || "",
        longDesciption: recipe.longDesciption || "",
        image: recipe.image || "",
      });
    }
  }, [recipe]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        label="Recipe Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Short Description"
        name="shortDesciption"
        value={formData.shortDesciption}
        onChange={handleChange}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Long Description
        </label>
        <textarea
          name="longDesciption"
          value={formData.longDesciption}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <TextField
        label="Image URL"
        name="image"
        value={formData.image}
        onChange={handleChange}
      />
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : recipe ? "Update Recipe" : "Create Recipe"}
      </Button>
    </form>
  );
}
