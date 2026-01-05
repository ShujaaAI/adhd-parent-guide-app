import React, { useState } from 'react';
import { Recipe } from '../types';

const recipes: Recipe[] = [
    { title: 'Oatmeal Power Bowl', category: 'Breakfast', description: 'Oats with berries, nuts, and a sprinkle of cinnamon for a protein-packed start.', ingredients: ['Oats', 'Berries', 'Almonds', 'Cinnamon'] },
    { title: 'Chicken & Veggie Skewers', category: 'Lunch', description: 'Colorful skewers with chicken, bell peppers, and zucchini. Fun to eat!', ingredients: ['Chicken Breast', 'Bell Peppers', 'Zucchini', 'Olive Oil'] },
    { title: 'Salmon & Sweet Potato', category: 'Dinner', description: 'Baked salmon rich in Omega-3s with nutrient-dense sweet potato fries.', ingredients: ['Salmon Fillet', 'Sweet Potato', 'Broccoli', 'Lemon'] },
    { title: 'Apple Slice "Donuts"', category: 'Snack', description: 'Core an apple and slice into rings. Top with yogurt and seeds.', ingredients: ['Apple', 'Yogurt', 'Chia Seeds', 'Sunflower Seeds'] },
];

const beneficialFoods = ['Fatty Fish (Salmon, Tuna)', 'Lean Meats (Chicken, Turkey)', 'Eggs', 'Nuts & Seeds', 'Berries', 'Leafy Greens', 'Whole Grains', 'Beans & Lentils'];
const foodsToLimit = ['Sugary Drinks & Snacks', 'Processed Foods', 'Artificial Colors & Dyes', 'High-Fructose Corn Syrup', 'Refined Grains (White Bread)'];


const NourishScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Recipes');

    return (
        <div className="p-4 space-y-4">
            <div className="p-4 bg-white rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-center text-slate-800">ADHD-Friendly Nutrition</h2>
                <p className="text-sm text-center text-slate-500 mt-1">Fueling focus and well-being.</p>
            </div>
            
            <div className="flex justify-center bg-slate-200 rounded-full p-1">
                <button onClick={() => setActiveTab('Recipes')} className={`w-full py-2 text-sm font-semibold rounded-full ${activeTab === 'Recipes' ? 'bg-white text-teal-600 shadow' : 'text-slate-600'}`}>Recipes</button>
                <button onClick={() => setActiveTab('Foods')} className={`w-full py-2 text-sm font-semibold rounded-full ${activeTab === 'Foods' ? 'bg-white text-teal-600 shadow' : 'text-slate-600'}`}>Food Guide</button>
            </div>

            {activeTab === 'Recipes' && (
                <div className="space-y-3">
                    {recipes.map((recipe, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-emerald-500">
                            <h3 className="font-bold text-slate-700">{recipe.title}</h3>
                             <p className="text-sm text-emerald-700 font-medium my-1">{recipe.category}</p>
                            <p className="text-slate-600 mb-2">{recipe.description}</p>
                            <p className="text-xs text-slate-500"><span className="font-semibold">Ingredients:</span> {recipe.ingredients.join(', ')}</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'Foods' && (
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-bold text-emerald-700 mb-2">Foods to Include</h3>
                        <ul className="list-disc list-inside text-slate-600 space-y-1">
                            {beneficialFoods.map(food => <li key={food}>{food}</li>)}
                        </ul>
                    </div>
                     <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-bold text-red-600 mb-2">Foods to Limit</h3>
                        <ul className="list-disc list-inside text-slate-600 space-y-1">
                            {foodsToLimit.map(food => <li key={food}>{food}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NourishScreen;
