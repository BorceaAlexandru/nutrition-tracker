"use client";

import { deleteMealFromPlan } from "./actions";

export default function DeleteMealButton({ planId }: { planId: string }) {
  const handleDelete = async () => {
    await deleteMealFromPlan(planId);
  };

  return (
    <button 
      onClick={handleDelete} 
      className="ml-3 text-red-500 hover:text-red-700 font-bold text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
      title="Delete meal"
    >
      ✕
    </button>
  );
}