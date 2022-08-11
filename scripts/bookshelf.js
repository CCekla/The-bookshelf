import { db } from '../src/index.js'
import { collection, addDoc, Timestamp, onSnapshot, orderBy, query, doc, deleteDoc, updateDoc } from 'firebase/firestore'

class Bookshelf {
    constructor() {
        this.books = collection(db, 'books'),
        this.list,
        this.unsub
    }

    //data is going to be a single book object
    render(doc){
        //get data + id
        const data = doc.data();
        const id = doc.id;
        //set the list to the current book list
        this.list = document.querySelector(data.list);
        //check if voted
        const icon = !data.vote ? `<i class="far fa-share-square pl-4 move-book"></i>` : `<span class="pl-4 smile-vote">${data.vote}</span>`;
        // the template of the "book card"
        const html = `
        <li class="p-3 mb-4 book" id="${id}" data-list="${data.list}">
        <p>
          <span class="font-display is-size-5 bk-title"
            >${data.title}</span
          >
          <span class="is-small bk-author">${data.author}</span>
        </p>
        <p class="bk-icons">
          <i class="far fa-trash-alt pl-4 delete-book"></i>
          ${icon}
        </p>
        </li>
        `;

        this.list.innerHTML += html;
    }

    //add new book docs
    async addBook(title, author, list){
        //create a book object to upload to the db
        const time = new Date();
        const book = {
            title : title,
            author : author,
            list : list,
            created_at : Timestamp.fromDate(time)
        };
        //save book document on db
        const response = await addDoc(this.books, book);
        return response
    }

    //get new books
    getBooks(callback){
        //set up a query + order them by creation date
        const q = query(this.books, orderBy('created_at'));
        this.unsub = onSnapshot(q, snapshot => {
                //everytime there's a snapshot this fires
                snapshot.docChanges().forEach(change => {
                    //checks the type of change
                    if(change.type === 'added' || change.type === 'modified'){
                        //update UI
                        callback(change.doc);
                    }

                });
            });
    }

    //delete book
    async removeBook(id) {
        await deleteDoc(doc(db, "books", id));
    }

    //update book
    async updateBook(id, title, author) {
        const ref = doc(db, "books", id);
        await updateDoc(ref, {title, author});
    }

    //move book = update list
    async moveBook(id, newList) {
        const time = new Date();
        const ref = doc(db, "books", id);
        await updateDoc(ref, {list: newList, created_at: Timestamp.fromDate(time)});
    }

    //vote book
    async voteBook (id, vote) {
        const ref = doc(db, "books", id);
        await updateDoc(ref, {vote: vote});
    }
}
export { Bookshelf as default }