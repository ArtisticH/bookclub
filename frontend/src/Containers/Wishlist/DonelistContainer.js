import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Donelist from "../../Components/Wishlist/Donelist";
import {
  getDonelist,
  updateDonelists,
  deleteDonelists
} from "../../Modules/Wishlist/Donelist";

const DonelistContainer = ({
  loading,
  data,
  getDonelist,
  updateDonelists,
  deleteDonelists
}) => {

  const params = useParams();
  const memberId = params.memberid;

  const ContainerDispatch = {
    updateDonelists,
    deleteDonelists
  }

  useEffect(() => {
    getDonelist(memberId);
  }, [getDonelist]);

  return (
    <Donelist data={data} loading={loading} ContainerDispatch={ContainerDispatch}/>
  );
};

export default connect(
  ({ donelist }) => ({
    loading: donelist.loading,
    data: donelist.data,
  }),
  {
    getDonelist,
    updateDonelists,
    deleteDonelists
  }
)(DonelistContainer);
