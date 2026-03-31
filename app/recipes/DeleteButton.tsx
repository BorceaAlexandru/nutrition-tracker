"use client";

import { deleteRecipe } from "./actions";

export default function DeleteButton({ recipeId }: { recipeId: string }) {
  const handleDelete = async () => {
    //just to be sure
    const isConfirmed = window.confirm("Are you sure?");
    
    if (isConfirmed) {
      await deleteRecipe(recipeId);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
      title="Delete recipe"
    >
      Delete
    </button>
  );
}