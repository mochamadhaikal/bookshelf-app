const books = [];
const RENDER_EVENT = "render-books";

document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.getElementById("inputBook");

    submitForm.addEventListener("submit", function(event) {
        event.preventDefault();
        actionMessage("inputBook");
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
    countUnComplete();
    countComplete();
});

function addBook() {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const check = document.getElementById("inputBookIsComplete").checked;

    const id = generateId();

    if (check === true) {
        const bookObject = generateBookObject(id, title, author, year, true);
        books.push(bookObject);
    } else {
        const bookObject = generateBookObject(id, title, author, year, false);

        books.push(bookObject);
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, bookTitle, bookWriter, bookYear, isCompleted) {
    return {
        id,
        bookTitle,
        bookWriter,
        bookYear,
        isCompleted,
    };
}

function makeBook(bookObject) {
    const title = document.createElement("p");
    title.innerHTML = `<h3>${bookObject.bookTitle}</h3>`;

    const textWriter = document.createElement("p");
    textWriter.innerHTML = `Penulis: <b>${bookObject.bookWriter}</b>`;

    const textYear = document.createElement("p");
    textYear.innerHTML = `Tahun: <b>${bookObject.bookYear}</b>`;

    const article = document.createElement("article");
    article.classList.add("book_item");
    article.setAttribute("id", `${bookObject.id}`);

    article.appendChild(title);
    article.appendChild(textWriter);
    article.appendChild(textYear);

    if (bookObject.isCompleted) {
        const undoButton = document.createElement("button");
        undoButton.innerHTML = "Belum selesai di Baca";
        undoButton.classList.add("undo-button");

        undoButton.addEventListener("click", function() {
            actionMessage("undo");
            undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.innerHTML = "Hapus buku";
        trashButton.classList.add("trash-button");

        trashButton.addEventListener("click", function() {
            actionMessage("delete");
            removeBookFromCompleted(bookObject.id);
        });

        const bookAction = document.createElement("div");
        bookAction.classList.add("action");

        bookAction.appendChild(undoButton);
        bookAction.appendChild(trashButton);

        article.append(bookAction);
    } else {
        const checkButton = document.createElement("button");
        checkButton.innerHTML = "Selesai dibaca";
        checkButton.classList.add("check-button");

        checkButton.addEventListener("click", function() {
            actionMessage("check");
            addBookToCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.innerHTML = "Hapus buku";
        trashButton.classList.add("trash-button");

        trashButton.addEventListener("click", function() {
            actionMessage("not read delete");
            removeBookFromCompleted(bookObject.id);
        });
        const bookAction = document.createElement("div");
        bookAction.classList.add("action");

        bookAction.appendChild(checkButton);
        bookAction.appendChild(trashButton);
        article.append(bookAction);
    }

    return article;
}

function actionMessage(action) {
    const messageAddMewBook = document.getElementById("add-new-book");
    const messageRead = document.getElementById("read");
    const messageUnread = document.getElementById("unread");

    if (action === "check") {
        messageRead.innerText =
            "Berhasil! Buku telah dibaca dan di simpan ke rak selesai di baca, anda dapat membacanya lagi nanti";
        messageRead.classList.add("done");

        setTimeout(function() {
            messageRead.innerText = "";
            messageRead.classList.remove("done");
        }, 3000);

        return;
    } else if (action === "not read delete") {
        messageRead.innerText =
            "Berhasil! Buku telah dihapus, meskipun anda belum selesai membaca buku ini";
        messageRead.classList.add("deleted");

        setTimeout(function() {
            messageRead.innerText = "";
            messageRead.classList.remove("deleted");
        }, 3000);

        return;
    } else if (action === "undo") {
        messageUnread.innerText =
            "Berhasil! Buku telah dikembalikan ke rak belum dibaca";
        messageUnread.classList.add("undo");

        setTimeout(function() {
            messageUnread.innerText = "";
            messageUnread.classList.remove("undo");
        }, 3000);

        return;
    } else if (action === "delete") {
        messageUnread.innerText = "Berhasil! Buku telah dihapus.";
        messageUnread.classList.add("deleted");

        setTimeout(function() {
            messageUnread.innerText = "";
            messageUnread.classList.remove("deleted");
        }, 3000);

        return;
    } else if (action === "inputBook") {
        messageAddMewBook.innerText = "Berhasil! Buku baru telah di tambahkan.";
        messageAddMewBook.classList.add("done");

        setTimeout(function() {
            messageAddMewBook.innerText = "";
            messageAddMewBook.classList.remove("done");
        }, 3000);

        return;
    }
}

function countUnComplete() {
    const uncompleted = document.getElementById("uncomplete");
    let count = 0;
    for (let i = 0; i < books.length; i++) {
        if (!books[i].isCompleted) {
            count++;
        }
    }
    if (count === 0) {
        uncompleted.innerText = "Belum ada buku";
    } else {
        uncompleted.innerText = `${count} buku belum dibaca`;
    }
}

function countComplete() {
    const completed = document.getElementById("complete");
    let count = 0;
    for (let i = 0; i < books.length; i++) {
        if (books[i].isCompleted) {
            count++;
        }
    }
    if (count === 0) {
        completed.innerText = "Belum ada buku yang selesai anda baca";
    } else {
        completed.innerText = `${count} buku telah selesai dibaca`;
    }
}

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedBOOKList = document.getElementById(
        "incompleteBookshelfList"
    );
    uncompletedBOOKList.innerHTML = "";

    const completedBOOKList = document.getElementById("completeBookshelfList");
    completedBOOKList.innerHTML = "";

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) uncompletedBOOKList.append(bookElement);
        else completedBOOKList.append(bookElement);
    }
});

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}