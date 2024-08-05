import React, {
  useCallback,
  useReducer,
  useMemo,
  useEffect,
  useState,
  useRef,
} from "react";
import styles from "../../Css/Wishlist/Wishlist.module.css";
import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import {
  componentState,
  componentReducer,
} from "../../Modules/Wishlist/Wishlist";
import axios from "axios";

const cx = classNames.bind(styles);

const Add = ({ data, dispatch, ContainerDispatch }) => {
  const { user } = data;
  const { addFolder } = ContainerDispatch;
  const Length = useRef(null);
  const Count = useCallback((e) => {
    Length.current.textContent = e.target.value.length;
  }, []);

  const Cancel = useCallback(() => {
    dispatch({ type: "MODAL_ADD_CANCEL" });
  }, []);

  const AddFolder = useCallback(
    async (e) => {
      e.preventDefault();
      const title = e.target.title.value;
      const isPublic = e.target.isPublic.value;
      // 입력 요소 다 채우기
      if (!isPublic || !title) {
        alert("입력 요소를 다 채워주세요.");
        return;
      }
      const res = await axios.post(`${process.env.REACT_APP_WAITLIST_API_URL}/wishlist/folder`, {
        id: user.id,
        title,
        isPublic,
      }, {withCredentials: true});
      const { folder } = res.data;
      Cancel();
      addFolder(folder);
    },
    [user]
  );

  return (
    <div className={cx("modal")}>
      <div className={cx("modal-nav")}>
        <div className={cx("modal-title")}>폴더 추가</div>
        <div className={cx("cancel")} onClick={Cancel}>
          <div className={cx("cancel-left")}></div>
          <div className={cx("cancel-right")}></div>
        </div>
      </div>
      <form className={cx("form")} onSubmit={AddFolder}>
        <div>
          <label className={cx("label")}>
            <input type="radio" name="isPublic" defaultValue="public" />
            <span className={cx("span")}>PUBLIC</span>
          </label>
          <label>
            <input type="radio" name="isPublic" defaultValue="private" />
            <span className={cx("span")}>PRIVATE</span>
          </label>
        </div>
        <div className={cx("modal-input-box")}>
          <input
            onInput={Count}
            type="text"
            name="title"
            className={cx("modal-input")}
            placeholder="폴더명을 15자 이내로 입력하세요.*"
            maxLength="15"
          />
          <div>
            <span className={cx("modal-length")} ref={Length}>
              0
            </span>
            <span>&nbsp;/&nbsp;15</span>
          </div>
        </div>
        <input className={cx("submit")} type="submit" value="추가" />
      </form>
    </div>
  );
};

const Change = ({ state, dispatch, ContainerDispatch }) => {
  const { currentFolder } = state;
  const { changeName } = ContainerDispatch;
  const Input = useRef(null);
  const Length = useRef(null);

  useEffect(() => {
    if (currentFolder) {
      Input.current.value = currentFolder.title;
      Length.current.textContent = currentFolder.title.length;
    }
  }, [currentFolder]);

  const Count = useCallback((e) => {
    Length.current.textContent = e.target.value.length;
  }, []);

  const Cancel = useCallback(() => {
    dispatch({ type: "MODAL_CHANGE_CANCEL" });
  }, []);

  const ChangeName = useCallback(
    async (e) => {
      e.preventDefault();
      const title = e.target.title.value;
      if (!title) {
        alert("폴더명을 입력하세요");
        return;
      }
      await axios.patch(`${process.env.REACT_APP_WAITLIST_API_URL}/wishlist/folder`, {
        id: currentFolder.id,
        title,
      }, {withCredentials: true});
      Cancel();
      changeName(currentFolder.id, title);
    },
    [currentFolder]
  );

  return (
    <div className={cx("modal")}>
      <div className={cx("modal-nav")}>
        <div className={cx("modal-title")}>폴더명을 입력하세요.</div>
        <div className={cx("cancel")} onClick={Cancel}>
          <div className={cx("cancel-left")}></div>
          <div className={cx("cancel-right")}></div>
        </div>
      </div>
      <form className={cx("form")} onSubmit={ChangeName}>
        <div className={cx("modal-input-box")}>
          <input
            ref={Input}
            onInput={Count}
            type="text"
            name="title"
            className={cx("modal-input")}
            placeholder="폴더명을 15자 이내로 변경하세요.*"
            maxLength="15"
          />
          <div>
            <span className={cx("modal-length")} ref={Length}>
              0
            </span>
            <span>&nbsp;/&nbsp;15</span>
          </div>
        </div>
        <input className={cx("submit")} type="submit" value="추가" />
      </form>
    </div>
  );
};

const Empty = () => {
  return (
    <div className={cx('empty')}>오른쪽 마우스를 클릭해 폴더를 추가해보세요.</div>
  );
};

const Folder = ({ state, data, folder, dispatch }) => {
  const { user, id } = data;
  const navigate = useNavigate();

  const Click = useCallback(
    (e) => {
      dispatch({
        type: "MENU_FOLDER_OPEN",
        position: { x: e.clientX, y: e.clientY },
        currentFolder: folder,
      });
    },
    [folder]
  );

  const Open = useCallback(async () => {
    if (!folder.public && user.id != id) {
      // 비공개폴더인데 본인이 아닐때
      alert("비공개 폴더입니다.");
      return;
    }
    const url = `/list/${folder.id}/${id}`;
    navigate(url);
  }, [user, id]);

  return (
    <div
      className={cx("folder")}
      onContextMenu={Click}
      data-type="folder"
      onDoubleClick={Open}
    >
      <div className={cx("img-box")}>
        <img className="img" src="/img/icon/folder.png" alt="folder" />
        <div className={cx("count", { private: !folder.public })}>
          {folder.count}
        </div>
      </div>
      <div className={cx("title")}>{folder.title}</div>
    </div>
  );
};

const Done = ({ state, data, dispatch }) => {
  const { user, id, done } = data;
  const navigate = useNavigate();
  const Click = useCallback((e) => {
    dispatch({
      type: "MENU_DONE_OPEN",
      position: { x: e.clientX, y: e.clientY },
    });
  }, []);

  const Open = useCallback(async () => {
    if (!done.public && user.id != id) {
      // 비공개폴더인데 본인이 아닐때
      alert("비공개 폴더입니다.");
      return;
    }
    const url = `/donelist/${id}`;
    navigate(url);
  }, [user, id, done]);

  return (
    <div
      className={cx("folder")}
      onContextMenu={Click}
      data-type="folder"
      onDoubleClick={Open}
    >
      <div className={cx("img-box")}>
        <img className="img" src="/img/icon/folder.png" alt="folder" />
        <div className={cx("count", { private: !done.public })}>
          {done.count}
        </div>
      </div>
      <div className={cx("title")}>읽은 것들</div>
    </div>
  );
};

const FolderMenu = ({ data, state, dispatch, ContainerDispatch }) => {
  const { id, user } = data;
  const { position, currentFolder } = state;
  const { deleteFolder, changePublic } = ContainerDispatch;
  const navigate = useNavigate();
  const style = useMemo(() => {
    return {
      left: `${position.x}px`,
      top: `${position.y}px`,
    };
  }, [position]);

  const Open = useCallback(async () => {
    if (!currentFolder.public && user.id != id) {
      // 비공개폴더인데 본인이 아닐때
      alert("비공개 폴더입니다.");
      return;
    }
    const url = `/list/${currentFolder.id}/${id}`;
    navigate(url);
  }, [currentFolder, user, id]);

  const Change = useCallback(() => {
    if (!user || user.id != id) {
      // 현재 로그인 유저와 이 위시리스트 창의 유저가 같아야 한다.
      alert("본인 외에는 권한이 없습니다.");
      dispatch({ type: "NO_MENU_OPEN" });
      return;
    }
    dispatch({ type: "MODAL_CHANGE_OPEN" });
  }, [user]);

  const Delete = useCallback(async () => {
    if (!user || user.id != id) {
      // 현재 로그인 유저와 이 위시리스트 창의 유저가 같아야 한다.
      alert("본인 외에는 권한이 없습니다.");
      dispatch({ type: "NO_MENU_OPEN" });
      return;
    }
    // eslint-disable-next-line no-restricted-globals
    const answer = confirm(
      "폴더 내 모든 독서 리스트가 삭제됩니다. 그래도 폴더를 삭제하시겠습니까?"
    );
    if (!answer) {
      dispatch({ type: "NO_MENU_OPEN" });
      return;
    }
    await axios.delete(`${process.env.REACT_APP_WAITLIST_API_URL}/wishlist/${currentFolder.id}/${user.id}`, {withCredentials: true});
    deleteFolder(currentFolder.id);
    dispatch({ type: "NO_MENU_OPEN" });
  }, [user]);

  const Public = useCallback(async () => {
    if (!user || user.id != id) {
      // 현재 로그인 유저와 이 위시리스트 창의 유저가 같아야 한다.
      alert("본인 외에는 권한이 없습니다.");
      dispatch({ type: "NO_MENU_OPEN" });
      return;
    }
    const current = currentFolder.public;
    const change = !current;
    // eslint-disable-next-line no-restricted-globals
    const answer = confirm(
      `현재 ${current ? "공개" : "비공개"}상태입니다. ${
        change ? "공개" : "비공개"
      }상태로 바꾸시겠습니까?`
    );
    if (!answer) {
      dispatch({ type: "NO_MENU_OPEN" });
      return;
    }
    await axios.patch(`${process.env.REACT_APP_WAITLIST_API_URL}/wishlist/public`, {
      id: currentFolder.id,
      public: change,
      done: false,
    }, {withCredentials: true});
    changePublic(currentFolder.id, change);
    dispatch({ type: "NO_MENU_OPEN" });
  }, [currentFolder]);
  return (
    <div className={cx("folder-menu")} style={style}>
      <div className={cx("menu")} onClick={Open}>
        열기
      </div>
      <div className={cx("menu")} onClick={Change}>
        이름 변경
      </div>
      <div className={cx("menu")} onClick={Delete}>
        삭제
      </div>
      <div className={cx("menu")} onClick={Public}>
        공개&nbsp;/&nbsp;비공개로 전환
      </div>
    </div>
  );
};

const DoneFolderMenu = ({ data, state, dispatch, ContainerDispatch }) => {
  const { id, user, done } = data;
  const { position } = state;
  const { changeDonePublic } = ContainerDispatch;
  const navigate = useNavigate();
  const style = useMemo(() => {
    return {
      left: `${position.x}px`,
      top: `${position.y}px`,
    };
  }, [position]);

  const Open = useCallback(async () => {
    if (!done.public && user.id != id) {
      // 비공개폴더인데 본인이 아닐때
      alert("비공개 폴더입니다.");
      return;
    }
    const url = `/donelist/${id}`;
    navigate(url);
  }, [user, done, id]);

  const Public = useCallback(async () => {
    if (!user || user.id != id) {
      // 현재 로그인 유저와 이 위시리스트 창의 유저가 같아야 한다.
      alert("본인 외에는 권한이 없습니다.");
      dispatch({ type: "NO_MENU_OPEN" });
      return;
    }
    const current = done.public;
    const change = !current;
    // eslint-disable-next-line no-restricted-globals
    const answer = confirm(
      `현재 ${current ? "공개" : "비공개"}상태입니다. ${
        change ? "공개" : "비공개"
      }상태로 바꾸시겠습니까?`
    );
    if (!answer) {
      dispatch({ type: "NO_MENU_OPEN" });
      return;
    }
    await axios.patch(`${process.env.REACT_APP_WAITLIST_API_URL}/wishlist/public`, {
      id: user.id,
      public: change,
      done: true,
    }, {withCredentials: true});
    changeDonePublic(change);
    dispatch({ type: "NO_MENU_OPEN" });
  }, [done]);
  return (
    <div className={cx("folder-menu")} style={style}>
      <div className={cx("menu")} onClick={Open}>
        열기
      </div>
      <div className={cx("menu")} onClick={Public}>
        공개&nbsp;/&nbsp;비공개로 전환
      </div>
    </div>
  );
};

const BlankMenu = ({ data, state, dispatch, ContainerDispatch }) => {
  const { id, user, total } = data;
  const { position } = state;
  const { newFolders } = ContainerDispatch;
  const [visible, setVisible] = useState(false);
  const style = useMemo(() => {
    return {
      left: `${position.x}px`,
      top: `${position.y}px`,
    };
  }, [position]);

  const PointerEnter = useCallback(() => {
    setVisible(true);
  }, []);

  const PointerLeave = useCallback(() => {
    setVisible(false);
  }, []);

  const Add = useCallback(() => {
    if (!user || user.id != id) {
      // 현재 로그인 유저와 이 위시리스트 창의 유저가 같아야 한다.
      alert("본인 외에는 권한이 없습니다.");
      dispatch({ type: "NO_MENU_OPEN" });
      return;
    }
    if (total === 14) {
      alert("폴더는 14개까지만 만들 수 있습니다.");
      dispatch({ type: "NO_MENU_OPEN" });
      return;
    }
    dispatch({ type: "MODAL_ADD_OPEN" });
  }, [user]);

  const Sort = useCallback(
    async (sort, order) => {
      if (!user || user.id != id) {
        // 현재 로그인 유저와 이 위시리스트 창의 유저가 같아야 한다.
        alert("본인 외에는 권한이 없습니다.");
        dispatch({ type: "NO_MENU_OPEN" });
        return;
      }
      const res = await axios.post(`${process.env.REACT_APP_WAITLIST_API_URL}/wishlist/sort`, {
        sort,
        MemberId: user.id,
        order,
      }, {withCredentials: true});
      const { folders } = res.data;
      dispatch({ type: "NO_MENU_OPEN" });
      newFolders(folders);
    },
    [user]
  );

  return (
    <div className={cx("blank-menu")} style={style}>
      <div className={cx("menu")} onClick={Add}>
        새로운 폴더
      </div>
      <div
        className={cx("menu", "sort")}
        onPointerEnter={PointerEnter}
        onPointerLeave={PointerLeave}
      >
        <div>다음으로 정렬</div>
        <img
          className={cx("arrow")}
          src="/img/icon/right-white-arrow.png"
          alt="arrow"
        />
        <div className={cx("sort-menu", { visible })}>
          <div className={cx("menu")} onClick={() => Sort("title", "ASC")}>
            이름
          </div>
          <div className={cx("menu")} onClick={() => Sort("updatedAt", "DESC")}>
            수정일
          </div>
          <div className={cx("menu")} onClick={() => Sort("createdAt", "ASC")}>
            생성일
          </div>
        </div>
      </div>
    </div>
  );
};

const Wishlist = ({ data, loading, ContainerDispatch }) => {
  const [state, dispatch] = useReducer(componentReducer, componentState);
  const { id, nick, done, folders } = data;
  const { menu, modal } = state;

  const ContextMenu = useCallback((e) => {
    e.preventDefault();
    const target = e.target.closest("[data-type]");
    const type = target.dataset.type;
    if (type === "folder") return; // 폴더와 읽은 것들 이벤트는 잡지 않는다.
    if (type === "blank") {
      dispatch({
        type: "MENU_BLANK_OPEN",
        position: { x: e.clientX, y: e.clientY },
      });
    }
  }, []);
  // 콘텍스트 메뉴 보여주는걸 없애줄때
  const Cancel = useCallback(() => {
    dispatch({ type: "NO_MENU_OPEN" });
  }, []);
  return (
    <>
      {loading && <div className="loading">로딩중...</div>}
      {!loading && data && done && (
        <>
          <div className={cx("wishlist")}>
            <div className={cx("nav")}>
              <Link to="/" className={cx("home")}>
                HOME
              </Link>
              <Link to={`/members?member=${id}`} className={cx("nick")}>
                {nick}
              </Link>
            </div>
            <div
              className={cx("wishlist-main", {
                grid: !(done.count == 0 && folders.length == 0),
              })}
              data-type="blank"
              onContextMenu={ContextMenu}
              onClick={Cancel}
            >
              {/* 읽은 것들 폴더의 내용도 없고 생성한 폴더도 없을때는 빈 공간임을 보여준다. */}
              {done.count == 0 && folders.length == 0 ? (
                <Empty />
              ) : (
                <>
                  {folders.map((folder) => (
                    <Folder
                      key={folder.id}
                      folder={folder}
                      state={state}
                      data={data}
                      dispatch={dispatch}
                    />
                  ))}
                  <Done
                    state={state}
                    data={data}
                    dispatch={dispatch}
                  />
                </>
              )}
            </div>
            {menu.folder && (
              <FolderMenu
                data={data}
                state={state}
                dispatch={dispatch}
                ContainerDispatch={ContainerDispatch}
              />
            )}
            {menu.blank && (
              <BlankMenu
                data={data}
                state={state}
                dispatch={dispatch}
                ContainerDispatch={ContainerDispatch}
              />
            )}
            {menu.done && (
              <DoneFolderMenu
                data={data}
                state={state}
                dispatch={dispatch}
                ContainerDispatch={ContainerDispatch}
              />
            )}
          </div>
          {modal.add && (
            <Add
              data={data}
              dispatch={dispatch}
              ContainerDispatch={ContainerDispatch}
            />
          )}
          {modal.change && (
            <Change
              state={state}
              dispatch={dispatch}
              ContainerDispatch={ContainerDispatch}
            />
          )}
        </>
      )}
    </>
  );
};

export default Wishlist;
