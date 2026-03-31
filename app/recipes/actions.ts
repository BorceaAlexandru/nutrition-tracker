"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
export async function createRecipe(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) throw new Error("Not authorized!");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("User not found.");

  const name = formData.get("name") as string;
  const instructions = formData.get("instructions") as string;
  
  const calories = parseFloat(formData.get("calories") as string);
  const protein = parseFloat(formData.get("protein") as string);
  const carbs = parseFloat(formData.get("carbs") as string);
  const fat = parseFloat(formData.get("fat") as string);

  const ingredientsString = formData.get("ingredientsData") as string;
  const ingredientsList = JSON.parse(ingredientsString);

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

export async function deleteRecipe(recipeId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("Wrong user!");

  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
  
  if (!recipe || recipe.userId !== user.id) {
    throw new Error("Can't delete this recipe!");
  }

  await prisma.recipe.delete({
    where: { id: recipeId }
  });

  revalidatePath("/recipes");
}