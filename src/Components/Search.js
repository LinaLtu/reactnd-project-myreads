import React from 'react';
import { Link } from 'react-router-dom';
import Shelf from './Shelf.js';

class Search extends React.Component {
    render() {
        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link to="/" className="close-search">
                        Close
                    </Link>
                    <div className="search-books-input-wrapper">
                        {/*
          NOTES: The search from BooksAPI is limited to a particular set of search terms.
          You can find these search terms here:
          https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

          However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
          you don't find a specific author or title. Every search is limited by search terms.
        */}
                        <input
                            type="text"
                            placeholder="Search by title or author"
                            onChange={this.props.handleSearchImputChange}
                        />
                    </div>
                </div>
                <div className="search-books-results">
                    {!this.props.emptyQuery ? (
                        <Shelf
                            title="Search Results"
                            books={this.props.results}
                            handleShelfChanger={this.props.handleShelfChanger}
                        />
                    ) : (
                        <p>Sorry, no results found</p>
                    )}
                </div>
            </div>
        );
    }
}

export default Search;
