    import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"];

export default async function PlannerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-EN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Meal Planner</h1>
          <p className="text-slate-500 mt-1 capitalize">{formattedDate}</p>
        </div>
        
        <div className="flex space-x-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md transition-colors">&larr; Yesterday</button>
          <button className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 rounded-md">Today</button>
          <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md transition-colors">Tomorrow &rarr;</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MEAL_TYPES.map((meal) => (
          <div key={meal} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
              <h2 className="font-bold text-slate-700">{meal}</h2>
              <button className="text-sm bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 px-3 py-1 rounded-md transition-colors">
                + Add
              </button>
            </div>
            
            <div className="p-6 text-center">
              <p className="text-slate-400 text-sm">
                Nothing planned for {meal.toLowerCase()}.
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}