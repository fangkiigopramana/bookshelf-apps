alert("Selamat datang di Schedule Activity Apps")
name = prompt("Silahkan Ketik nama depan anda: ")
while (name.length == 0){
  name = prompt("Silahkan Ketik nama depan anda dengan benar: ")
}
alert("Terima kasih");
const nama = name;


const modal = document.querySelector('#result')
const addButton = document.getElementById('add-book');
const closemodal = document.getElementById('close')
const UNCOMPLETED_BOOK_ID = "unread";
const COMPLETED_BOOK_ID ="read";
const BOOK_ITEMID = "itemId";

user = document.getElementById("name");
user.innerText = nama;

const addBook = () => {
  const uncompletedBook = document.getElementById(UNCOMPLETED_BOOK_ID);
  const inputTitle = document.getElementById('title').value;
  const inputWriter = document.getElementById('writer').value;
  const inputYear = document.getElementById('year').value;
  
  const book = makeBook(inputTitle, inputWriter, inputYear, false)
  const bookObject = composeBookObject(inputTitle, inputWriter, inputYear, false)
  
  book[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);
  alert("Buku telah ditambahkan!!")
  
  uncompletedBook.append(book)
  updateDataToStorage();
}

const makeBook = (title, writer, year, isCompleted) => {
  const image = document.createElement('img');
  if(isCompleted) {
    image.setAttribute('src', 'assets/img/succes.png')
  } else {
    image.setAttribute('src', 'assets/img/schedule.png')
  }

  const imageBook = document.createElement('div');
  imageBook.classList.add('image-book')
  imageBook.append(image)
  
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = title;
  
  const writerName = document.createElement('p');
  writerName.innerText = writer;
  
  const bookYear = document.createElement('small');
  bookYear.innerText = `${year}`;
  
  const detail = document.createElement('div');
  detail.classList.add('detail-book')
  detail.append(bookTitle, writerName, bookYear)
  
  const container = document.createElement('div');
  container.classList.add('my-container');
  container.append(imageBook, detail)
 
  if(isCompleted){
        container.append(
            createUnreadButton(),
            createTrashButton()
        );
    } else {
        container.append(
          createReadButton(),
          createTrashButton()
        );
    }
  return container;
}
const createButton = (buttonTypeClass, eventListener) => {
    const button  = document.createElement('button');
    button.classList.add(buttonTypeClass);
    
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}
const createReadButton = () => {
    return createButton("read-button", function (event) {
        addBookToCompleted(event.target.parentElement);
    });
}
const addBookToCompleted = (bookElement) => {
  const bookCompleted = document.getElementById(COMPLETED_BOOK_ID);
  
	const bookTitle = bookElement.querySelector(".detail-book > h3").innerText;
  const bookWriter = bookElement.querySelector(".detail-book > p").innerText;
  const bookYear = bookElement.querySelector(".detail-book > small").innerText;
 
  const newBook = makeBook(bookTitle, bookWriter, bookYear, true);
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isCompleted = true;
  newBook[BOOK_ITEMID] = book.id;

  
  bookCompleted.append(newBook);
  bookElement.remove();
    
  updateDataToStorage();
} 

const removeBookFromCompleted = (bookElement)  => {
  const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
  books.splice(bookPosition, 1);
  bookElement.remove();
  updateDataToStorage();
}

const createTrashButton = () => {
    return createButton("trash-book", function(event){
        removeBookFromCompleted(event.target.parentElement);
    });
}

const undoBookFromCompleted = (bookElement) => {
  const listUncompleted = document.getElementById(UNCOMPLETED_BOOK_ID);
    
  const bookTitle = bookElement.querySelector(".detail-book > h3").innerText;
  const bookWriter = bookElement.querySelector(".detail-book > p").innerText;
  const bookYear = bookElement.querySelector(".detail-book > small").innerText;
 
  const newBook = makeBook(bookTitle, bookWriter, bookYear, false);
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isCompleted = false;
  newBook[BOOK_ITEMID] = book.id;
  
  listUncompleted.append(newBook);
  bookElement.remove();
  updateDataToStorage();
}

const createUnreadButton = () => {
  return createButton("unread-button", function(event){
    undoBookFromCompleted(event.target.parentElement);
  });
}

const booksLength = () => {
  const totalBuku = document.getElementById('totalBuku');
  totalBuku.innerText = books.length;
}

addButton.addEventListener("click", () => {
  modal.classList.toggle("modal-open")
})
closemodal.addEventListener("click", () => {
  modal.style.transition = '1s';
  modal.classList.toggle("modal-open")
})

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    modal.classList.remove("modal-open");
    addBook();
  });

  if(checkStorage()){
    loadDatafromStorage();
  }
});

document.addEventListener("ondatasaved", () => {
  console.log("Data berhasil disimpan.");
  booksLength();
});

document.addEventListener("ondataloaded", () => {
  refreshDataFromBooks();
  booksLength();
});
