import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Wishlist from "../../Components/Wishlist/Wishlist";
import {
  getWishlist,
  addFolder,
  changeName,
  deleteFolder
} from "../../Modules/Wishlist/Wishlist";

const WishlistContainer = ({
  loading,
  data,
  getWishlist,
  addFolder,
  changeName,
  deleteFolder
}) => {

  const params = useParams();
  const id = params.id;

  const ContainerDispatch = {
    addFolder,
    changeName,
    deleteFolder
  }

  useEffect(() => {
    getWishlist(id);
  }, [getWishlist]);

  return (
    <Wishlist data={data} loading={loading} ContainerDispatch={ContainerDispatch}/>
  );
};

export default connect(
  ({ wishlist }) => ({
    loading: wishlist.loading,
    data: wishlist.data,
  }),
  {
    getWishlist,
    addFolder,
    changeName,
    deleteFolder
  }
)(WishlistContainer);
