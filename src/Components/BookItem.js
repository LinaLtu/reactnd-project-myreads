import React from "react";
import BookShelfChanger from "./BookShelfChanger.js";

class BookItem extends React.Component {
  render() {
    return (
      <div className="book">
        <div className="book-top">
          <div
            className="book-cover"
            style={{
              width: 128,
              height: 193,
              backgroundImage:
                'url("http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api")'
            }}
          />
          <BookShelfChanger
            onSelectChange={() =>
              this.props.onShelfChange(this.props.bookInfo.id)
            }
          />
        </div>
        <div className="book-title">{this.props.bookInfo.title}</div>
        <div className="book-authors">Harper Lee</div>
      </div>
    );
  }
}

export default BookItem;
