import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { LogoutPage } from "../pages/LogoutPage";
import { DashboardPage } from "../pages/DashboardPage";
import { AdminPage } from "../pages/AdminPage";
import { RecipesPage } from "../pages/RecipesPage";
import { RecipePage } from "../pages/RecipePage";
import { RecipeFormPage } from "../pages/RecipeFormPage";
import { IngredientsPage } from "../pages/IngredientsPage";
import { IngredientFormPage } from "../pages/IngredientFormPage";
import { PantryPage } from "../pages/PantryPage";
import { ProfilePage } from "../pages/ProfilePage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { RoleGuard } from "../components/RoleGuard";

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/logout",
    element: <LogoutPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/recipes",
        element: <RecipesPage />,
      },
      {
        path: "/recipes/new",
        element: <RecipeFormPage />,
      },
      {
        path: "/recipes/:recipeId",
        element: <RecipePage />,
      },
      {
        path: "/recipes/:recipeId/edit",
        element: <RecipeFormPage />,
      },
      {
        path: "/ingredients",
        element: <IngredientsPage />,
      },
      {
        path: "/ingredients/new",
        element: <IngredientFormPage />,
      },
      {
        path: "/ingredients/:ingredientId/edit",
        element: <IngredientFormPage />,
      },
      {
        path: "/pantry",
        element: <PantryPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        element: <RoleGuard />,
        children: [
          {
            path: "/admin",
            element: <AdminPage />,
          },
        ],
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
