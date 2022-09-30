const incompleteBook = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookList = document.getElementById('incompleteBook');
    incompleteBookList.innerHTML = '';

    const completeBookList = document.getElementById('completeBook');
    completeBookList.innerHTML = '';
    
    for (const incompleteBookItem of incompleteBook) {
        const incompleteBookElement = makeBook(incompleteBookItem);
        if (!incompleteBookItem.isCompleted)
            incompleteBookList.append(incompleteBookElement);
        else
            completeBookList.append(incompleteBookElement);
    }
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, false);
    incompleteBook.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = (`Penulis: ${bookObject.author}`);

    const textYear = document.createElement('p');
    textYear.innerText = (`Tahun: ${bookObject.year}`);

    const book_shelf = document.createElement('article');
    book_shelf.classList.add('book_item');
    book_shelf.append(textTitle, textAuthor, textYear);
    book_shelf.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const uncompletedButton = document.createElement('button');
        uncompletedButton.innerText = 'Belum Selesai Dibaca'
        uncompletedButton.classList.add('btn-uncompleted');
        
        uncompletedButton.addEventListener('click', function () {
            uncompletedBookFromCompleted(bookObject.id);
        });
        
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Hapus Buku'
        deleteButton.classList.add('del-book');
        
        deleteButton.addEventListener('click', function () {
            deleteBookFromCompleted(bookObject.id);
        });
        
        book_shelf.append(uncompletedButton, deleteButton);
        } else {
        const completedButton = document.createElement('button');
        completedButton.innerText = 'Selesai Dibaca'
        completedButton.classList.add('btn-completed');
        
        completedButton.addEventListener('click', function () {
            addBookToCompleted(bookObject.id);
        });
        
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Hapus Buku'
        deleteButton.classList.add('del-book');
        
        deleteButton.addEventListener('click', function () {
            deleteBookFromCompleted(bookObject.id);
        });

        book_shelf.append(completedButton, deleteButton);
        }

    return book_shelf;
}

function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const incompleteBookItem of incompleteBook) {
        if (incompleteBookItem.id === bookId) {
        return incompleteBookItem;
        }
    }
    return null;
}

function deleteBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    incompleteBook.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert('Anda yakin ingin menghapus buku ini?');
    }


    function uncompletedBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in incompleteBook) {
        if (incompleteBook[index].id === bookId) {
        return index;
        }
    }

    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(incompleteBook);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser yang anda gunakan tidak mendukung local storage');
        return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            incompleteBook.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}