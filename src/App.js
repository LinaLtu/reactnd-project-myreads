import React from "react";
// import * as BooksAPI from './BooksAPI'
import "./App.css";
import Shelf from "./Components/Shelf.js";
import Search from "./Components/Search.js";
import { getAll } from "./BooksAPI.js";

class BooksApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlyReading: [],
      read: [],
      wantToRead: [],
      /**
       * TODO: Instead of using this state variable to keep track of which page
       * we're on, use the URL in the browser's address bar. This will ensure that
       * users can use the browser's back and forward buttons to navigate between
       * pages, as well as provide a good URL they can bookmark and share.
       */
      showSearchPage: false
    };

    this.handleShelfChanger = this.handleShelfChanger.bind(this);
  }

  componentDidMount() {
    let currentlyReading = [];
    let read = [];
    let wantToRead = [];
    console.log("Read array ", read);
    getAll().then(books => {
      books.forEach(book => {
        if (book.shelf === "read") {
          console.log("Before pushing to a read array ", read);
          read.push(book);
        } else if (book.shelf === "currentlyReading") {
          currentlyReading.push(book);
        } else if (book.shelf === "wantToRead") {
          wantToRead.push(book);
        }
      });
      this.setState({
        currentlyReading,
        read,
        wantToRead
      });
      console.log("state ", this.state);
    });
  }

  handleShelfChanger(bookId, currentShelf, newShelf) {
    console.log("Book id ", bookId, currentShelf, newShelf);
    console.log("This is our state ", this.state);

    let shelfOfSelectedBook;

    //to set the state use function

    if (currentShelf === "currentlyReading") {
      console.log("This books is in currently reading");
      shelfOfSelectedBook = this.state.currentlyReading;
      this.moveBookBetweenShelves(bookId, shelfOfSelectedBook, newShelf);
      // this.setState({ currentlyReading: shelfBookWillBeMovedTo });
    } else if (currentShelf === "read") {
      shelfOfSelectedBook = this.state.read;
      this.moveBookBetweenShelves(bookId, shelfOfSelectedBook, newShelf);
      // this.setState({ read: shelfBookWillBeMovedTo });
    } else if (currentShelf === "wantToRead") {
      shelfOfSelectedBook = this.state.wantToRead;
      this.moveBookBetweenShelves(bookId, shelfOfSelectedBook, newShelf);
      // this.setState({ wantToRead: shelfBookWillBeMovedTo });
    }
    console.log("This is the array of the current book: ", shelfOfSelectedBook);
    function updateState(shelfBookWillBeMovedTo) {
      console.log("From update the state ", shelfBookWillBeMovedTo);
    }
  }

  moveBookBetweenShelves(bookId, shelfOfSelectedBook, newShelf, updateState) {
    let shelfBookWillBeMovedTo;
    let bookToChange = shelfOfSelectedBook.filter(
      bookById => bookById.id === bookId
    );

    console.log("Book to change:", bookToChange);
    console.log("This state from findBookByIdInItsShelf function", this.state);
    let shelfWithoutSelectedBook = shelfOfSelectedBook.splice(bookToChange, 1);
    console.log("Book has been deleted", shelfWithoutSelectedBook);

    if (newShelf === "currentlyReading") {
      console.log("Shelf the book will be moved to", shelfBookWillBeMovedTo;
      shelfBookWillBeMovedTo = this.state.currentlyReading;
    } else if (newShelf === "read") {
      shelfBookWillBeMovedTo = this.state.read;
    } else if (newShelf === "wantToRead") {
      shelfBookWillBeMovedTo = this.state.wantToRead;
    }

    shelfBookWillBeMovedTo.push(bookToChange[0]);
    console.log("Book added to a new shelf ", shelfBookWillBeMovedTo);
    updateState(shelfBookWillBeMovedTo);
    // return shelfBookWillBeMovedTo;
  }

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <Search />
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <Shelf
              books={this.state.currentlyReading}
              title="Currently Reading"
              handleShelfChanger={this.handleShelfChanger}
            />
            <Shelf
              books={this.state.read}
              title="Read"
              handleShelfChanger={this.handleShelfChanger}
            />
            <Shelf
              books={this.state.wantToRead}
              title="Want to Read"
              handleShelfChanger={this.handleShelfChanger}
            />

            <div className="list-books-content">
              <div />
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>
                Add a book
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BooksApp;
