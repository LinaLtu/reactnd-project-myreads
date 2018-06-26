import React from "react";

class BookShelfChanger extends React.Component {
  render() {
    return (
      <div className="book-shelf-changer">
        <select
          id={this.props.bookId}
          onChange={this.props.onSelectChange}
          value={this.props.shelf}
        >
          <option value="move" disabled>
            Move to...
          </option>
          <option value="currentlyReading">Currently Reading</option>
          <option value="wantToRead">Want to Read</option>
          <option value="read">Read</option>
          <option value="">None</option>
        </select>
      </div>
    );
  }
}

export default BookShelfChanger;
