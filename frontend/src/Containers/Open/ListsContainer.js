import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Lists from "../../Components/Open/Lists";
import {
  getApiLists,
  updateLists
} from "../../Modules/Open/Lists";

const ListsContainer = ({
  loading,
  data,
  getApiLists,
  updateLists
}) => {

  const params = useParams();
  const paramsType = params.type;

  const ContainerDispatch = {
    updateLists
  }

  useEffect(() => {
    getApiLists(paramsType);
  }, [getApiLists]);

  return (
    <Lists data={data} paramsType={paramsType} loading={loading} ContainerDispatch={ContainerDispatch}/>
  );
};

export default connect(
  ({ apilists }) => ({
    loading: apilists.loading,
    data: apilists.data,
  }),
  {
    getApiLists,
    updateLists
  }
)(ListsContainer);
