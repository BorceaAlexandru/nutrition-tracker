"use client";

import { useState } from "react";
import Link from "next/link";
import { createRecipe } from "../actions";

export default function RecipeForm() {
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "g" }
  ]);

  const addIngredientRow = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "g" }]);
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  return (
    <form action={createRecipe} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <input type="text" name="name" className="w-full border border-slate-300 rounded-md px-4 py-2" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Instructions</label>
        <textarea name="instructions" rows={3} className="w-full border border-slate-300 rounded-md px-4 py-2" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-md border border-slate-200">
        <div><label className="block text-sm font-medium text-slate-700 mb-1">KCal</label><input type="number" step="0.1" name="calories" className="w-full border border-slate-300 rounded-md px-3 py-2" required /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Proteins</label><input type="number" step="0.1" name="protein" className="w-full border border-slate-300 rounded-md px-3 py-2" required /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Carbohydrates</label><input type="number" step="0.1" name="carbs" className="w-full border border-slate-300 rounded-md px-3 py-2" required /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Fats</label><input type="number" step="0.1" name="fat" className="w-full border border-slate-300 rounded-md px-3 py-2" required /></div>
      </div>

      <div className="bg-white border border-slate-200 p-4 rounded-md shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Ingredients</h3>
        
        {ingredients.map((ing, index) => (
          <div key={index} className="flex gap-2 mb-3">
            <input type="text" placeholder="Ex: Chicken breast" required
              value={ing.name} onChange={(e) => updateIngredient(index, 'name', e.target.value)}
              className="flex-1 border border-slate-300 rounded-md px-3 py-2" />
              
            <input type="number" step="0.1" placeholder="Qty" required
              value={ing.quantity} onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
              className="w-24 border border-slate-300 rounded-md px-3 py-2" />
              
            <select 
              value={ing.unit} onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
              className="w-20 border border-slate-300 rounded-md px-2 py-2 bg-white"
            >
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="buc">buc</option>
            </select>
          </div>
        ))}
        
        <button type="button" onClick={addIngredientRow} className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2">
          + Add another ingredient
        </button>

        <input type="hidden" name="ingredientsData" value={JSON.stringify(ingredients)} />
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-slate-100">
        <Link href="/recipes" className="px-4 py-2 text-slate-600 font-medium">Abort</Link>
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md font-medium">Save Recipe</button>
      </div>
    </form>
  );
}