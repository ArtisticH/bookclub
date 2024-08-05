import React, {
  useCallback,
  useReducer,
  useEffect,
  useState,
  useRef,
} from "react";
import styles from "../../Css/Wishlist/List.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { componentState, componentReducer } from "../../Modules/Wishlist/List";
import axios from "axios";

const cx = classNames.bind(styles);

const Add = ({ data, dispatch, ContainerDispatch }) => {
  const { member, FolderId } = data;
  const { addList, updateLists } = ContainerDispatch;
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);

  const PreviewImg = useRef(null);
  const Url = useRef(null);

  const Cancel = useCallback(() => {
    dispatch({ type: "MODAL_ADD_CANCEL" });
  });

  const Change = useCallback(async (e) => {
    const target = e.currentTarget;
    const file = target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post("/list/preview", formData);
    const { url } = res.data;
    setVisible(true);
    PreviewImg.current.src = url;
    Url.current.value = url;
    setClicked(false);
  }, []);

  const ClickDefault = useCallback(() => {
    if (clicked) {
      setVisible(false);
      PreviewImg.current.src = "";
      Url.current.value = "";
      setClicked(false);
    } else {
      setVisible(true);
      PreviewImg.current.src = "/img/icon/default-list.jpeg";
      Url.current.value = "/img/icon/default-list.jpeg";
      setClicked(true);
    }
  }, [clicked]);

  const Submit = useCallback(
    async (e) => {
      e.preventDefault();
      const title = e.target.title.value;
      const author = e.target.author.value;
      const img = Url.current.value;
      if (!img || !title || !author) {
        alert("요소를 빠짐없이 채워주세요.");
        return;
      }
      const res = await axios.post("/list", {
        img,
        title,
        author,
        MemberId: member.id,
        FolderId,
      });
      dispatch({ type: "MODAL_ADD_CANCEL" });
      const { lists } = res.data;
      // 리스트 갯수 증가시키고, 리스트 배열 바꿔치기
      addList();
      updateLists(lists);
    },
    [member, FolderId]
  );

  return (
    <div className={cx("modal", "add")}>
      <div className={cx("modal-nav")}>
        <div className={cx("modal-title")}>리스트 추가</div>
        <div className={cx("cancel")} onClick={Cancel}>
          <div className={cx("cancel-left")}></div>
          <div className={cx("cancel-right")}></div>
        </div>
      </div>
      <form
        onSubmit={Submit}
        className={cx("add-form")}
        action="post"
        encType="multipart/form-data"
      >
        <label htmlFor="add" className={cx("add-label")}>
          <div className={cx("plus-ver")}></div>
          <div className={cx("plus-hor")}></div>
          <div className={cx("preview", { visible })}>
            <img ref={PreviewImg} className="img" src="" alt="preview" />
          </div>
        </label>
        <input
          onChange={Change}
          id="add"
          name="image"
          className={cx("add-file-input")}
          type="file"
          accept="image/*"
        />
        <input ref={Url} type="hidden" name="url" />
        <div className={cx("default", { clicked })} onClick={ClickDefault}>
          *기본 이미지
        </div>
        <input
          className={cx("add-title")}
          name="title"
          type="text"
          maxLength="50"
          placeholder="책 제목을 입력하세요*"
        />
        <input
          className={cx("add-author")}
          name="author"
          type="text"
          maxLength="20"
          placeholder="저자를 입력하세요*"
        />
        <input className={cx("submit")} type="submit" value="등록" />
      </form>
    </div>
  );
};

const Move = ({ state, data, dispatch, ContainerDispatch }) => {
  const { FolderId, lists, member, count } = data;
  const { selected, page, last } = state;
  const { updateLists, deleteLists, updateOthers } = ContainerDispatch
  const Cancel = useCallback(() => {
    dispatch({ type: "MODAL_MOVE_CANCEL" });
  });

  const Submit = useCallback(
    async (e) => {
      e.preventDefault();
      const radios = document.getElementsByName("listFolder");
      let isSelected = false;
      let targetId;
      for (const radio of radios) {
        if (radio.checked) {
          isSelected = true;
          targetId = radio.value;
          break;
        }
      }
      if (!isSelected) {
        alert("이동할 폴더를 선택해주세요.");
        return;
      }
      const text = "해당 리스트들을 선택한 폴더로 이동하시겠습니까?";
      // eslint-disable-next-line no-restricted-globals
      if (!confirm(text)) {
        Cancel();
        return;
      }
      const id = JSON.stringify(selected);
      let res;
      if (page == last && lists.length === 1 && count !== 1) {
        // 마지막 페이지에서 남은 하나 삭제했을때
        res = await axios.post(`/list/move`, {
          id,
          FolderId,
          MemberId: member.id,
          targetId,
          page: page - 1,
        });
        dispatch({ type: "PAGE", payload: page - 1 });
      } else {
        res = await axios.post(`/list/move`, {
          id,
          FolderId,
          MemberId: member.id,
          targetId,
          page,
        });
      }
      const { newLists, others } = res.data;
      updateLists(newLists);
      deleteLists(selected.length);
      updateOthers(others);
      Cancel()
      dispatch({ type: "RESET_SELECTED" });
    },
    [selected, member, FolderId, page, last, lists, count]
  );

  return (
    <div className={cx("modal", "move")}>
      <div className={cx("modal-nav")}>
        <div className={cx("modal-title")}>폴더 이동</div>
        <div className={cx("cancel")} onClick={Cancel}>
          <div className={cx("cancel-left")}></div>
          <div className={cx("cancel-right")}></div>
        </div>
      </div>
      <div className={cx("move-main")}>
        {data.others && data.others.length === 0 ? (
          <div className={cx("move-empty")}>먼저 폴더를 추가해주세요.</div>
        ) : (
          <form className={cx("move-form")} onSubmit={Submit}>
            {data.others &&
              data.others.map((other) => (
                <label key={other.id} className={cx("move-label")}>
                  <div>
                    <input type="radio" name="listFolder" value={other.id} />
                    <span className={cx("move-span")}>{other.title}</span>
                  </div>
                  <div className={cx("move-count")}>{other.count}개</div>
                </label>
              ))}
            <input className={cx("submit")} type="submit" value="등록" />
          </form>
        )}
      </div>
    </div>
  );
};

const Nav = ({ data, state, dispatch, ContainerDispatch }) => {
  const { member, title, count } = data;
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
                {title}&nbsp;(<span>{count}</span>)
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
  const { user, member, lists, count, FolderId } = data;
  const { page, last, selected } = state;
  const { updateLists, deleteLists } = ContainerDispatch;

  const Add = useCallback(() => {
    if (!user || user.id != member.id) {
      alert("본인 외에는 권한이 없습니다.");
      return;
    }
    dispatch({ type: "MODAL_ADD_OPEN" });
  }, [user, member]);

  const Move = useCallback(() => {
    if (!user || user.id != member.id) {
      alert("본인 외에는 권한이 없습니다.");
      return;
    }
    if (!selected.length) {
      alert("먼저 이동할 리스트들을 선택해주세요.");
      return;
    }
    dispatch({ type: "MODAL_MOVE_OPEN" });
  }, [user, member, selected]);

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
    if (page == last && lists.length === 1 && count !== 1) {
      res = await axios.post(`/list/delete`, {
        id,
        FolderId,
        MemberId: member.id,
        page: page - 1,
      });
      dispatch({ type: "PAGE", payload: page - 1 });
    } else {
      res = await axios.post(`/list/delete`, {
        id,
        FolderId,
        MemberId: member.id,
        page,
      });
    }
    const { newLists } = res.data;
    updateLists(newLists);
    deleteLists(selected.length);
    dispatch({ type: "RESET_SELECTED" });
  }, [user, member, page, last, lists, selected]);

  const Read = useCallback(async () => {
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
    if (page == last && lists.length === 1 && count !== 1) {
      // 마지막 페이지에서 남은 하나 삭제했을때
      res = await axios.post(`/list/read`, {
        id,
        FolderId,
        MemberId: member.id,
        page: page - 1
      });
      dispatch({ type: "PAGE", payload: page - 1 });
    } else {
      res = await axios.post(`/list/read`, {
        id,
        FolderId,
        MemberId: member.id,
        page,
      });
    }
    const { newLists } = res.data;
    updateLists(newLists);
    deleteLists(selected.length);
    dispatch({ type: "RESET_SELECTED" });
  }, [user, member, page, last, lists, selected]);

  return (
    <div className={cx("btns")}>
      <div className={cx("btn")} onClick={Add}>
        리스트 추가
      </div>
      <div className={cx("btn")} onClick={Delete}>
        삭제
      </div>
      <div className={cx("btn")} onClick={Move}>
        폴더 이동
      </div>
      <div className={cx("btn")} onClick={Read}>
        완독
      </div>
    </div>
  );
};

const Empty = () => {
  return <div className={cx("empty")}>리스트를 추가해주세요.</div>;
};

const Book = ({ state, list, dispatch }) => {
  const { selected } = state;
  const Select = useCallback(() => {
    if (selected.includes(list.id)) {
      dispatch({ type: "REMOVE_SELECT", id: list.id });
    } else {
      dispatch({ type: "ADD_SELECT", id: list.id });
    }
  }, [selected]);
  return (
    <div className={cx("list-box")} onClick={Select}>
      <div className={cx("img-box", { clicked: selected.includes(list.id) })}>
        <img className="img" src={list.img} alt="" />
      </div>
      <div className={cx("list-title")} dangerouslySetInnerHTML={{ __html: list.title }}></div>
      <div className={cx("list-author")} dangerouslySetInnerHTML={{ __html: list.author }}></div>
    </div>
  );
};

const Pagenation = ({ data, state, ContainerDispatch, dispatch }) => {
  const { last, page } = state;
  const { updateLists } = ContainerDispatch;
  const { FolderId, member } = data;

  const Change = useCallback((e) => {
    dispatch({ type: "PAGE", payload: e.target.value });
  }, []);

  const Move = useCallback(async () => {
    if(page > last) {
      alert('존재하지 않는 페이지입니다.');
      return;
    }
    dispatch({ type: "RESET_SELECTED" });
    const res = await axios.get(`/list/page/${FolderId}/${member.id}/${page}`);
    const lists = res.data.lists;
    updateLists(lists);
  }, [page, last]);

  const Last = useCallback(async () => {
    if(page == last) {
      alert('마지막 페이지입니다.');
      return;
    }
    dispatch({ type: "RESET_SELECTED" });
    const res = await axios.get(`/list/page/${FolderId}/${member.id}/${last}`);
    const lists = res.data.lists;
    updateLists(lists);
    dispatch({ type: "PAGE", payload: last });
  }, [last, page]);

  const First = useCallback(async () => {
    if(page == 1) {
      alert('첫 페이지입니다.');
      return;
    }
    dispatch({ type: "RESET_SELECTED" });
    const res = await axios.get(`/list/page/${FolderId}/${member.id}/${1}`);
    const lists = res.data.lists;
    updateLists(lists);
    dispatch({ type: "PAGE", payload: 1 });
  }, [page]);

  const Next = useCallback(async () => {
    if(page == last) {
      alert('마지막 페이지입니다.');
      return;
    }
    dispatch({ type: "RESET_SELECTED" });
    const target = page != last ? page + 1 : last;
    const res = await axios.get(
      `/list/page/${FolderId}/${member.id}/${target}`
    );
    const lists = res.data.lists;
    updateLists(lists);
    dispatch({ type: "PAGE", payload: target });
  }, [page, last]);

  const Before = useCallback(async () => {
    if(page == 1) {
      alert('첫 페이지입니다.');
      return;
    }
    dispatch({ type: "RESET_SELECTED" });
    const target = page != 1 ? page - 1 : 1;
    const res = await axios.get(
      `/list/page/${FolderId}/${member.id}/${target}`
    );
    const lists = res.data.lists;
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

const List = ({ loading, data, ContainerDispatch }) => {
  const [state, dispatch] = useReducer(componentReducer, componentState);
  const { modal } = state;

  useEffect(() => {
    document.body.style.height = '100vh';
    if (data) {
      const { count } = data;
      // 총리뷰개수를 바탕으로 마지막 페이지를 계산
      // last 상태 변화
      dispatch({ type: "LAST", count });
    }
  }, [data]);

  return (
    <>
      {loading && <div className="loading">로딩중...</div>}
      {!loading && data && (
        <>
          <div className={cx("list")}>
            <div className={cx("list-background")}>
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
                    {data.lists &&
                      data.lists.map((list) => (
                        <Book
                          key={list.id}
                          state={state}
                          list={list}
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
          {modal.add && (
            <Add
              data={data}
              dispatch={dispatch}
              ContainerDispatch={ContainerDispatch}
            />
          )}
          {modal.move && (
            <Move
              state={state}
              data={data}
              dispatch={dispatch}
              ContainerDispatch={ContainerDispatch}
            />
          )}
        </>
      )}
    </>
  );
};

export default List;
