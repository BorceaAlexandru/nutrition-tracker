"use client";

import { useState } from "react";
import { addMealToPlan } from "./actions";

type Recipe = { id: string; name: string };

export default function AddMealModal({ mealType, date, recipes }: { mealType: string; date: Date; recipes: Recipe[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState("");

  const handleSave = async () => {
    if (!selectedRecipe) return;
    await addMealToPlan(selectedRecipe, date, mealType);
    setIsOpen(false); 
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="text-sm bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 px-3 py-1 rounded-md transition-colors"
      >
        + Add
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Add recipe for {mealType}</h3>
            
            <select 
              className="w-full border border-slate-300 rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedRecipe}
              onChange={(e) => setSelectedRecipe(e.target.value)}
            >
              <option value="">-- Select a recipe --</option>
              {recipes.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setIsOpen(false)} 
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-md transition-colors"
              >
                Abort
              </button>
              <button 
                onClick={handleSave} 
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}