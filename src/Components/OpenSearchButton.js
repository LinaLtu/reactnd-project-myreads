import React from "react";
import { Link } from "react-router-dom";

class OpenSearchButton extends React.Component {
  render() {
    return (
      <div className="open-search">
        <Link to="/search" onClick={this.props.handleClick}>
          Add a book
        </Link>
      </div>
    );
  }
}

export default OpenSearchButton;
