import { useEffect } from "react";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Members from "../Components/Members";
import {
  getMembers,
} from "../Modules/Members";

const MembersContainer = ({
  loading,
  data,
  getMembers,
}) => {

  const [searchParams, setSearchParams] = useSearchParams();
  const paramId = searchParams.get('member');

  useEffect(() => {
    getMembers();
  }, [getMembers]);

  return (
    <Members data={data} paramId={paramId} loading={loading}/>
  );
};

export default connect(
  ({ members }) => ({
    loading: members.loading,
    data: members.data,
  }),
  {
    getMembers,
  }
)(MembersContainer);
