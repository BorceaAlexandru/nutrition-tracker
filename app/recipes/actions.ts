"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
export async function createRecipe(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) throw new Error("Nu ești autorizat!");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("Utilizatorul nu a fost găsit.");

  const name = formData.get("name") as string;
  const instructions = formData.get("instructions") as string;
  
  const calories = parseFloat(formData.get("calories") as string);
  const protein = parseFloat(formData.get("protein") as string);
  const carbs = parseFloat(formData.get("carbs") as string);
  const fat = parseFloat(formData.get("fat") as string);

  // Extragem lista de ingrediente din câmpul ascuns și o transformăm înapoi în listă
  const ingredientsString = formData.get("ingredientsData") as string;
  const ingredientsList = JSON.parse(ingredientsString);

  // Prisma va crea rețeta, va genera un ID pentru ea, și va lega automat ingredientele de ea!
  await prisma.recipe.create({
    data: {
      name: name,
      instructions: instructions,
      calories: calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      userId: user.id,
      ingredients: {
        create: ingredientsList.map((ing: any) => ({
          name: ing.name,
          quantity: parseFloat(ing.quantity),
          unit: ing.unit
        }))
      }
    },
  });

  redirect("/recipes");
}

// Adaugă această funcție NOUĂ la finalul fișierului:
export async function deleteRecipe(recipeId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) throw new Error("Neautorizat");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("Utilizator negăsit");

  // 1. Găsim rețeta ca să ne asigurăm că aparține acestui utilizator (securitate!)
  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
  
  if (!recipe || recipe.userId !== user.id) {
    throw new Error("Nu poți șterge această rețetă!");
  }

  // 2. Ștergem rețeta (Prisma va șterge automat și ingredientele datorită CASCADE)
  await prisma.recipe.delete({
    where: { id: recipeId }
  });

  // 3. Spunem paginii de rețete să se reîncarce cu noile date
  revalidatePath("/recipes");
}