import React from "react";
import BookItem from "./BookItem.js";

class WantToRead extends React.Component {
  render() {
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">Want to Read</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            <li>
              <BookItem bookshelf={this.props.bookshelf} />
            </li>
            <li>
              <BookItem bookshelf={this.props.bookshelf} />
            </li>
          </ol>
        </div>
      </div>
    );
  }
}

export default WantToRead;
