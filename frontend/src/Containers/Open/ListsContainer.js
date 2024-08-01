import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Lists from "../../Components/Open/Lists";
import {
  getApiLists,
} from "../../Modules/Open/Lists";

const DonelistContainer = ({
  loading,
  data,
  getApiLists,
}) => {

  const params = useParams();
  const type = params.type;

  const ContainerDispatch = {
  }

  useEffect(() => {
    getApiLists(type);
  }, [getApiLists]);

  return (
    <Lists data={data} loading={loading} ContainerDispatch={ContainerDispatch}/>
  );
};

export default connect(
  ({ apilists }) => ({
    loading: apilists.loading,
    data: apilists.data,
  }),
  {
    getApiLists,
  }
)(DonelistContainer);
