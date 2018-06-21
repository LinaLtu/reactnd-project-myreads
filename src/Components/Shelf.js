import React from "react";
import BookShelfChanger from "./BookShelfChanger.js";
import BookItem from "./BookItem.js";

class Shelf extends React.Component {
  render() {
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.title}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {this.props.books.map(book => (
              <li key={book.id}>
                <BookItem
                  bookInfo={book}
                  onShelfChange={this.props.handleShelfChanger}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }
}

export default Shelf;
