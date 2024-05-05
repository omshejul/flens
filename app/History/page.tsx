"use client"
import { useEffect, useState } from "react";

// Define the structure of the item's data
interface OtherNutrients {
    fiber: string;
    sodium: string;
    cholesterol: string;
}

interface NutritionalData {
    protein: string;
    carbohydrates: string;
    fats: string;
    sugars: string;
    calories: string;
    other_nutrients: OtherNutrients;
}

interface ItemData {
    name: string;
    data: NutritionalData;
    suggestion: string;
}

interface Item {
    _id: {
        $oid: string;
    };
    image: string;
    data: ItemData;
}

const History = () => {
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        fetch('/app/api/getHistory.tsx')
            .then(response => response.json())
            .then(data => {
                if (data && Array.isArray(data.data)) {
                    setItems(data.data);
                }
            })
            .catch(error => console.error('There was an error!', error));
    }, []);

    return (
        <div>
            <h1>Item History</h1>
            <div>
                {items.map((item, index) => (
                    <div key={index} style={{ marginBottom: '20px' }}>
                        <img src={item.image} alt="Item image" style={{ width: '100px', height: '100px' }} />
                        <p><strong>Name:</strong> {item.data.name}</p>
                        <p><strong>Suggestion:</strong> {item.data.suggestion}</p>
                        <p><strong>Nutritional Information:</strong></p>
                        <ul>
                            <li>Protein: {item.data.data.protein}g</li>
                            <li>Carbohydrates: {item.data.data.carbohydrates}g</li>
                            <li>Fats: {item.data.data.fats}g</li>
                            <li>Sugars: {item.data.data.sugars}g</li>
                            <li>Calories: {item.data.data.calories}kcal</li>
                            <li>Fiber: {item.data.data.other_nutrients.fiber}g</li>
                            <li>Sodium: {item.data.data.other_nutrients.sodium}mg</li>
                            <li>Cholesterol: {item.data.data.other_nutrients.cholesterol}mg</li>
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default History;
