import React from 'react';
// import * as BooksAPI from './BooksAPI'
import './App.css';
import Shelf from './Components/Shelf.js';
import OpenSearchButton from './Components/OpenSearchButton.js';
import Search from './Components/Search.js';
import { getAll, search } from './BooksAPI.js';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class BooksApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentlyReading: [],
            read: [],
            wantToRead: [],
            bookListFromSearch: [],
            emptyQuery: false
            // inputValue: ""
        };

        this.handleShelfChanger = this.handleShelfChanger.bind(this);
        this.handleSearchImputChange = this.handleSearchImputChange.bind(this);
    }

    componentDidMount() {
        let currentlyReading = [];
        let read = [];
        let wantToRead = [];
        let bookListFromSearch = [];
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
                } else if (book.shelf === null) {
                    bookListFromSearch.push(book);
                }
            });
            this.setState({
                currentlyReading,
                read,
                wantToRead,
                bookListFromSearch
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

        switch (currentShelf) {
            case 'currentlyReading':
                shelfOfSelectedBook = this.state.currentlyReading;
                break;
            case 'read':
                shelfOfSelectedBook = this.state.read;
                break;
            case 'wantToRead':
                shelfOfSelectedBook = this.state.wantToRead;
                break;
            case null:
                shelfOfSelectedBook = this.state.bookListFromSearch;
                break;
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

        switch (newShelf) {
            case 'currentlyReading':
                shelfBookWillBeMovedTo = this.state.currentlyReading;
                break;
            case 'read':
                shelfBookWillBeMovedTo = this.state.read;
                break;
            case 'wantToRead':
                shelfBookWillBeMovedTo = this.state.wantToRead;
                break;
            case null:
                shelfBookWillBeMovedTo = this.state.bookListFromSearch;
                break;
        }

        shelfBookWillBeMovedTo.push(bookToChange);
        console.log('Book added to a new shelf ', shelfBookWillBeMovedTo);

        return {
            oldShelf: shelfWithoutSelectedBook,
            newShelf: shelfBookWillBeMovedTo
        };
    }

    /**
     * @param {object} event
     */
    handleSearchImputChange(e) {
        console.log('This is out state ', this.state.inputValue);
        if (e.target.value.length >= 3) {
            console.log('We are HEREEE');
            search(e.target.value)
                .then(results => {
                    console.log('Results ', results);

                    if (results.error) {
                        this.setState({
                            emptyQuery: true,
                            bookListFromSearch: []
                        });
                    } else {
                        results.forEach(result => {
                            result.shelf = null;
                        });
                        this.setState({ bookListFromSearch: results });
                    }

                    console.log(
                        'This is out stare from handleSearchImputChange ',
                        this.state.bookListFromSearch
                    );

                    console.log('Empty query: ', this.state.emptyQuery);
                })
                .catch(new Error('Something went wrong'));
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
                                handleSearchImputChange={
                                    this.handleSearchImputChange
                                }
                                results={this.state.bookListFromSearch}
                                searchStarted={this.state.emptyQuery}
                                handleShelfChanger={this.handleShelfChanger}
                            />
                        </div>
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
