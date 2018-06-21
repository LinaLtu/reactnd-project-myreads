import React from "react";
// import * as BooksAPI from './BooksAPI'
import "./App.css";
import Shelf from "./Components/Shelf.js";
import Search from "./Components/Search.js";
import { getAll } from "./BooksAPI.js";

class BooksApp extends React.Component {
  state = {
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

  handleShelfChanger(bookId) {
    console.log("Book id ", bookId);
    // this.setState();
    // console.log("CIAAAO");
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
