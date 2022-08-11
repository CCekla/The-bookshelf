import Tabs from './ui/tabs';
import Searchbar from './ui/search';
import Modal from './ui/modal'
import Bookshelf from "./bookshelf";


//create tabs
const tabs = new Tabs(document.querySelector('.tabs'));
tabs.init();

//create search bar
const search = new Searchbar(document.querySelector('form.search'));
search.init();

//create all the modals
const addBook = new Modal(document.getElementById("add-new-book"));
addBook.init();

const moveBook = new Modal(document.getElementById("move-book"));
moveBook.init();

const editBook = new Modal(document.getElementById("edit-book"));
editBook.init();

const deleteBook = new Modal(document.getElementById("remove-book"));
deleteBook.init();

const voteBook = new Modal(document.getElementById("vote-book"));
voteBook.init();

//initialize a bookshelf
const bookshelf = new Bookshelf();

//DOM QUERIES
const booksLists = document.querySelectorAll(".book-list");
//add
const addBookBtns = document.querySelectorAll(".add-book");
const addBookForm = addBook.form;
//edit
const editBookForm = editBook.form;
//delete
const removeBtn = document.querySelector("#remove-book-btn");
//move
const moveBtn = document.getElementById("move-book-btn");
//vote
const voteForm = voteBook.form;


//modals opening buttons
booksLists.forEach((list) =>
  list.addEventListener("click", (event) => {
    const id = event.target.closest("li").getAttribute('id');

    if (event.target.classList.contains("delete-book")) {
      //send book id to modal
      deleteBook.modal.setAttribute('data-delete', id);
      //open to delete
      deleteBook.open();
    } else if (event.target.classList.contains("move-book")) {
      //send book id to modal
      moveBook.modal.setAttribute('data-move', id);
      //open to move
      moveBook.open();
    } else {
      //open to edit
      const bookCard = event.target.closest("li");
      const id = bookCard.getAttribute('id'); 
      editBookForm.bookTitle.value = bookCard.querySelector(".bk-title").textContent;
      editBookForm.bookAuthor.value = bookCard.querySelector(".bk-author").textContent;

      editBook.modal.setAttribute('data-edit',id);
      editBook.open();
    }
  })
);

//ADD BOOK
//click add book button - open modal
addBookBtns.forEach(btn => btn.addEventListener('click', event => {
  //get the list of the clicked button
  const list = event.target.getAttribute('data-list');
  //pass the list to the form attribute
  addBookForm.setAttribute('data-list', list);
  addBook.open();
}));

//submit a new book
addBookForm.addEventListener('submit', event => {
  event.preventDefault();

  //check if inputs are correct
  if(addBook.checkFields()){
    //get values
    const title = addBookForm.bookTitle.value.trim();
    const author = addBookForm.bookAuthor.value.trim();
    const list = addBookForm.getAttribute('data-list');

    //add book to db
    bookshelf.addBook(title, author, list)
      .then(() => {
        if(list === '#read'){
          const id = document.querySelector(list).lastElementChild.getAttribute('id');
          voteBook.modal.setAttribute('data-vote', id);
          voteBook.open();
        }
        addBook.close();
      }).catch(error => console.log(error));

  }

});

//DELETE BOOK
removeBtn.addEventListener("click", () => {
  //get the book to remove id
  const bookId = deleteBook.modal.getAttribute('data-delete');

  //delete the book from db
  bookshelf.removeBook(bookId)
    .then(() => deleteBook.close())
    .catch(error => console.log(error.message));

  //delete the book from html
  //document.getElementById(bookId).remove();
});

//MOVE BOOK
moveBtn.addEventListener('click', () => {
  //get the book to move id
  const bookId = moveBook.modal.getAttribute('data-move');
  //get the book list
  const book = document.getElementById(bookId);
  const list = book.getAttribute('data-list');
  //get the new list
  const newList = (list === '#toread') ? '#reading' : '#read';
  //move the book in db
  bookshelf.moveBook(bookId, newList)
    .then(() => {
      if(newList === '#read'){
        const id = document.querySelector(newList).lastElementChild.getAttribute('id');
        voteBook.modal.setAttribute('data-vote', id);
        voteBook.open();
      }
      moveBook.close();
    }).catch(error => console.log(error.message));
});

//EDIT BOOK
editBookForm.addEventListener('submit', event => {
  event.preventDefault();

  //check if the fields have proper content
  if(editBook.checkFields()) {
    //get content in variables
    const title = editBookForm.bookTitle.value.trim();
    const author = editBookForm.bookAuthor.value.trim();
    const bookId = editBook.modal.getAttribute('data-edit');

    //update the book
    bookshelf.updateBook(bookId, title, author)
      .then(() => editBook.close())
      .catch(error => console.log(error.message));
  }
});

//RATE BOOK
voteForm.addEventListener('submit', event => {
  event.preventDefault();

  const id = voteBook.modal.getAttribute('data-vote');
  const vote = voteForm.smiley.value;
  bookshelf.voteBook(id, vote)
   .then(() => voteBook.close())
   .catch(error => console.log(error.message));
});

//get chats and render
bookshelf.getBooks(doc => {
  bookshelf.render(doc);
});
