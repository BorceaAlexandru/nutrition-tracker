"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addMealToPlan(recipeId: string, date: Date, mealType: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("Utilizator negăsit");

  await prisma.mealPlan.create({
    data: {
      userId: user.id,
      recipeId: recipeId,
      date: date, 
      mealType: mealType 
    }
  });

  revalidatePath("/planner");
}

export async function deleteMealFromPlan(planId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) throw new Error("Neautorizat");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("Utilizator negăsit");

  //delete planned meal
  await prisma.mealPlan.delete({
    where: { id: planId }
  });

  revalidatePath("/planner");
}