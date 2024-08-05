import React, { useCallback, useReducer, useMemo, useEffect } from "react";
import styles from "../../Css/Open/Lists.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import axios from "axios";
import { componentState, componentReducer } from "../../Modules/Open/Lists";

const cx = classNames.bind(styles);

const Pagenation = ({ state, paramsType, ContainerDispatch, dispatch }) => {
  const { last, page } = state;
  const { updateLists } = ContainerDispatch;

  const Change = useCallback((e) => {
    dispatch({ type: "PAGE", payload: e.target.value });
  }, []);

  const Move = useCallback(async () => {
    if(page > last) {
      alert('존재하지 않는 페이지입니다.');
      return;
    }
    const res = await axios.post(`${process.env.REACT_APP_WAITLIST_API_URL}/open/page`, {
      type: paramsType,
      page,
    },
    {withCredentials: true});
    const lists = JSON.parse(res.data.lists);
    updateLists(lists);
  }, [page, last]);

  const Last = useCallback(async () => {
    if(page == last) {
      alert('마지막 페이지입니다.');
      return;
    }
    const res = await axios.post(`${process.env.REACT_APP_WAITLIST_API_URL}/open/page`, {
      type: paramsType,
      page: last,
    },
    {withCredentials: true});
    const lists = JSON.parse(res.data.lists);
    updateLists(lists);
    dispatch({ type: "PAGE", payload: last });
  }, [last, page]);

  const First = useCallback(async () => {
    if(page == 1) {
      alert('첫 페이지입니다.');
      return;
    }
    const res = await axios.post(`${process.env.REACT_APP_WAITLIST_API_URL}/open/page`, {
      type: paramsType,
      page: 1,
    },
    {withCredentials: true});
    const lists = JSON.parse(res.data.lists);
    updateLists(lists);
    dispatch({ type: "PAGE", payload: 1 });
  }, [page]);

  const Next = useCallback(async () => {
    if(page == last) {
      alert('마지막 페이지입니다.');
      return;
    }
    const target = page != last ? page + 1 : last;
    const res = await axios.post(`${process.env.REACT_APP_WAITLIST_API_URL}/open/page`, {
      type: paramsType,
      page: target,
    },
    {withCredentials: true});
    const lists = JSON.parse(res.data.lists);
    updateLists(lists);
    dispatch({ type: "PAGE", payload: target });
  }, [page, last]);

  const Before = useCallback(async () => {
    if(page == 1) {
      alert('첫 페이지입니다.');
      return;
    }
    const target = page != 1 ? page - 1 : 1;
    const res = await axios.post(`${process.env.REACT_APP_WAITLIST_API_URL}/open/page`, {
      type: paramsType,
      page: target,
    },
    {withCredentials: true});
    const lists = JSON.parse(res.data.lists);
    updateLists(lists);
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

const AddFolder = ({ dispatch, state, data, paramsType }) => {
  const { user } = data;
  const { selected } = state;
  const Cancel = useCallback(() => {
    dispatch({ type: "NO_MODAL" });
  }, []);

  const Submit = useCallback(async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const isPublic = e.target.isPublic.value;
    if(!title || !isPublic) {
      alert('모든 입력 요소를 채워주세요.');
      return;
    }
    await axios.post(`${process.env.REACT_APP_WAITLIST_API_URL}/open/add`, {
      MemberId: user.id,
      title,
      isPublic,
      ids: JSON.stringify(selected),
      type: paramsType,
    },
    {withCredentials: true});
    Cancel();
    dispatch({ type: "RESET_SELECTED" });
    alert('폴더 생성 후 등록이 완료되었습니다!');
  }, [selected, user]);

  return (
    <div className={cx("modal")}>
      <div className={cx("modal-nav", "add")}>
        <div className={cx("modal-title")}>폴더 추가 후 등록</div>
        <div className={cx("cancel")} onClick={Cancel}>
          <div className={cx("cancel-left")}></div>
          <div className={cx("cancel-right")}></div>
        </div>
      </div>
      <form className={cx("form-add")} onSubmit={Submit}>
        <div className={cx("radio-box")}>
          <label className={cx("add-label")}>
            <input className={cx("add-radio")} id="public" type="radio" name="isPublic" value="public" />
            <span>PUBLIC</span>
          </label>
          <label>
            <input className={cx("add-radio")} id="private" type="radio" name="isPublic" value="private" />
            <span>PRIVATE</span>
          </label>
        </div>
        <input
          className={cx("add-input")}
          type="text"
          placeholder="15자 이내로 폴더 이름을 입력하세요*"
          name="title"
          maxLength="15"
        />
        <input className={cx("submit")} type="submit" value="추가" />
      </form>
    </div>
  );
};

const Move = ({ dispatch, state, data, paramsType }) => {
  const { folders, selected } = state;
  const { user } = data;
  const ModalAddOpen = useCallback(() => {
    dispatch({ type: "MODAL_ADD_OPEN" });
  }, []);

  const Cancel = useCallback(() => {
    dispatch({ type: "NO_MODAL" });
  }, []);

  const Submit = useCallback(async (e) => {
    e.preventDefault();
    const FolderId = e.target.folder.value;
    if(!FolderId) {
      alert('이동할 폴더를 선택해주세요.');
      return;
    }
    await axios.post(`${process.env.REACT_APP_WAITLIST_API_URL}/open/exist`, {
      ids: JSON.stringify(selected),
      FolderId,
      MemberId: user.id,
      type: paramsType,
    },
    {withCredentials: true});
    Cancel();
    dispatch({ type: "RESET_SELECTED" });
    alert('해당 폴더에 등록이 완료되었습니다!');
  }, [user, selected, paramsType]);

  return (
    <div className={cx("modal")}>
      <div className={cx("modal-nav")}>
        <div className={cx("modal-title")}>폴더</div>
        <div className={cx("cancel")} onClick={Cancel}>
          <div className={cx("cancel-left")}></div>
          <div className={cx("cancel-right")}></div>
        </div>
      </div>
      <form className={cx("form-folder")} onSubmit={Submit}>
        <div className={cx("add-btn-flex")}>
          <div className={cx("add-btn")} onClick={ModalAddOpen}>
            폴더 추가
          </div>
        </div>
        {folders.length === 0 ? (
          <div className={cx("empty")}>먼저 폴더를 추가해주세요.</div>
        ) : (
          <div className={cx("label-box")}>
            {folders.map((folder) => (
              <label key={folder.id} className={cx("label")}>
                <div>
                  <input className={cx("radio")} type="radio" name="folder" value={folder.id} />
                  <span>{folder.title}</span>
                </div>
                <div>{folder.count}</div>
              </label>
            ))}
          </div>
        )}
        <input className={cx("submit")} type="submit" value="추가" />
      </form>
    </div>
  );
};

const Book = ({ list, state, dispatch }) => {
  const { selected } = state;
  const Select = useCallback(() => {
    if (selected.includes(list.id)) {
      dispatch({ type: "REMOVE_SELECT", id: list.id });
    } else {
      dispatch({ type: "ADD_SELECT", id: list.id });
    }
  }, [selected]);

  return (
    <div
      className={cx("list-box", { clicked: selected.includes(list.id) })}
      onClick={Select}
    >
      <div>
        <div className={cx("list-title")}>{list.title}</div>
        <div className={cx("list-line")}></div>
        <div className={cx("common")}>{list.author}</div>
        <div className={cx("common")}>{list.publisher}</div>
        <div className={cx("common")}>{list.date}</div>
        <div className={cx("common")}>{list.codeName}</div>
      </div>
      <div className={cx("img-box")}>
        <img className="img" src={list.img} alt="img" />
      </div>
    </div>
  );
};

const Lists = ({ data, paramsType, loading, ContainerDispatch }) => {
  const [state, dispatch] = useReducer(componentReducer, componentState);
  const { modal, selected } = state;
  const { user } = data;

  useEffect(() => {
    if (data) {
      const { total } = data;
      dispatch({ type: "LAST", total });
    }
  }, [data]);

  const ModalMoveOpen = useCallback(async () => {
    if (!user) {
      alert("로그인 후 이용하세요.");
      return;
    }
    if(!selected.length) {
      alert('리스트들을 먼저 선택헤주세요');
      return;
    }
    // 이 유저가 가진 폴더 목록들 보여주기
    const res = await axios.get(`${process.env.REACT_APP_WAITLIST_API_URL}/open/folders/${user.id}`,
    {withCredentials: true});
    const { folders } = res.data;
    dispatch({ type: "FOLDERS", payload: folders });
    dispatch({ type: "MODAL_MOVE_OPEN" });
  }, [user, selected]);

  return (
    <>
      {loading && <div className="loading">로딩중...</div>}
      {!loading && data && (
        <>
          <div>
            <img src={data.img} alt="img" className={cx("deco-img")} />
            <div className={cx("nav")}>
              <Link to="/open">BACK</Link>
              <Link to="/">HOME</Link>
            </div>
            <div className={cx("title")}>{data.title}</div>
            <div className={cx("wish")}>
              <div className={cx("wish-btn")} onClick={ModalMoveOpen}>
                WISHLIST에 추가
              </div>
            </div>
            <div className={cx("main")}>
              {data &&
                data.lists &&
                data.lists.map((list, index) => (
                  <Book
                    key={index}
                    list={list}
                    state={state}
                    dispatch={dispatch}
                  />
                ))}
            </div>
            <div className={cx("line")}></div>
            <Pagenation paramsType={paramsType} state={state} dispatch={dispatch} ContainerDispatch={ContainerDispatch}/>
          </div>
          {modal.move && <Move data={data} dispatch={dispatch} state={state} paramsType={paramsType}/>}
          {modal.add && <AddFolder data={data} state={state} dispatch={dispatch} paramsType={paramsType}/>}
        </>
      )}
    </>
  );
};

export default Lists;
