import React from "react";
import { getAll, search } from "./BooksAPI.js";
import { Route } from "react-router-dom";
import Noty from "noty";
import "./App.css";
import Search from "./Components/Search.js";
import Shelf from "./Components/Shelf.js";
import OpenSearchButton from "./Components/OpenSearchButton.js";

class BooksApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentlyReading: [],
      read: [],
      wantToRead: [],
      bookListFromSearch: [],
      deletedBooks: [],
      emptyQuery: false
    };

    this.handleShelfChanger = this.handleShelfChanger.bind(this);
    this.handleSearchImputChange = this.handleSearchImputChange.bind(this);
  }

  componentDidMount() {
    let currentlyReading = [];
    let read = [];
    let wantToRead = [];
    let deletedBooks = [];
    let bookListFromSearch = [];

    console.log("Read array ", read);

    let parsedAllBooks = null;

    if (window.localStorage.getItem("allBooks")) {
      parsedAllBooks = JSON.parse(window.localStorage.getItem("allBooks"));
    }

    if (parsedAllBooks) {
      this.setState({
        currentlyReading: parsedAllBooks.currentlyReading,
        read: parsedAllBooks.read,
        wantToRead: parsedAllBooks.wantToRead,
        deletedBooks: parsedAllBooks.deletedBooks,
        bookListFromSearch: []
      });
    } else {
      getAll().then(books => {
        books.forEach(book => {
          if (book.shelf === "read") {
            console.log("Before pushing to a read array ", read);
            read.push(book);
          } else if (book.shelf === "currentlyReading") {
            currentlyReading.push(book);
          } else if (book.shelf === "wantToRead") {
            wantToRead.push(book);
          } else if (book.shelf === "search") {
            bookListFromSearch.push(book);
          } else if (book.shelf === "none") {
            deletedBooks.push(book);
          }
        });
        this.setState({
          currentlyReading,
          read,
          wantToRead,
          deletedBooks,
          bookListFromSearch
        });
      });
    }
  }

  /**
   * @param {number} bookId
   * @param {string} currentShelf
   * @param {string} newShelf
   */
  handleShelfChanger(bookId, currentShelf, newShelf) {
    console.log("handleShelfChanger from - to:", currentShelf, newShelf);

    if (currentShelf === newShelf) {
      return;
    }

    console.log("Book id ", bookId, currentShelf, newShelf);
    console.log("This is our state ", this.state);

    let shelfOfSelectedBook;

    switch (currentShelf) {
      case "currentlyReading":
        shelfOfSelectedBook = this.state.currentlyReading;
        break;
      case "read":
        shelfOfSelectedBook = this.state.read;
        break;
      case "wantToRead":
        shelfOfSelectedBook = this.state.wantToRead;
        break;
      case "search":
        shelfOfSelectedBook = this.state.bookListFromSearch;
        break;

      //in theory no book has a "none" shelf because we don't take it from a none shelf
      // case "none":
      //   shelfOfSelectedBook = this.state.deletedBooks;
      //   break;
      default:
        return;
    }

    const updatedShelves = this.moveBookBetweenShelves(
      bookId,
      shelfOfSelectedBook,
      newShelf
    );

    this.setState({
      [currentShelf]: updatedShelves.oldShelf,
      [newShelf]: updatedShelves.newShelf
    });

    let NotyText = "";
    if (newShelf === "none") {
      NotyText = "Book has been deleted";
    } else {
      NotyText = "Book has been added to a shelf";
    }
    new Noty({
      text: `${NotyText}`,
      layout: "center",
      progressBar: false,
      type: "success",
      theme: "bootstrap-v4",
      timeout: 500,
      animation: {
        open: "animated pulse",
        close: "animated fadeOut"
      }
    }).show();

    console.log("This is the array of the current book: ", shelfOfSelectedBook);
  }

  componentDidUpdate(prevProps, prevState) {
    // setState doesn't update the state immediately
    // so we need to use componentDidUpdate to get the updated state and save it in the localStorage

    let allShelves = {
      currentlyReading: this.state.currentlyReading,
      read: this.state.read,
      wantToRead: this.state.wantToRead,
      deletedBooks: this.state.deletedBooks
    };

    window.localStorage.setItem("allBooks", JSON.stringify(allShelves));
  }

  /**
   * @param {number} bookId
   * @param {string} shelfOfSelectedBook
   * @param {string} newShelf
   */
  moveBookBetweenShelves(bookId, shelfOfSelectedBook, newShelf) {
    if (shelfOfSelectedBook === newShelf) {
      return;
    }

    let shelfBookWillBeMovedTo = [];
    let bookToChange = shelfOfSelectedBook.find(
      bookById => bookById.id === bookId
    );

    bookToChange.shelf = newShelf;
    //here all good. at this point, shelf gets set to "none"

    console.log("Book I want to change:", bookToChange);

    let shelfWithoutSelectedBook = shelfOfSelectedBook.filter(
      bookById => bookById.id !== bookId
    );

    console.log("Book has been deleted", shelfWithoutSelectedBook);
    console.log("About to move to 'none' shelf", this.state);

    //at this point. if "none is selected", newShelf is "none"
    switch (newShelf) {
      case "currentlyReading":
        shelfBookWillBeMovedTo = this.state.currentlyReading;
        break;
      case "read":
        shelfBookWillBeMovedTo = this.state.read;
        break;
      case "wantToRead":
        shelfBookWillBeMovedTo = this.state.wantToRead;
        break;
      case "search":
        shelfBookWillBeMovedTo = this.state.bookListFromSearch;
        break;
      case "none":
        shelfBookWillBeMovedTo = this.state.deletedBooks;
        break;
      default:
        return;
    }

    shelfBookWillBeMovedTo.push(bookToChange);
    console.log("Book added to a new shelf ", shelfBookWillBeMovedTo);

    return {
      oldShelf: shelfWithoutSelectedBook,
      newShelf: shelfBookWillBeMovedTo
    };
  }

  /**
   * @param {object} event
   */
  handleSearchImputChange(e) {
    e.preventDefault();
    e.persist();
    e.stopPropagation();
    if (e.target.value == "") {
      console.log("Search input  field is empty");
      this.setState({ emptyQuery: true, bookListFromSearch: [] });
    }
    if (e.target.value.length >= 3) {
      search(e.target.value)
        .then(results => {
          console.log("Results ", results);
          console.log("Event with results: ", e);

          if (results.error) {
            console.log("Event without results: ", e.target);
            this.setState({
              emptyQuery: true,
              bookListFromSearch: []
            });
          } else {
            results.forEach(result => {
              result.shelf = "search";
            });
            this.setState({ emptyQuery: false, bookListFromSearch: results });
          }

          console.log(
            "This is out stare from handleSearchImputChange ",
            this.state.bookListFromSearch
          );

          console.log("Empty query: ", this.state.emptyQuery);
        })
        .catch(new Error("Something went wrong"));
    }
  }

  render() {
    return (
      <div className="app">
        <Route
          path="/search"
          exact
          render={() => (
            <div>
              <Search
                handleSearchImputChange={this.handleSearchImputChange}
                results={this.state.bookListFromSearch}
                searchStarted={this.state.emptyQuery}
                handleShelfChanger={this.handleShelfChanger}
              />
            </div>
          )}
        />

        <Route
          path="/"
          exact
          render={() => (
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
                books={this.state.wantToRead}
                title="Want to Read"
                handleShelfChanger={this.handleShelfChanger}
              />
              <Shelf
                books={this.state.read}
                title="Read"
                handleShelfChanger={this.handleShelfChanger}
              />

              <div className="list-books-content">
                <div />
              </div>
              <OpenSearchButton />
            </div>
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
