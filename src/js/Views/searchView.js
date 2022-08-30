class SearchView {
	_parentElement = document.querySelector(".search");

	getQuery() {
		const searchField = this._parentElement.querySelector(".search__field");

		const query = searchField.value;
		this._clearInput();
		return query;
	}

	_clearInput() {
		const searchField = this._parentElement.querySelector(".search__field");
		searchField.value = "";
	}

	addHandlerSearch(handler) {
		//adding the event listener to the parent so we can check for the submit event i.e. submit button clicked or enter key pressed

		//handler function directly not called so that we can have access to the event to prevent default behaviour
		this._parentElement.addEventListener("submit", (e) => {
			e.preventDefault();
			handler();
		});
	}
}

export default new SearchView();
