import * as model from "./model.js";
import recipeView from "./Views/recipeView.js";
import searchView from "./Views/searchView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import resultsView from "./Views/resultsView.js";
import paginationView from "./Views/paginationView.js";
import bookmarkView from "./Views/bookmarkView.js";
import addRecipeView from "./Views/addRecipeView.js";

const recipeContainer = document.querySelector(".recipe");

const timeout = function (s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(new Error(`Request took too long! Timeout after ${s} second`));
		}, s * 1000);
	});
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
	try {
		const recipeID = window.location.hash.slice(1); //using slice from index 1 to remove the hash symbol in the beginning

		if (!recipeID) return;
		recipeView.renderSpinner();

		resultsView.update(model.getSearchResultsPage());
		bookmarkView.update(model.state.bookmarks);
		await model.loadRecipe(recipeID);

		// 2) Rendering
		recipeView.render(model.state.recipe);
	} catch (error) {
		recipeView.renderError();
	}
};

const controlSearchResults = async function () {
	try {
		resultsView.renderSpinner();

		const query = searchView.getQuery();
		if (!query) return;

		//loadSearchResults will alter the state
		await model.loadSearchResults(query);

		//arguments passed to render function are assigned to the data variable of the respective class
		resultsView.render(model.getSearchResultsPage(1));

		//pagination - initial
		paginationView.render(model.state.search);
	} catch (error) {
		console.log(error);
	}
};

const controlPagination = function (goToPage) {
	resultsView.render(model.getSearchResultsPage(goToPage));

	paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
	model.updateServings(newServings);

	recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else if (model.state.recipe.bookmarked) {
		model.deleteBookmark(model.state.recipe.id);
	}

	recipeView.update(model.state.recipe);

	bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
	bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
	try {
		addRecipeView.renderSpinner();
		await model.uploadRecipe(newRecipe);

		recipeView.render(model.state.recipe);

		addRecipeView.renderMessage();
		setTimeout(function () {
			addRecipeView.render((render = true));
		}, 2500);

		bookmarkView.render(model.state.bookmarks);

		window.history.pushState(null, "", `#${model.state.recipe.id}`);

		// setTimeout(function () {
		// 	addRecipeView.toggleWindow();
		// }, 2500);
	} catch (err) {
		addRecipeView.renderError(err.message);
	}
};

const init = function () {
	bookmarkView.addHandleRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
	addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
