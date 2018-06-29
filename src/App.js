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
    this.resetSearchState = this.resetSearchState.bind(this);
    this.handleOpenSearchButton = this.handleOpenSearchButton.bind(this);
    this.handleSearchImputChange = this.handleSearchImputChange.bind(this);
  }

  componentDidMount() {
    let currentlyReading = [];
    let read = [];
    let wantToRead = [];
    let deletedBooks = [];
    let search = [];

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
            search.push(book);
          } else if (book.shelf === "none") {
            deletedBooks.push(book);
          }
        });
        this.setState({
          currentlyReading,
          read,
          wantToRead,
          deletedBooks,
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
    console.log(
      "handleShelfChanger from - to:",
      currentShelfName,
      newShelfName
    );

    if (currentShelfName === newShelfName) {
      return;
    }

    console.log("Book id ", bookId, currentShelfName, newShelfName);
    console.log("This is our state ", this.state);

    const updatedShelves = this.moveBookBetweenShelves(
      bookId,
      currentShelfName,
      newShelfName
    );

    // this.setState({
    //   [currentShelfName]: updatedShelves.oldShelf,
    //   [newShelfName]: updatedShelves.newShelf
    // });

    let NotyText = "";
    if (newShelfName === "none") {
      NotyText = "Book has been deleted";
    } else {
      NotyText = "Book has been added to a shelf";
    }

    this.showSuccessMessage(NotyText, true);

    // console.log("This is the array of the current book: ", shelfOfSelectedBook);
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
      deletedBooks: this.state.deletedBooks
    };

    console.log("SETTING ITEM");
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

    //we get a shelf the book should be moved to

    console.log("shelfBookWillBeMovedTo ", shelfBookWillBeMovedTo);

    let shelfBookWillBeMovedTo = "";

    if (this.state[newShelfName]) {
      shelfBookWillBeMovedTo = this.state[newShelfName];
    } else {
      console.log("Error when selecting a new shelf");
      return;
    }

    console.log("SHELF it will be moved into ", shelfBookWillBeMovedTo);

    //we check if the book is already on the shelf

    let filteredResult = "";

    filteredResult = shelfBookWillBeMovedTo.filter(
      bookById => bookById.id === bookId
    );

    if (filteredResult.length !== 0) {
      this.showSuccessMessage("No", false);
      return false;
    } else {
      let bookToChange = shelfOfSelectedBook.find(
        bookById => bookById.id === bookId
      );

      bookToChange.shelf = newShelfName;
      //here all good. at this point, shelf gets set to "none"

      console.log("Book I want to change:", bookToChange);

      let shelfWithoutSelectedBook = shelfOfSelectedBook.filter(
        bookById => bookById.id !== bookId
      );

      shelfBookWillBeMovedTo.push(bookToChange);
      console.log("Book has been deleted", shelfWithoutSelectedBook);
      // console.log("About to move to 'none' shelf", this.state);
      // return {
      //   oldShelf: shelfWithoutSelectedBook,
      //   newShelf: shelfBookWillBeMovedTo
      // };

      this.setState({
        [currentShelfName]: shelfWithoutSelectedBook,
        [newShelfName]: shelfBookWillBeMovedTo
      });
    }
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
      console.log("Search input  field is empty");
      this.resetSearchState();
      return;
    }

    // show results if there are at least 3 characters in the search input field
    if (e.target.value.length >= 3) {
      search(e.target.value)
        .then(results => {
          console.log("Results ", results);
          console.log("Event with results: ", e);

          // handle incorrect search query
          if (results.error) {
            console.log("Event without results: ", e.target);
            this.resetSearchState();
          } else {
            //else set the stare of search
            results.forEach(result => {
              result.shelf = "search";
            });
            this.setState({ search: results });
          }

          console.log(
            "This is out stare from handleSearchImputChange ",
            this.state.search
          );
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
    console.log("in handleOpenSearchButton");
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
