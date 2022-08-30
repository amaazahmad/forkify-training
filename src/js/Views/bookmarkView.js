import { state } from "../model.js";
import previewView from "./previewView.js";
import View from "./view.js";

class BookmarkView extends View {
	_parentElement = document.querySelector(".bookmarks__list");
	_errorMessage = "No bookmarks yet";
	_successMessage = "";

	addHandleRender(handler) {
		window.addEventListener("load", handler);
	}

	_generateMarkup() {
		return this._data
			.map((bookmark) => previewView.render(bookmark, false))
			.join("");
	}
}

export default new BookmarkView();
