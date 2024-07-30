import { useEffect } from "react";
import { connect } from "react-redux";
import Books from "../../Components/Book/Books";
import { getBooks } from "../../Modules/Book/Books";

const BooksContainer = ({ books, loading, getBooks }) => {
  useEffect(() => {
    getBooks();
  }, [getBooks]);

  return (
    <Books
      books={books}
      loading={loading}
    />
  );
};

export default connect(
  ({ books }) => ({
    books: books.books,
    loading: books.loading,
  }),
  {
    getBooks,
  }
)(BooksContainer);
