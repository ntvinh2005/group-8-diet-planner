import axiosInstance from "./axios";

export interface Recipe {
  _id: string;
  name: string;
  shortDesciption: string;
  longDesciption: string;
  numberOfStars: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  _id: string;
  name: string;
  calories: number;
  allergenType: string[];
}

export interface PantryItem {
  sourceId: string;
  name: string;
  calories: number;
  allergenType: string[];
  sourceVersion: number;
  count: number;
}

export interface User {
  userId: string;
  email: string;
  username: string;
  accountType: string;
  healthConditions: Record<string, string>;
  weeklyBudgetCents: number;
  pantry: PantryItem[];
}

export const recipeAPI = {
  listRecipes: async () => {
    const { data } = await axiosInstance.get("/api/recipes");
    return data.results as Recipe[];
  },

  getRecipe: async (recipeId: string) => {
    const { data } = await axiosInstance.get(`/api/recipes/${recipeId}`);
    return data as Recipe;
  },

  createRecipe: async (recipe: Partial<Recipe>) => {
    const { data } = await axiosInstance.post("/api/recipes/create", recipe);
    return data as Recipe;
  },

  updateRecipe: async (recipeId: string, updates: Partial<Recipe>) => {
    const { data } = await axiosInstance.put(
      `/api/recipes/${recipeId}`,
      updates
    );
    return data as Recipe;
  },

  deleteRecipe: async (recipeId: string) => {
    await axiosInstance.delete(`/api/recipes/${recipeId}`);
  },

  rateRecipe: async (recipeId: string, rating: number) => {
    const { data } = await axiosInstance.patch(
      `/api/recipes/${recipeId}/numStars`,
      { rating }
    );
    return data as Recipe;
  },
};

export const ingredientAPI = {
  getIngredient: async (ingredientId: string) => {
    const { data } = await axiosInstance.get(
      `/api/ingredients/${ingredientId}`
    );
    return data as Ingredient;
  },

  searchIngredient: async (query: string) => {
    const { data } = await axiosInstance.get("/api/ingredients/search/query", {
      params: { q: query },
    });
    return data as Ingredient[];
  },

  createIngredient: async (ingredient: Partial<Ingredient>) => {
    const { data } = await axiosInstance.post(
      "/api/ingredients/create",
      ingredient
    );
    return data as Ingredient;
  },

  updateIngredient: async (
    ingredientId: string,
    updates: Partial<Ingredient>
  ) => {
    const { data } = await axiosInstance.put(
      `/api/ingredients/${ingredientId}`,
      updates
    );
    return data as Ingredient;
  },

  deleteIngredient: async (ingredientId: string) => {
    await axiosInstance.delete(`/api/ingredients/${ingredientId}`);
  },
};

export const userAPI = {
  getUserProfile: async (username: string) => {
    const { data } = await axiosInstance.get(`/api/users/profile/${username}`);
    return data.user as User;
  },

  updateUser: async (userId: string, updates: Partial<User>) => {
    const { data } = await axiosInstance.put(`/api/users/${userId}`, updates);
    return data.user as User;
  },

  deleteUser: async () => {
    await axiosInstance.delete("/api/users/delete");
  },

  addPantryItem: async (userId: string, item: Partial<PantryItem>) => {
    const { data } = await axiosInstance.post(
      `/api/users/${userId}/pantry`,
      item
    );
    return data.user as User;
  },

  updatePantryItem: async (
    userId: string,
    ingredientId: string,
    updates: Partial<PantryItem>
  ) => {
    const { data } = await axiosInstance.patch(
      `/api/users/${userId}/pantry/${ingredientId}`,
      updates
    );
    return data.user as User;
  },

  deletePantryItem: async (userId: string, ingredientId: string) => {
    const { data } = await axiosInstance.delete(
      `/api/users/${userId}/pantry/${ingredientId}`
    );
    return data.user as User;
  },
};
