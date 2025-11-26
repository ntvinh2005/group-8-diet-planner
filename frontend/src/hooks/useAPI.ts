import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Recipe, Ingredient, User, PantryItem } from "../lib/api";
import { recipeAPI, ingredientAPI, userAPI } from "../lib/api";

export const useRecipes = () => {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: recipeAPI.listRecipes,
  });
};

export const useRecipe = (recipeId: string) => {
  return useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => recipeAPI.getRecipe(recipeId),
    enabled: !!recipeId,
  });
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipe: Partial<Recipe>) => recipeAPI.createRecipe(recipe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
};

export const useUpdateRecipe = (recipeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<Recipe>) =>
      recipeAPI.updateRecipe(recipeId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
    },
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipeId: string) => recipeAPI.deleteRecipe(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
};

export const useRateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ recipeId, rating }: { recipeId: string; rating: number }) =>
      recipeAPI.rateRecipe(recipeId, rating),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe", data._id] });
    },
  });
};

export const useSearchIngredients = (query: string) => {
  return useQuery({
    queryKey: ["ingredients", "search", query],
    queryFn: () => ingredientAPI.searchIngredient(query),
    enabled: query.length > 0,
  });
};

export const useIngredient = (ingredientId: string) => {
  return useQuery({
    queryKey: ["ingredient", ingredientId],
    queryFn: () => ingredientAPI.getIngredient(ingredientId),
    enabled: !!ingredientId,
  });
};

export const useCreateIngredient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ingredient: Partial<Ingredient>) =>
      ingredientAPI.createIngredient(ingredient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });
};

export const useUpdateIngredient = (ingredientId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<Ingredient>) =>
      ingredientAPI.updateIngredient(ingredientId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      queryClient.invalidateQueries({ queryKey: ["ingredient", ingredientId] });
    },
  });
};

export const useDeleteIngredient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ingredientId: string) =>
      ingredientAPI.deleteIngredient(ingredientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });
};

export const useUserProfile = (username: string) => {
  return useQuery({
    queryKey: ["user", username],
    queryFn: () => userAPI.getUserProfile(username),
    enabled: !!username,
  });
};

export const useUpdateUser = (userId: string, username?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<User>) => userAPI.updateUser(userId, updates),
    onSuccess: () => {
      // Invalidate with username if provided, otherwise use broad invalidation
      if (username) {
        queryClient.invalidateQueries({ queryKey: ["user", username] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => userAPI.deleteUser(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useAddPantryItem = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: Partial<PantryItem>) =>
      userAPI.addPantryItem(userId, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
};

export const useUpdatePantryItem = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ingredientId,
      updates,
    }: {
      ingredientId: string;
      updates: Partial<PantryItem>;
    }) => userAPI.updatePantryItem(userId, ingredientId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
};

export const useDeletePantryItem = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ingredientId: string) =>
      userAPI.deletePantryItem(userId, ingredientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
};
