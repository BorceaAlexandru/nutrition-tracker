import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import RecipeForm from "./RecipeForm";

export default async function NewRecipePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/recipes" className="text-slate-500 hover:text-slate-700 transition-colors">
          &larr; Back to Recipes
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">Add a new recipe.</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <RecipeForm />
      </div>
    </main>
  );
}