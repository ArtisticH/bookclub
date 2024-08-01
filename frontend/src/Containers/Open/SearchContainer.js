import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Search from "../../Components/Open/Search";
import {
  getSearch,
} from "../../Modules/Open/Search";

const SearchContainer = ({
  loading,
  user,
  getSearch,
}) => {

  const ContainerDispatch = {
  }

  useEffect(() => {
    getSearch();
  }, [getSearch]);

  return (
    <Search user={user} loading={loading} ContainerDispatch={ContainerDispatch}/>
  );
};

export default connect(
  ({ search }) => ({
    loading: search.loading,
    user: search.user,
  }),
  {
    getSearch,
  }
)(SearchContainer);
