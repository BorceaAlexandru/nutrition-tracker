import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "./DeleteButton";

export default async function RecipesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/");
  }

  // 1. Găsim utilizatorul curent în baza de date
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/");
  }

  // 2. Extragem TOATE rețetele care aparțin acestui utilizator
  // Le ordonăm descrescător după data creării (cele mai noi sus)
  const recipes = await prisma.recipe.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {ingredients: true}
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Rețetele Mele</h1>
        <Link 
          href="/recipes/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
        >
          + Adaugă Rețetă
        </Link>
      </div>

      {/* 3. Verificăm dacă are rețete. Dacă nu, arătăm mesajul clasic */}
      {recipes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
          <p className="text-slate-500 text-lg mb-4">
            Încă nu ai adăugat nicio rețetă.
          </p>
        </div>
      ) : (
        /* 4. Dacă are rețete, le afișăm sub formă de carduri (Grid) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-slate-800">{recipe.name}</h2>
                <DeleteButton recipeId={recipe.id} />
              </div>

              {recipe.ingredients.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Ingrediente:</p>
                  <ul className="text-sm text-slate-700 list-inside list-disc">
                    {recipe.ingredients.map(ing => (
                      <li key={ing.id}>{ing.name} - {ing.quantity}{ing.unit}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Afișăm instrucțiunile, dar le scurtăm vizual dacă sunt prea lungi */}
              {recipe.instructions && (
                <p className="text-slate-600 mb-6 text-sm line-clamp-3">
                  {recipe.instructions}
                </p>
              )}
              
              {/* Bara de macronutrienți, împinsă mereu în partea de jos a cardului */}
              <div className="mt-auto grid grid-cols-4 gap-2 text-center text-xs text-slate-500 bg-slate-50 py-3 rounded-lg border border-slate-100">
                <div>
                  <span className="block text-slate-800 font-bold text-sm">{recipe.calories}</span>
                  kcal
                </div>
                <div>
                  <span className="block text-slate-800 font-bold text-sm">{recipe.protein}g</span>
                  Proteine
                </div>
                <div>
                  <span className="block text-slate-800 font-bold text-sm">{recipe.carbs}g</span>
                  Carbo
                </div>
                <div>
                  <span className="block text-slate-800 font-bold text-sm">{recipe.fat}g</span>
                  Grăsimi
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}