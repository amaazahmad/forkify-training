import icons from "url:../../img/icons.svg";
import View from "./view";
class PaginationView extends View {
	_parentElement = document.querySelector(".pagination");

	_generateMarkup() {
		const numOfPages = Math.ceil(
			this._data.results.length / this._data.resultsPerPage
		);

		if (this._data.page === 1 && numOfPages > 1) {
			return `<button data-goto=${
				this._data.page + 1
			} class="btn--inline pagination__btn--next">
               <span>${this._data.page + 1}</span>
               <svg class="search__icon">
                 <use href="${icons}#icon-arrow-right"></use>
               </svg>
             </button>`;
		}

		if (this._data.page === numOfPages && numOfPages > 1) {
			return `<button data-goto=${
				this._data.page - 1
			} class="btn--inline pagination__btn--prev">
               <svg class="search__icon">
                 <use href="${icons}#icon-arrow-left"></use>
               </svg>
               <span>Page ${this._data.page - 1}</span>
             </button>`;
		}

		if (this._data.page < numOfPages) {
			return `<button data-goto=${
				this._data.page - 1
			} class="btn--inline pagination__btn--prev">
               <svg class="search__icon">
                 <use href="${icons}#icon-arrow-left"></use>
               </svg>
               <span>Page ${this._data.page - 1}</span>
             </button>
             
             <button data-goto=${
								this._data.page + 1
							} class="btn--inline pagination__btn--next">
               <span>${this._data.page + 1}</span>
               <svg class="search__icon">
                 <use href="${icons}#icon-arrow-right"></use>
               </svg>
             </button>`;
		}
		return "";
	}

	addHandlerClick(handler) {
		this._parentElement.addEventListener("click", (e) => {
			const btn = e.target.closest(".btn--inline"); //closest function searches for the closest matching element UP THE DOM TREE. i.e. parent elements

			if (!btn) return;

			//the + symbol casts the string into int
			const goToPage = +btn.dataset.goto;

			handler(goToPage);
		});
	}
}
export default new PaginationView();
