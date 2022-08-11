class Searchbar {
    constructor(form) {
        this.form = form,
        this.input = form.querySelector('input')
    }

    init() {
        this.form.addEventListener('submit', event => {
            event.preventDefault();
        });
        this.input.addEventListener('keyup', () => {
            //get the search input text
            const term = this.input.value.trim();
            this.filterBooks(term);
        });
    }

    filterBooks(str) {
        //get all the books
        const books = document.querySelectorAll('.book');
        books.forEach(book => {
            //check if some book has the searched text
            if(!book.textContent.toLowerCase().includes(str.toLowerCase())){
                //if it doesn't hide the book
                //classList doesn't allow duplicate classes
                book.classList.add('is-hidden');
            }else{
                //if it does show the book
                //if the class is not in classList it won't be removed obv.
                book.classList.remove('is-hidden');
            }
    
        });
    }
}

export { Searchbar as default }