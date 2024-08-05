import React, {
  useCallback,
  useReducer,
  useEffect,
} from "react";
import styles from "../../Css/Wishlist/Donelist.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import {
  componentState,
  componentReducer,
} from "../../Modules/Wishlist/Donelist";
import axios from "axios";

const cx = classNames.bind(styles);

const Nav = ({ data, state, dispatch, ContainerDispatch }) => {
  const { member, count } = data;
  return (
    <>
      {member && (
        <div className={cx("nav")}>
          <div className={cx("folder")}>
            <Link to={`/wishlist/${member.id}`} className={cx("back")}>
              <img
                className="img"
                src="/img/icon/left-black-arrow.png"
                alt="arrow"
              />
            </Link>
            <div>
              <div className={cx("folder-title")}>
                읽은 것들&nbsp;(<span>{count}</span>)
              </div>
              <Link to={`/members?member=${member.id}`} className={cx("nick")}>
                {member.nick}
              </Link>
            </div>
          </div>
          <Btns
            data={data}
            state={state}
            dispatch={dispatch}
            ContainerDispatch={ContainerDispatch}
          />
        </div>
      )}
    </>
  );
};

const Btns = ({ data, state, dispatch, ContainerDispatch }) => {
  const { user, member, donelists, count } = data;
  const { page, last, selected } = state;
  const { updateDonelists, deleteDonelists } = ContainerDispatch;

  const Delete = useCallback(async () => {
    if (!user || user.id != member.id) {
      alert("본인 외에는 권한이 없습니다.");
      return;
    }
    if (!selected.length) {
      alert("먼저 삭제할 리스트들을 선택해주세요.");
      return;
    }
    let res;
    const id = JSON.stringify(selected);
    if (page == last && donelists.length === 1 && count !== 1) {
      res = await axios.post(`/donelist/delete`, {
        id,
        MemberId: member.id,
        page: page - 1,
      });
      dispatch({ type: "PAGE", payload: page - 1 });
    } else {
      res = await axios.post(`/donelist/delete`, {
        id,
        MemberId: member.id,
        page,
      });
    }
    const { newDone } = res.data;
    updateDonelists(newDone);
    deleteDonelists(selected.length);
    dispatch({ type: "RESET_SELECTED" });
  }, [user, member, page, last, donelists, selected]);

  const Back = useCallback(async () => {
    if (!user || user.id != member.id) {
      alert("본인 외에는 권한이 없습니다.");
      return;
    }
    if (!selected.length) {
      alert("먼저 완독한 리스트들을 선택해주세요.");
      return;
    }
    let res;
    const id = JSON.stringify(selected);
    if (page == last && donelists.length === 1 && count !== 1) {
      // 마지막 페이지에서 남은 하나 삭제했을때
      res = await axios.post('/donelist/back', {
        id,
        MemberId: member.id,
        page: page - 1,
      });
      dispatch({ type: "PAGE", payload: page - 1 });
    } else {
      res = await axios.post(`/donelist/back`, {
        id,
        MemberId: member.id,
        page: page,
      });
    }
    const { newDone } = res.data;
    updateDonelists(newDone);
    deleteDonelists(selected.length);
    dispatch({ type: "RESET_SELECTED" });
  }, [user, member, page, last, donelists, selected]);

  return (
    <div className={cx("btns")}>
      <div className={cx("btn")} onClick={Back}>
        완독 해제
      </div>
      <div className={cx("btn")} onClick={Delete}>
        삭제
      </div>
    </div>
  );
};

const Empty = () => {
  return <div className={cx("empty")}>완독이 필요합니다.</div>;
};

const Pagenation = ({ data, state, ContainerDispatch, dispatch }) => {
  const { last, page } = state;
  const { updateDonelists } = ContainerDispatch;
  const { member } = data;

  const Change = useCallback((e) => {
    dispatch({ type: "PAGE", payload: e.target.value });
  }, []);

  const Move = useCallback(async () => {
    if(page > last) {
      alert('존재하지 않는 페이지입니다.');
      return;
    }
    const res = await axios.get(`/list/page/${member.id}/${page}`);
    const { donelists } = res.data.donelists;
    updateDonelists(donelists);
  }, [page]);

  const Last = useCallback(async () => {
    if(page == last) {
      alert('마지막 페이지입니다.');
      return;
    }
    const res = await axios.get(`/list/page/${member.id}/${last}`);
    const { donelists } = res.data.donelists;
    updateDonelists(donelists);
    dispatch({ type: "PAGE", payload: last });
  }, [last]);

  const First = useCallback(async () => {
    if(page == 1) {
      alert('첫 페이지입니다.');
      return;
    }
    const res = await axios.get(`/list/page/${member.id}/${1}`);
    const { donelists } = res.data.donelists;
    updateDonelists(donelists);
    dispatch({ type: "PAGE", payload: 1 });
  }, []);

  const Next = useCallback(async () => {
    if(page == last) {
      alert('마지막 페이지입니다.');
      return;
    }
    const target = page != last ? page + 1 : last;
    const res = await axios.get(
      `/list/page/${member.id}/${target}`
    );
    const { donelists } = res.data.donelists;
    updateDonelists(donelists);
    dispatch({ type: "PAGE", payload: target });
  }, [page, last]);

  const Before = useCallback(async () => {
    if(page == 1) {
      alert('첫 페이지입니다.');
      return;
    }
    const target = page != 1 ? page - 1 : 1;
    const res = await axios.get(
      `/list/page/${member.id}/${target}`
    );
    const { donelists } = res.data.donelists;
    updateDonelists(donelists);
    dispatch({ type: "PAGE", payload: target });
  }, [page, last]);

  return (
    <div className={cx("pagenation")}>
      <div className={cx("page-btn")} onClick={First}>
        &lt;&lt;
      </div>
      <div className={cx("page-btn")} onClick={Before}>
        &lt;
      </div>
      <input
        onChange={Change}
        type="text"
        name="page"
        className={cx("page-input")}
        value={page}
      />
      <div className={cx("page-last")}>/&nbsp;&nbsp;{last}</div>
      <div className={cx("page-move")} onClick={Move}>
        이동
      </div>
      <div className={cx("page-btn")} onClick={Next}>
        &gt;
      </div>
      <div className={cx("page-btn")} onClick={Last}>
        &gt;&gt;
      </div>
    </div>
  );
};

const Book = ({ state, donelist, dispatch }) => {
  const { selected } = state;
  const Select = useCallback(() => {
    if (selected.includes(donelist.id)) {
      dispatch({ type: "REMOVE_SELECT", id: donelist.id });
    } else {
      dispatch({ type: "ADD_SELECT", id: donelist.id });
    }
  }, [selected]);
  return (
    <div className={cx("list-box")} onClick={Select}>
      <div className={cx("img-box", { clicked: selected.includes(donelist.id) })}>
        <img className="img" src={donelist.img} alt="" />
      </div>
      <div className={cx("list-title")}>{donelist.title}</div>
      <div className={cx("list-author")}>{donelist.author}</div>
    </div>
  );
};

const Donelist = ({ loading, data, ContainerDispatch }) => {
  const [state, dispatch] = useReducer(componentReducer, componentState);

  useEffect(() => {
    if (data) {
      const { count } = data;
      dispatch({ type: "LAST", count });
    }
  }, [data]);

  return (
    <>
      {loading && <div className="loading">로딩중...</div>}
      {!loading && data && (
        <>
          <div className={cx("donelist")}>
            <div className={cx("donelist-background")}>
              <Nav
                data={data}
                state={state}
                dispatch={dispatch}
                ContainerDispatch={ContainerDispatch}
              />
              <div
                className={cx("list-contents", {
                  grid: data && !(data.count === 0),
                })}
              >
                {data && data.count === 0 ? (
                  <Empty />
                ) : (
                  <>
                    {data.donelists &&
                      data.donelists.map((donelist) => (
                        <Book
                          key={donelist.id}
                          state={state}
                          donelist={donelist}
                          dispatch={dispatch}
                        />
                      ))}
                  </>
                )}
              </div>
              {data && data.count !== 0 && (
                <Pagenation
                  data={data}
                  state={state}
                  dispatch={dispatch}
                  ContainerDispatch={ContainerDispatch}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Donelist;
