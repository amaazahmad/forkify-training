import { API_KEY, API_URL } from "../js/config.js";
import { getJSON, sendJSON } from "./helpers.js";

export const state = {
	recipe: {},
	search: { query: "", results: [], resultsPerPage: 10, page: 1 },
	bookmarks: [],
};

const createRecipeObject = function (data) {
	const recipeInResponse = data.data.recipe;
	return {
		id: recipeInResponse.id,
		title: recipeInResponse.title,
		publisher: recipeInResponse.publisher,
		sourceUrl: recipeInResponse.source_url,
		image: recipeInResponse.image_url,
		servings: recipeInResponse.servings,
		cookingTime: recipeInResponse.cookingTime,
		ingredients: recipeInResponse.ingredients,
		...(recipeInResponse.key && { key: recipeInResponse.key }), //assigns key property only if it exists in recipeInResponse
	};
};

export const loadRecipe = async function (recipeID) {
	try {
		const resp = await getJSON(`${API_URL}/${recipeID}?key=${API_KEY}`);
		state.recipe = createRecipeObject(resp);

		if (state.bookmarks.some((bookmark) => bookmark.id === recipeID)) {
			state.recipe.bookmarked = true;
		} else {
			state.recipe.bookmarked = false;
		}
	} catch (err) {
		throw err;
	}
};

export const loadSearchResults = async function (query) {
	try {
		const data = await getJSON(`${API_URL}/?search=${query}&key=${API_KEY}`);

		state.search.query = query;

		state.search.results = data.data.recipes.map((rec) => {
			return {
				id: rec.id,
				title: rec.title,
				publisher: rec.publisher,
				image: rec.image_url,
				...(rec.key && { key: rec.key }),
			};
		});
		state.search.page = 1;
	} catch (error) {
		throw error;
	}
};

export const getSearchResultsPage = function (page = state.search.page) {
	state.search.page = page;
	const start = (page - 1) * state.search.resultsPerPage;
	const end = page * state.search.resultsPerPage;

	return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
	state.recipe.ingredients.forEach((element) => {
		element.quantity = (element.quantity * newServings) / state.recipe.servings;
	});
	state.recipe.servings = newServings;
};

const persistBookmarks = function () {
	localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
	state.bookmarks.push(recipe);

	if (recipe.id === state.recipe.id) {
		state.recipe.bookmarked = true;
	}

	persistBookmarks();
};

export const deleteBookmark = function (id) {
	const index = state.bookmarks.findIndex((el) => el.id === id);

	state.bookmarks.splice(index, 1);
	if (id === state.recipe.id) state.recipe.bookmarked = false;

	persistBookmarks();
};

const init = function () {
	const storage = localStorage.getItem("bookmarks");
	if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
	localStorage.clear("bookmarks");
};

export const uploadRecipe = async function (newRecipe) {
	try {
		const filteredIngredients = Object.entries(newRecipe).filter(
			(entry) => entry[0].startsWith("ingredient") && entry[1] !== ""
		);

		const ingredients = filteredIngredients.map((ing) => {
			const ingArr = ing[1].split(",").map((el) => el.trim());

			if (ingArr.length !== 3) throw new Error("Wrong Ingredient Format");
			const [quantity, unit, description] = ingArr;
			return { quantity: quantity ? +quantity : null, unit, description };
		});

		const recipe = {
			title: newRecipe.title,
			source_url: newRecipe.sourceUrl,
			image_url: newRecipe.image,
			publisher: newRecipe.publisher,
			cooking_time: +newRecipe.cookingTime,
			servings: +newRecipe.servings,
			ingredients,
		};
		const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);

		state.recipe = createRecipeObject(data);
		addBookmark(state.recipe);
	} catch (err) {
		throw err;
	}
};
