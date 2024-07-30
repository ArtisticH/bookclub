import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Book from "../../Components/Book/Book";
import {
  getBook,
  updateStar,
  updateTotalReview,
  updateReviews,
  updateLike,
} from "../../Modules/Book/Book";

const BookContainer = ({
  loading,
  data,
  getBook,
  updateStar,
  updateTotalReview,
  updateReviews,
  updateLike,
}) => {
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    getBook(id);
  }, [getBook]);

  return (
    <Book
      data={data}
      loading={loading}
      updateStar={updateStar}
      updateTotalReview={updateTotalReview}
      updateReviews={updateReviews}
      updateLike={updateLike}
    />
  );
};

export default connect(
  ({ book }) => ({
    loading: book.loading,
    data: book.data,
  }),
  {
    getBook,
    updateStar,
    updateTotalReview,
    updateReviews,
    updateLike,
  }
)(BookContainer);
