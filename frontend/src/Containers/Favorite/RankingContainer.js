import { useEffect } from "react";
import { connect } from "react-redux";
import Ranking from "../../Components/Favorite/Ranking";
import { getRanking } from "../../Modules/Favorite/Ranking";
import { useParams } from "react-router-dom";

const RankingContainer = ({ result, loading, getRanking }) => {
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    getRanking(id);
  }, [getRanking]); 

  return <Ranking result={result} loading={loading}/>;
};

export default connect(
  ({ ranking }) => ({
    result: ranking.result,
    loading: ranking.loading,
  }),
  {
    getRanking,
  }
)(RankingContainer);
