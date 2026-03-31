import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AddMealModal from "./AddMealModal";
import DeleteMealButton from "./DeleteMealButton"; 
export const dynamic = "force-dynamic";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"];

export default async function PlannerPage({ searchParams }: { searchParams: any }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) redirect("/");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/");

  const params = await searchParams;
  
  const targetDateString = params?.date || new Date().toISOString().split('T')[0];
  const targetDate = new Date(targetDateString);

  const yesterday = new Date(targetDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const tomorrow = new Date(targetDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const todayStr = new Date().toISOString().split('T')[0];

  const formattedDate = targetDate.toLocaleDateString("en-EN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const myRecipes = await prisma.recipe.findMany({
    where: { userId: user.id },
    select: { id: true, name: true },
  });

  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const todaysPlans = await prisma.mealPlan.findMany({
    where: {
      userId: user.id,
      date: { gte: startOfDay, lte: endOfDay }
    },
    include: { recipe: true }
  });

  return (
        <main key={targetDateString} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">  
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Meal Planner</h1>
          <p className="text-slate-500 mt-1 capitalize">{formattedDate}</p>
        </div>
        
        <Link 
          href={`/planner/shopping-list?date=${targetDateString}`}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium shadow-sm transition-colors"
        >
          Generate Shopping List
        </Link>
      </div>
      
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <Link href={`/planner?date=${yesterdayStr}`} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md transition-colors">&larr; Yesterday</Link>
          <Link href={`/planner?date=${todayStr}`} className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 rounded-md">Today</Link>
          <Link href={`/planner?date=${tomorrowStr}`} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md transition-colors">Tomorrow &rarr;</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MEAL_TYPES.map((meal) => {
          const plannedForThisMeal = todaysPlans.filter(p => p.mealType === meal);

          return (
            <div key={meal} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
                <h2 className="font-bold text-slate-700">{meal}</h2>
                <AddMealModal mealType={meal} date={targetDate} recipes={myRecipes} />
              </div>
              
              <div className="p-6">
                {plannedForThisMeal.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center">Nothing planned.</p>
                ) : (
                  <ul className="space-y-3">
                    {plannedForThisMeal.map(plan => (
                      <li key={plan.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-md border border-slate-100">
                        <span className="font-medium text-slate-800">{plan.recipe.name}</span>
                        <div className="flex items-center">
                          <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
                            {plan.recipe.calories} kcal
                          </span>
                          <DeleteMealButton planId={plan.id} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}