import { useEffect } from "react";
import { connect } from "react-redux";
import Home from "../Components/Home";
import { getHome, LogIn, LogOut } from "../Modules/Home";

const HomeContainer = ({ user, loading, login, members, getHome, LogIn, LogOut }) => {
  // user, loading, login, members는 상태 데이터
  // getHome는 컨테이너 마운트할때 처음에 호출하는 비동기 함수
  // LogIn, LogOut은 컴포넌트 내에서 루트 리듀서에 저장된 상태를 바꿀때 쓴다. 
  useEffect(() => {
    getHome();
  }, [getHome]);

  // login = true이면 user를 사용해 유저 카드를 보여주고
  // login = false라면 기본의 로그인/회원가입 화면을 보여준다.
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
