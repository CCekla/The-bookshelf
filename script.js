//TABS
const selectTab = (event, tab) => {
  //get all the list column and make them invisible
  tabCol = document.querySelectorAll(".column");
  for (let i = 0; i < tabCol.length; i++) {
    tabCol[i].classList.add("is-hidden-touch");
  }

  //get all the tab buttons and deselect them
  tabBtns = document.querySelectorAll(".tab-btn");
  for (let i = 0; i < tabBtns.length; i++) {
    tabBtns[i].classList.remove("selected");
  }

  //show selected
  document.getElementById(tab).closest('.column').classList.remove("is-hidden-touch");
  event.target.closest("li").classList.add("selected");
};

const tabLinks = document.querySelectorAll(".tab-btn");
tabLinks.forEach((btn) =>
  btn.addEventListener("click", (event) => {
    let txt = event.target.textContent.replace(' ','').toLowerCase();
    selectTab(event, txt);
  })
);

//BOOK LISTS
let booksToRead = (booksReading = booksRead = []);

//TEMPORARY ARRAY
booksToRead = [
  { title: "A book title", author: "Book Author", id: "#bk-toread-0" },
  { title: "A book title", author: "Book Author", id: "#bk-toread-1" },
  { title: "A book title", author: "Book Author", id: "#bk-toread-2" },
];

//OPEN + CLOSE MODAL(S)
const openModal = (aModal) => aModal.classList.add("is-active");
const closeModal = (aModal) => aModal.classList.remove("is-active");

//EMPTY TEXT FIELDS
const clearFields = (aForm) => {
  aForm.reset();
};

//TRYING TO CODE SOME HELPERS

//create a book card and insert to a list
const createCard = (bkClass, bkId, bkTitle, bkAuthor, bkListId) => {
  //create book card + add to ul
  let card = `<li class="p-3 mb-4 book ${bkClass}" id="${bkId}">
  <p>
    <span class="font-display is-size-5 bk-title"
      >${bkTitle}</span
    >
    <span class="is-small bk-author">${bkAuthor}</span>
  </p>
  <p class="bk-icons">
    <i class="far fa-trash-alt pl-4 delete-book"></i>
    <i class="far fa-share-square pl-4 move-book"></i>
  </p>
  </li>`;

  document.querySelector(bkListId).innerHTML += card;
}

//remove book from array
const removeFromArr = (arr, str) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === str) {
      arr.splice(i, 1);
    }
  }
};

//get the current id
const currId = (str) => {
  let strId = str.split("-");
  strId.pop();
  return strId.join("-") + "-";
};

//get new id
const newId = (str) => {
  let newId = "";
  if (str.includes("toread")) {
    newId = "#bk-reading-";
  } else {
    newId = "#bk-read-";
  }
  return newId;
};

//update the array ids
const updateArr = (arr, str) => {
  for (let i = 0; i < arr.length; i++) {
    arr[i].id = str + i;
  }
};

//update html ul li ids
const updateList = (list, str) => {
  for (let i = 0; i < list.children.length; i++) {
    list.children[i].setAttribute("id", str + i);
  }
};

//CLOSE BTNS
const closeBtn = document.querySelectorAll(".closing");

//listen for clicks from closing btn
closeBtn.forEach((btn) =>
  btn.addEventListener("click", (event) => {
    let modal = event.target.closest(".modal");
    let form = modal.querySelector("form");

    if (!form || (!form.bookTitle && !form.bookAuthor)) {
      closeModal(modal);
    } else {
      //remove bkg classes
      form.bookTitle.classList.remove(
        "has-background-success-light",
        "has-background-danger-light"
      );
      form.bookAuthor.classList.remove(
        "has-background-success-light",
        "has-background-danger-light"
      );

      //empty field
      clearFields(form);
    }

    //close the modal
    closeModal(modal);
  })
);

//live feedback for ALL text inouts
const textInputs = document.querySelectorAll(".modal input[type=text]");
textInputs.forEach((input) =>
  input.addEventListener("keyup", (event) => {
    // regex test
    const pattern = /[a-zA-Z]{2,}/;

    if (pattern.test(event.target.value)) {
      //green
      event.target.setAttribute("class", "input has-background-success-light");
    } else {
      //red
      event.target.setAttribute("class", "input has-background-danger-light");
    }
  })
);

//CHECK FIELDS AND CREATE BOOK OBJ
let book = {};

const checkFields = (aForm) => {
  let bkT = aForm.bookTitle.value;
  let bkA = aForm.bookAuthor.value;

  //empty book object
  book = {};

  //check truthy fields
  if (
    !aForm.bookTitle.classList.contains("has-background-danger-light") &&
    !aForm.bookAuthor.classList.contains("has-background-danger-light")
  ) {
    //assign values to book object
    book.title = bkT;
    book.author = bkA;
    return true;
  } else {
    return false;
  }
};

// ADD BOOK BTNS
const addNewBookBtn = document.querySelectorAll(".add-book");
const addBookModal = document.querySelector("#add-new-book");

//listen to clicks from add-book-btn
addNewBookBtn.forEach((btn) =>
  btn.addEventListener("click", (event) => {
    openModal(addBookModal);

    let classToAdd = "";

    if (event.target.id === "btn-toread") {
      classToAdd = "bks-toread";
    } else if (event.target.id === "btn-reading") {
      classToAdd = "bks-reading";
    } else if (event.target.id === "btn-read") {
      classToAdd = "bks-read";
    }

    addBookModal.setAttribute("bkList", classToAdd);
  })
);

// ADD NEW BOOK FORM
let bkIdx = "";
const addBookForm = document.querySelector("#add-new-book form");

addBookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (checkFields(event.target)) {
    //append in the correct array + list

    let bkClass = "";
    let listId = "";

    if (addBookModal.getAttribute("bklist") === "bks-toread") {
      booksToRead.push(book);
      bkClass = "bk-toread";
      book.id = "#" + bkClass + "-" + (booksToRead.length - 1);
      listId = "#toread";
    } else if (addBookModal.getAttribute("bklist") === "bks-reading") {
      booksReading.push(book);
      bkClass = "bk-reading";
      book.id = "#" + bkClass + "-" + (booksReading.length - 1);
      listId = "#reading";
    } else if (addBookModal.getAttribute("bklist") === "bks-read") {
      booksRead.push(book);
      bkClass = "bk-read";
      book.id = "#" + bkClass + "-" + (booksRead.length - 1);
      listId = "#read";
    }

    bkIdx = book.id;

    createCard(bkClass, bkIdx, book.title, book.author, listId);
  }

  //empty fields
  clearFields(addBookForm);
  //remove classes from text inputs upon submitting
  textInputs.forEach((input) => input.setAttribute("class", "input"));

  if (bkIdx.includes("toread") || bkIdx.includes("reading")) {
    closeModal(addBookModal);
  } else {
    //also vote in case you add a read book
    closeModal(addBookModal);
    openModal(document.getElementById("vote-book"));
  }
});

// BOOKS ACTIONS

const booksLists = document.querySelectorAll(".book-list");

const editBookMod = document.querySelector("#edit-book");
const editBookForm = document.querySelector("#edit-book-form");

const deleteMod = document.querySelector("#remove-book");
const moveMod = document.getElementById("move-book");

booksLists.forEach((list) =>
  list.addEventListener("click", (event) => {
    bkIdx = event.target.closest("li").getAttribute("id");

    if (event.target.classList.contains("delete-book")) {
      //open to delete
      openModal(deleteMod);
    } else if (event.target.classList.contains("move-book")) {
      //open to move
      openModal(moveMod);
    } else {
      //edit
      let clickedBk = event.target.closest("li");
      editBookForm.bookTitle.value =
        clickedBk.querySelector(".bk-title").textContent;
      editBookForm.bookAuthor.value =
        clickedBk.querySelector(".bk-author").textContent;

      openModal(editBookMod);
    }
  })
);

//EDIT BOOK
editBookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  //check fields
  if (checkFields(event.target)) {
    //changed title and author
    book.title = editBookForm.bookTitle.value;
    book.author = editBookForm.bookAuthor.value;
    //the id stays the same because the list is the same

    //get all array lists
    let arrays = [booksToRead, booksReading, booksRead];

    arrays.forEach((arr) => {
      //find array item and update title and author
      let i = arr.findIndex((bk) => bk.id === bkIdx);

      if (i > 0) {
        arr[i].title = book.title;
        arr[i].author = book.author;
      }

      //change card infos
      let editedBk = document.getElementById(bkIdx);

      editedBk.querySelector(".bk-title").textContent = book.title;
      editedBk.querySelector(".bk-author").textContent = book.author;
    });
  }

  //remove classes from text inputs upon submitting
  textInputs.forEach((input) => input.setAttribute("class", "input"));
  //close modal
  closeModal(editBookMod);
});

//REMOVE BOOK
const removeBtn = document.querySelector("#remove-book-btn");
removeBtn.addEventListener("click", (event) => {
  let ulList = document.getElementById(bkIdx).parentElement;
  //get id string without index num
  let strId = currId(bkIdx);

  //remove from html
  document.getElementById(bkIdx).remove();

  //update list
  updateList(ulList, strId);

  if (bkIdx.includes("toread")) {
    //remove from toread
    removeFromArr(booksToRead, bkIdx);
    updateArr(booksToRead, strId);
  } else {
    removeFromArr(booksReading, bkIdx);
    updateArr(booksReading, strId);
  }

  //close modal
  closeModal(deleteMod);
});

//MOVING BOOKS
const moveBtn = document.getElementById("move-book-btn");
//also vote in case of read book
const voteMod = document.getElementById("vote-book");

//moving
moveBtn.addEventListener("click", (event) => {
  let book = document.getElementById(bkIdx);

  let bTitle = book.querySelector(".bk-title").textContent;
  let bAuth = book.querySelector(".bk-author").textContent;

  let strId = currId(bkIdx);
  let myId = newId(bkIdx);

  if (strId.includes("toread")) {
    removeFromArr(booksToRead, bkIdx);
    booksReading.push({ title: bTitle, author: bAuth, id: myId });
    updateArr(booksToRead, strId);
    updateArr(booksReading, myId);

    document.getElementById("reading").append(book);

    updateList(document.getElementById("toread"), strId);
    updateList(document.getElementById("reading"), myId);

    closeModal(moveMod);
  } else {
    closeModal(moveMod);
    openModal(voteMod);
  }
});

//VOTING
const voteBtn = document.getElementById("vote-book-btn");
const voteForm = document.getElementById("voting");

let smile = "";

//VOTE FORM
voteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  //yes im too lazy to make a global variable yadda yadda
  let book = document.getElementById(bkIdx);
  let vote = voteForm.smiley.value;

  //update lists and arrays
  removeFromArr(booksReading, bkIdx);
  updateArr(booksReading, currId(bkIdx));
  updateArr(booksRead, newId(bkIdx));

  document.getElementById("read").append(book);

  updateList(document.getElementById("reading"), currId(bkIdx));
  updateList(document.getElementById("read"), newId(bkIdx));

  //append smile <i></i> to bk-icons
  let smileTag = `<span class="pl-4 smile-vote">${vote}</span>`;
  book.querySelector(".bk-icons").insertAdjacentHTML("afterbegin", smileTag);
  book.querySelector(".move-book").remove();

  //close modal
  closeModal(voteMod);
});

//SEARCH

const filterBooks = (txt) => {
  const books = document.querySelectorAll('.book');
  books.forEach(book => {
    if(!book.textContent.toLowerCase().includes(txt)){
      book.classList.add('is-hidden');
    }else{
      book.classList.remove('is-hidden');
    }
    
  });
}

const search = document.querySelector('.search input');

search.addEventListener('keyup', () => {
  const term = search.value.trim();
  filterBooks(term);
});

//I cant believe i finished it!
//just have to fix the style
//......eventually.......

