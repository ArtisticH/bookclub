import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import List from "../../Components/Wishlist/List";
import {
  getList,
  addList,
  updateLists,
  deleteLists
} from "../../Modules/Wishlist/List";

const ListContainer = ({
  loading,
  data,
  getList,
  addList,
  updateLists,
  deleteLists
}) => {

  const params = useParams();
  const folderId = params.forderid;
  const memberId = params.memberid;

  const ContainerDispatch = {
    addList,
    updateLists,
    deleteLists
  }

  useEffect(() => {
    getList(folderId, memberId);
  }, [getList]);

  return (
    <List data={data} loading={loading} ContainerDispatch={ContainerDispatch}/>
  );
};

export default connect(
  ({ list }) => ({
    loading: list.loading,
    data: list.data,
  }),
  {
    getList,
    addList,
    updateLists,
    deleteLists
  }
)(ListContainer);
