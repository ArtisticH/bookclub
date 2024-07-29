import { useEffect } from "react";
import { connect } from "react-redux";
import Favorite from "../../Components/Favorite/Favorite";
import { getFavorite } from "../../Modules/Favorite/Favorite";

const FavoriteContainer = ({ categories, loading, getFavorite }) => {
  useEffect(() => {
    getFavorite();
  }, [getFavorite]); // getFavorite가 변경될 수 있는 상황 대비

  return <Favorite categories={categories} loading={loading} />;
};

export default connect(
  ({ favorite }) => ({
    categories: favorite.categories,
    loading: favorite.loading,
  }),
  {
    getFavorite,
  }
)(FavoriteContainer);
