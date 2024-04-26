// Function to fetch random meal
async function getRandomMeal() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await response.json();
    return data.meals[0];
}

// Function to display random meal
async function displayRandomMeal() {
    const randomMeal = await getRandomMeal();
    const randomMealContainer = document.getElementById('randomMealContainer');
    randomMealContainer.innerHTML = `
        <img src="${randomMeal.strMealThumb}" alt="${randomMeal.strMeal}">
        <p>${randomMeal.strMeal}</p>
    `;
    // Attach click event to display ingredients modal
    randomMealContainer.querySelector('img').addEventListener('click', () => displayIngredients(randomMeal));
}


// Function to fetch meals by category
async function getMealsByCategory(category) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await response.json();
    return data.meals;
}


// Function to display searched meals
async function displaySearchedMeals(category) {
    const searchedMealsContainer = document.getElementById('searchedMealsContainer');
    searchedMealsContainer.innerHTML = ''; // Clear previous content
    const meals = await getMealsByCategory(category);
    meals.forEach(meal => {
        const mealElement = document.createElement('div');
        mealElement.classList.add('meal');
        mealElement.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p>${meal.strMeal}</p>
        `;
        mealElement.querySelector('img').addEventListener('click', () => displayIngredients(meal));
        searchedMealsContainer.appendChild(mealElement);
    });
    // Show searched meals section
    document.getElementById('searchedMeals').classList.remove('hidden');
}

// Function to display ingredients modal
function displayIngredients(meal) {
    const modal = document.getElementById('modal');
    const ingredientsList = document.getElementById('ingredientsList');
    ingredientsList.innerHTML = ''; // Clear previous content
    meal.strIngredient1 && ingredientsList.appendChild(createIngredientElement(meal.strIngredient1, meal.strMeasure1));
    meal.strIngredient2 && ingredientsList.appendChild(createIngredientElement(meal.strIngredient2, meal.strMeasure2));
    // Repeat for other ingredients
    modal.classList.remove('hidden');
}

// Helper function to create ingredient list item
function createIngredientElement(ingredient, measure) {
    const li = document.createElement('li');
    li.textContent = `${ingredient} - ${measure}`;
    return li;
}

// Close modal when clicking on close button
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('modal').classList.add('hidden');
});

// Display random meal on page load
displayRandomMeal();

// Handle search input
document.getElementById('searchInput').addEventListener('keypress', async function(e) {
    if (e.key === 'Enter') {
        const category = e.target.value.trim();
        if (category !== '') {
            await displaySearchedMeals(category);
        }
    }
});
