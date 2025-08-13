// ======== Trie Data Structure for Search ========
class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
    this.books = [];
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(key, book) {
    let node = this.root;
    key = key.toLowerCase();
    for (let char of key) {
      if (!node.children[char]) node.children[char] = new TrieNode();
      node = node.children[char];
    }
    node.isEnd = true;
    node.books.push(book);
  }

  search(prefix) {
    let node = this.root;
    prefix = prefix.toLowerCase();
    for (let char of prefix) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }
    return this.collectBooks(node);
  }

  collectBooks(node) {
    let results = [...node.books];
    for (let char in node.children) {
      results = results.concat(this.collectBooks(node.children[char]));
    }
    return results;
  }
}
let books = [
    { title: "The Hobbit", author: "J.R.R. Tolkien", isbn: "54321", genre: "Fantasy", status: "Available", dueDate: "-" },
    { title: "C Programming", author: "P. Franklin", isbn: "12345", genre: "Study", status: "Available", dueDate: "-" }
];

const tableBody = document.querySelector("#bookTable tbody");
const totalBooksEl = document.getElementById("totalBooks");
const availableBooksEl = document.getElementById("availableBooks");
const borrowedBooksEl = document.getElementById("borrowedBooks");
const searchInput = document.getElementById("searchInput");

// Display Books
function renderBooks() {
    tableBody.innerHTML = "";
    books.forEach((book, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.genre}</td>
            <td>${book.status}</td>
            <td>${book.dueDate}</td>
            <td>
                ${book.status === "Available" 
                    ? `<button class="action-btn borrow-btn" onclick="borrowBook(${index})">Borrow</button>` 
                    : `<button class="action-btn return-btn" onclick="returnBook(${index})">Return</button>`}
                <button class="action-btn delete-btn" onclick="deleteBook(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    updateStats();
}

// Add Book
document.getElementById("addBookForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const newBook = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        isbn: document.getElementById("isbn").value,
        genre: document.getElementById("genre").value,
        status: "Available",
        dueDate: "-"
    };
    books.push(newBook);
    renderBooks();
    e.target.reset();
});

// Borrow Book
function borrowBook(index) {
    books[index].status = "Borrowed";
    let due = new Date();
    due.setDate(due.getDate() + 7);
    books[index].dueDate = due.toLocaleDateString();
    renderBooks();
}

// Return Book
function returnBook(index) {
    books[index].status = "Available";
    books[index].dueDate = "-";
    renderBooks();
}

// Delete Book
function deleteBook(index) {
    books.splice(index, 1);
    renderBooks();
}

// Search
searchInput.addEventListener("input", function() {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll("#bookTable tbody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(query) ? "" : "none";
    });
});

// Update Stats
function updateStats() {
    totalBooksEl.textContent = books.length;
    availableBooksEl.textContent = books.filter(b => b.status === "Available").length;
    borrowedBooksEl.textContent = books.filter(b => b.status === "Borrowed").length;
}

renderBooks();
