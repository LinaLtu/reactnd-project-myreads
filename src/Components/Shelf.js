import React from "react";
import BookItem from "./BookItem.js";

class Shelf extends React.Component {
  render() {
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.title}</h2>
        {this.props.books &&
          this.props.books.length === 0 && (
            <h4 style={{ color: "green" }}>
              Currently there are no books on this shelf
            </h4>
          )}
        <div className="bookshelf-books">
          {this.props.books && (
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
          )}
        </div>
      </div>
    );
  }
}

export default Shelf;
