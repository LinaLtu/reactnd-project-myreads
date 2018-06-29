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
      search: [],
      none: []
    };

    this.handleShelfChanger = this.handleShelfChanger.bind(this);
    this.handleSearchImputChange = this.handleSearchImputChange.bind(this);
    this.resetSearchState = this.resetSearchState.bind(this);
    this.handleOpenSearchButton = this.handleOpenSearchButton.bind(this);
  }

  componentDidMount() {
    let currentlyReading = [];
    let read = [];
    let wantToRead = [];
    let none = [];
    let search = [];

    let parsedAllBooks = null;

    if (window.localStorage.getItem("allBooks")) {
      parsedAllBooks = JSON.parse(window.localStorage.getItem("allBooks"));
    }

    if (parsedAllBooks) {
      this.setState({
        currentlyReading: parsedAllBooks.currentlyReading,
        read: parsedAllBooks.read,
        wantToRead: parsedAllBooks.wantToRead,
        none: parsedAllBooks.none,
        search: []
      });
    } else {
      getAll().then(books => {
        books.forEach(book => {
          if (book.shelf === "read") {
            read.push(book);
          } else if (book.shelf === "currentlyReading") {
            currentlyReading.push(book);
          } else if (book.shelf === "wantToRead") {
            wantToRead.push(book);
          } else if (book.shelf === "search") {
            search.push(book);
          } else if (book.shelf === "none") {
            none.push(book);
          }
        });
        this.setState({
          currentlyReading,
          read,
          wantToRead,
          none,
          search
        });
      });
    }
  }

  /**
   * @param {number} bookId
   * @param {string} currentShelfName
   * @param {string} newShelfName
   */
  handleShelfChanger(bookId, currentShelfName, newShelfName) {
    if (currentShelfName === newShelfName) {
      return;
    }

    // If moving a book from the search, check whether the book is already in one of our allShelves

    if (currentShelfName === "search") {
      let searchedBook = this.state.currentlyReading
        .concat(this.state.read)
        .concat(this.state.wantToRead)
        .find(book => book.id === bookId);

      if (searchedBook) {
        this.showSuccessMessage("This book is already in your library", false);
        return false;
      }

      let index = this.state.none.findIndex(book => book.id === bookId);

      if (index > -1) {
        this.state.none.splice(index, 1);

        this.setState({
          none: this.state.none
        });
      }
    }

    const result = this.moveBookBetweenShelves(
      bookId,
      currentShelfName,
      newShelfName
    );

    // If updatedShelves is undefined or false, the book has not been moved
    if (!result) return;

    let NotyText = "";
    if (newShelfName === "none") {
      NotyText = "Book has been deleted";
    } else {
      NotyText = "Book has been added to a shelf";
    }

    this.showSuccessMessage(NotyText, true);
  }

  /**
   * @param {string} NotyText
   * @param {boolean} type
   * type option: success, error
   */
  showSuccessMessage(NotyText, isSuccess) {
    let type;
    if (isSuccess) {
      type = "success";
    } else {
      type = "error";
    }
    new Noty({
      text: `${NotyText}`,
      layout: "center",
      progressBar: false,
      type: type,
      theme: "bootstrap-v4",
      timeout: 500,
      animation: {
        open: "animated pulse",
        close: "animated fadeOut"
      }
    }).show();
  }

  componentDidUpdate(prevProps, prevState) {
    // setState doesn't update the state immediately
    // so we need to use componentDidUpdate to get the updated state and save it in the localStorage

    let allShelves = {
      currentlyReading: this.state.currentlyReading,
      read: this.state.read,
      wantToRead: this.state.wantToRead,
      none: this.state.none
    };

    window.localStorage.setItem("allBooks", JSON.stringify(allShelves));
  }

  /**
   * @param {number} bookId
   * @param {string} shelfOfSelectedBook
   * @param {string} newShelfName
   */
  moveBookBetweenShelves(bookId, currentShelfName, newShelfName) {
    //we check if the new shelf is the same as the old shelf

    if (currentShelfName === newShelfName) {
      return;
    }

    let shelfOfSelectedBook;

    if (this.state[currentShelfName]) {
      shelfOfSelectedBook = this.state[currentShelfName];
    } else {
      console.log("Error when selecting the current shelf");
      return;
    }

    // We get a shelf the book should be moved to

    let shelfBookWillBeMovedTo = "";

    if (this.state[newShelfName]) {
      shelfBookWillBeMovedTo = this.state[newShelfName];
    } else {
      console.log("Error when selecting a new shelf");
      return;
    }

    let bookToChange = shelfOfSelectedBook.find(
      bookById => bookById.id === bookId
    );

    bookToChange.shelf = newShelfName;
    //here all good. at this point, shelf gets set to "none"

    let shelfWithoutSelectedBook = shelfOfSelectedBook.filter(
      bookById => bookById.id !== bookId
    );

    shelfBookWillBeMovedTo.push(bookToChange);

    this.setState({
      [currentShelfName]: shelfWithoutSelectedBook,
      [newShelfName]: shelfBookWillBeMovedTo
    });

    return true;
  }
  /**
   * @param {object} event
   */
  handleSearchImputChange(e) {
    e.preventDefault();
    e.persist();
    e.stopPropagation();

    // reset the search page if search input field is empty
    if (e.target.value === "") {
      this.resetSearchState();
      return;
    }

    // show results if there are at least 3 characters in the search input field
    if (e.target.value.length >= 3) {
      search(e.target.value)
        .then(results => {
          // handle incorrect search query
          if (results.error) {
            this.resetSearchState();
          } else {
            //else set the stare of search
            results.forEach(result => {
              result.shelf = "search";
            });
            this.setState({ search: results });
          }
        })
        .catch(new Error("Something went wrong"));
    }
  }

  resetSearchState() {
    this.setState({
      search: []
    });
  }

  handleOpenSearchButton() {
    this.resetSearchState();
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
                results={this.state.search}
                searchStarted={this.state.search.length === 0}
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
              <OpenSearchButton handleClick={this.handleOpenSearchButton} />
            </div>
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
