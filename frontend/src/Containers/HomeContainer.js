import { useEffect } from "react";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Home from "../Components/Home";
import { getHome, LogIn, LogOut } from "../Modules/Home";

const HomeContainer = ({ user, loading, login, members, getHome, LogIn, LogOut }) => {
  const [searchParams] = useSearchParams();
  const auth = searchParams.get('auth');
  let AuthUser;
  let AuthMembers;
  if(auth) {
    AuthUser = JSON.parse(decodeURIComponent(searchParams.get('user')));
    AuthMembers = JSON.parse(decodeURIComponent(searchParams.get('members')));
  }
  
  useEffect(() => {
    getHome(auth, AuthUser, AuthMembers);
  }, [getHome]);
  return (
    <Home
      user={user}
      loading={loading}
      login={login}
      members={members}
      LogIn={LogIn}
      LogOut={LogOut}
    />
  );
};

export default connect(
  ({ home }) => ({
    user: home.user,
    loading: home.loading,
    login: home.login,
    members: home.members,
  }),
  {
    getHome,
    LogIn,
    LogOut,
  }
)(HomeContainer);
