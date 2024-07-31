import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Book from "../../Components/Book/Book";
import {
  getBook,
  updateStar,
  addReview,
  deleteReview,
  updateReviews,
  updateLike,
  editReviewDispatch,
} from "../../Modules/Book/Book";

const BookContainer = ({
  loading,
  data,
  getBook,
  updateStar,
  addReview,
  deleteReview,
  updateReviews,
  updateLike,
  editReviewDispatch,
}) => {
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    getBook(id);
  }, [getBook]);

  const ContainerDispatch = {
    updateStar,
    addReview,
    deleteReview,
    updateReviews,
    updateLike,
    editReviewDispatch,
  };

  return (
    <Book data={data} loading={loading} ContainerDispatch={ContainerDispatch} />
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
    addReview,
    updateReviews,
    updateLike,
    editReviewDispatch,
    deleteReview,
  }
)(BookContainer);
