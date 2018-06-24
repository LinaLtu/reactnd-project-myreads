import React from 'react';

class OpenSearchButton extends React.Component {
    render() {
        return (
            <div className="open-search">
                <a onClick={() => this.setState({ showSearchPage: true })}>
                    Add a book
                </a>
            </div>
        );
    }
}

export default OpenSearchButton;
