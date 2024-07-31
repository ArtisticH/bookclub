import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import List from "../../Components/Wishlist/List";
import {
  getList,
} from "../../Modules/Wishlist/List";

const ListContainer = ({
  loading,
  data,
  getList,
}) => {

  const params = useParams();
  const folderId = params.forderid;
  const memberId = params.memberid;

  useEffect(() => {
    getList(folderId, memberId);
  }, [getList]);

  return (
    <List data={data} loading={loading}/>
  );
};

export default connect(
  ({ list }) => ({
    loading: list.loading,
    data: list.data,
  }),
  {
    getList,
  }
)(ListContainer);
