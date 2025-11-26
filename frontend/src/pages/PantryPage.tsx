import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useUserProfile,
  useDeletePantryItem,
  useAddPantryItem,
} from "../hooks/useAPI";
import { PantryCard } from "../components/PantryCard";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Package, Flame, DollarSign } from "lucide-react";

export function PantryPage() {
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile(user?.username || "");
  const deletePantryItem = useDeletePantryItem(user?.id || "");
  const addPantryItem = useAddPantryItem(user?.id || "");
  const [searchTerm, setSearchTerm] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card>
          <CardContent className="pt-6">
            <p className="text-slate-600">Not logged in</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalCalories =
    userProfile?.pantry.reduce(
      (sum, item) => sum + item.calories * item.count,
      0
    ) || 0;
  const filteredPantry = userProfile?.pantry.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteItem = async (ingredientId: string) => {
    if (confirm("Remove this item from your pantry?")) {
      await deletePantryItem.mutateAsync(ingredientId);
    }
  };

  const handleUpdateCount = async (ingredientId: string, count: number) => {
    await addPantryItem.mutateAsync({
      sourceId: ingredientId,
      count,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 font-semibold text-slate-900 hover:text-slate-700 transition-colors"
          >
            <div className="p-2 rounded-lg bg-green-50">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xl">BudgetBits</span>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="font-medium">
              Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
            Your Pantry
          </h1>
          <p className="text-xl text-slate-600">
            Manage your stored ingredients
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium text-slate-600">
                Total Items
              </CardTitle>
              <div className="p-2 rounded-lg bg-green-50">
                <Package className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {userProfile?.pantry.length || 0}
              </div>
              <p className="text-sm text-slate-500 mt-2">Items in stock</p>
            </CardContent>
          </Card>
          <Card className="hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium text-slate-600">
                Total Calories
              </CardTitle>
              <div className="p-2 rounded-lg bg-orange-50">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {totalCalories}
              </div>
              <p className="text-sm text-slate-500 mt-2">Estimated total</p>
            </CardContent>
          </Card>
          <Card className="hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium text-slate-600">
                Weekly Budget
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-50">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                ${(userProfile?.weeklyBudgetCents || 0) / 100}
              </div>
              <p className="text-sm text-slate-500 mt-2">Allocated budget</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="max-w-2xl">
          <Input
            type="text"
            placeholder="Search pantry items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 text-base shadow-sm"
          />
        </div>

        {/* Pantry Items */}
        {filteredPantry && filteredPantry.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPantry.map((item) => (
              <PantryCard
                key={item.sourceId}
                item={item}
                onUpdate={(count) => handleUpdateCount(item.sourceId, count)}
                onDelete={() => handleDeleteItem(item.sourceId)}
              />
            ))}
          </div>
        ) : (
          <Card className="border-slate-200/60">
            <CardContent className="pt-16 pb-16 text-center space-y-5">
              <div className="p-4 rounded-2xl bg-slate-100 w-fit mx-auto">
                <Package className="w-16 h-16 text-slate-400" />
              </div>
              <div className="space-y-2">
                <p className="text-slate-900 font-semibold text-xl">
                  {searchTerm ? "No items found" : "Your pantry is empty"}
                </p>
                <p className="text-slate-600">
                  {searchTerm
                    ? "Try adjusting your search"
                    : "Start adding ingredients to your pantry"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
