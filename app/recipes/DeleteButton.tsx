"use client";

import { deleteRecipe } from "./actions";

export default function DeleteButton({ recipeId }: { recipeId: string }) {
  const handleDelete = async () => {
    // Îi cerem utilizatorului confirmarea înainte de a șterge
    const isConfirmed = window.confirm("Ești sigur că vrei să ștergi această rețetă? Acțiunea este ireversibilă.");
    
    if (isConfirmed) {
      await deleteRecipe(recipeId);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
      title="Șterge rețeta"
    >
      Șterge
    </button>
  );
}