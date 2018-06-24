import React from 'react';
// import * as BooksAPI from './BooksAPI'
import './App.css';
import Shelf from './Components/Shelf.js';
import OpenSearchButton from './Components/OpenSearchButton.js';
import Search from './Components/Search.js';
import { getAll } from './BooksAPI.js';
import { BrowserRouter as Router, Route } from 'react-router-dom';

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
        console.log('Read array ', read);
        getAll().then(books => {
            books.forEach(book => {
                if (book.shelf === 'read') {
                    console.log('Before pushing to a read array ', read);
                    read.push(book);
                } else if (book.shelf === 'currentlyReading') {
                    currentlyReading.push(book);
                } else if (book.shelf === 'wantToRead') {
                    wantToRead.push(book);
                }
            });
            this.setState({
                currentlyReading,
                read,
                wantToRead
            });
            console.log('state ', this.state);
        });
    }

    /**
     * @param {number} bookId
     * @param {string} currentShelf
     * @param {string} newShelf
     */
    handleShelfChanger(bookId, currentShelf, newShelf) {
        console.log('handleShelfChanger from - to:', currentShelf, newShelf);

        if (currentShelf === newShelf) {
            return;
        }

        console.log('Book id ', bookId, currentShelf, newShelf);
        console.log('This is our state ', this.state);

        let shelfOfSelectedBook;

        //to set the state use function

        // TODO: USE SWITCH
        if (currentShelf === 'currentlyReading') {
            shelfOfSelectedBook = this.state.currentlyReading;
        } else if (currentShelf === 'read') {
            shelfOfSelectedBook = this.state.read;
        } else if (currentShelf === 'wantToRead') {
            shelfOfSelectedBook = this.state.wantToRead;
        }

        const updatedShelves = this.moveBookBetweenShelves(
            bookId,
            shelfOfSelectedBook,
            newShelf
        );

        this.setState({ [currentShelf]: updatedShelves.oldShelf });
        this.setState({ [newShelf]: updatedShelves.newShelf });

        console.log(
            'This is the array of the current book: ',
            shelfOfSelectedBook
        );
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

        let shelfBookWillBeMovedTo;
        let bookToChange = shelfOfSelectedBook.find(
            bookById => bookById.id === bookId
        );
        bookToChange.shelf = newShelf;

        console.log('Book I want to change:', bookToChange);

        let shelfWithoutSelectedBook = shelfOfSelectedBook.filter(
            bookById => bookById.id !== bookId
        );

        console.log('Book has been deleted', shelfWithoutSelectedBook);

        if (newShelf === 'currentlyReading') {
            shelfBookWillBeMovedTo = this.state.currentlyReading;
            console.log(
                'Shelf the book will be moved to',
                shelfBookWillBeMovedTo
            );
        } else if (newShelf === 'read') {
            shelfBookWillBeMovedTo = this.state.read;
        } else if (newShelf === 'wantToRead') {
            shelfBookWillBeMovedTo = this.state.wantToRead;
        }

        shelfBookWillBeMovedTo.push(bookToChange);
        console.log('Book added to a new shelf ', shelfBookWillBeMovedTo);

        return {
            oldShelf: shelfWithoutSelectedBook,
            newShelf: shelfBookWillBeMovedTo
        };
    }

    handleSearchImputChange() {
        console.log('Something is changing in the search');
    }

    render() {
        return (
            <div className="app">
                <Route
                    path="/search"
                    exact
                    render={() => (
                        <Search
                            handleSearchImputChange={
                                this.handleSearchImputChange
                            }
                        />
                    )}
                />
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
                    <OpenSearchButton />
                </div>
            </div>
        );
    }
}

export default BooksApp;
