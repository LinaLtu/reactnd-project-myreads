import React from "react";
import BookShelfChanger from "./BookShelfChanger.js";
import BookItem from "./BookItem.js";

class Shelf extends React.Component {
  render() {
    console.log("Props in Currently Reading", this.props.bookshelf);
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.title}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            <li>
              <BookItem bookshelf={this.props.bookshelf} />
            </li>
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

export default Shelf;
