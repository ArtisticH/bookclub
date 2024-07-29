import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import Tournament from "../../Components/Favorite/Tournament";
import { getCategory } from "../../Modules/Favorite/Tournament";

const TournamentContainer = ({ category, loading, getCategory }) => {
  const params = useParams();
  const id = params.id;
  const round = params.round;

  useEffect(() => {
    getCategory(id, round);
  }, [getCategory]); 

  return <Tournament category={category} loading={loading} id={id} round={round}/>;
};

export default connect(
  ({ tournament }) => ({
    category: tournament.category,
    loading: tournament.loading,
  }),
  {
    getCategory,
  }
)(TournamentContainer);
