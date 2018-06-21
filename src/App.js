import React from "react";
// import * as BooksAPI from './BooksAPI'
import "./App.css";
import Shelf from "./Components/Shelf.js";
import Search from "./Components/Search.js";
import { getAll } from "./BooksAPI.js";

class BooksApp extends React.Component {
  state = {
    bookshelf: "currentlyReading",
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

  componentDidMount() {
    console.log("Component did mount worked");
    let read = [];
    console.log("Read books ", read);
    getAll().then(books => {
      books.forEach(book => {
        if (book.shelf === "read") {
          read.push(book);
        }
      });
      this.setState({ read });
      console.log("From the state ", this.state.read);
    });
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
            <Shelf bookshelf={this.state.bookshelf} title="Currently Reading" />
            <Shelf bookshelf={this.state.read} title="Read" />
            <Shelf bookshelf={this.state.bookshelf} title="Wnat to Read" />

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
