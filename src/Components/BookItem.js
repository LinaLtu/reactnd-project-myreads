import React from "react";
import BookShelfChanger from "./BookShelfChanger.js";

class BookItem extends React.Component {
  render() {
    console.log(this.props.bookInfo.imageLinks.thumbnail);
    let url = this.props.bookInfo.imageLinks.thumbnail;
    return (
      <div className="book">
        <div className="book-top">
          <div
            className="book-cover"
            style={{
              width: 128,
              height: 193,
              backgroundImage: `url(${url})`
            }}
          />
          <BookShelfChanger
            bookId={this.props.bookInfo.id}
            onSelectChange={event =>
              this.props.onShelfChange(
                this.props.bookInfo.id,
                this.props.bookInfo.shelf,
                event.target.value
              )
            }
          />
        </div>
        <div className="book-title">{this.props.bookInfo.title}</div>
        {this.props.bookInfo.authors.map(author => (
          <div className="book-authors" key={author}>
            {author}
          </div>
        ))}
      </div>
    );
  }
}

export default BookItem;
