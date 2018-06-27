# MyReads Project

## Main Page

MyReads is an application allowing readers to keep track of their books. On the main page, three bookshelves are displayed: currently reading, read and want to read. Users can move books among shelves by selecting a shelf on a green drop-down menu. It can been found next to every book item. Once the book is moved, a notification is shown and the book is immediately shown on the new shelf.

## Serach

Books can be searched on the Udacity data base. In order to go to the Search page, the user has to either type "/search" into the URL field or click the green icon on the right bottom corner. The user is then redirected to a page with a search field. When more than 3 characters are typed into the search field, the search starts. Search results are updated automatically as new results are found. If no results are found, a message "Currently there are no books on this Shelf" is shown. If any book items are found, they can be moved to one of the three shelves using a drop-down menu. To go back to the main page, the user can click on an arrow icon located on the top left corner.

When the page is refreshed, all books stay on their shelves.

## TL;DR

To get started:

* install all project dependencies with `npm install`
* start the development server with `npm start`
* install ReactDOM with `npm install react react-dom`
* to get notifications when books are added to shelves, install Noty `npm install noty`
