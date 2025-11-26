import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile, useUpdateUser } from "../hooks/useAPI";
import { Button } from "../components/Button";

const HEALTH_CONDITIONS = [
  "Diabetes",
  "Hypertension",
  "Celiac",
  "Vegetarian",
  "Vegan",
];

export function ProfilePage() {
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile(user?.username || "");
  const updateUser = useUpdateUser(user?.id || "", user?.username);
  const [formData, setFormData] = useState({
    weeklyBudgetCents: 0,
    healthConditions: {} as Record<string, string>,
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        weeklyBudgetCents: userProfile.weeklyBudgetCents,
        healthConditions: userProfile.healthConditions || {},
      });
    }
  }, [userProfile]);

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      weeklyBudgetCents: parseInt(e.target.value) * 100 || 0,
    }));
  };

  const toggleHealthCondition = (condition: string) => {
    setFormData((prev) => ({
      ...prev,
      healthConditions: {
        ...prev.healthConditions,
        [condition]: prev.healthConditions[condition] ? "" : condition,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser.mutateAsync(formData);
  };

  if (!user) {
    return <div className="p-4">Not logged in</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold text-gray-800">
            BudgetBits
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Profile Settings
          </h1>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Account Information
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-medium">Username:</span> {user.username}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Role:</span>{" "}
                <span className="capitalize">{user.role}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Budget ($)
              </label>
              <input
                type="number"
                value={Math.ceil(formData.weeklyBudgetCents / 100)}
                onChange={handleBudgetChange}
                min={0}
                step={0.01}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Health Conditions
              </label>
              <div className="space-y-2">
                {HEALTH_CONDITIONS.map((condition) => (
                  <label key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!!formData.healthConditions[condition]}
                      onChange={() => toggleHealthCondition(condition)}
                      className="mr-2 rounded"
                    />
                    <span className="text-gray-700">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={updateUser.isPending}
              className="w-full"
            >
              {updateUser.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
