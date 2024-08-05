import React, { useReducer, useCallback, useRef } from "react";
import styles from "../../Css/Open/Search.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import axios from "axios";
import { componentState, componentReducer } from "../../Modules/Open/Search";

const cx = classNames.bind(styles);

const AddFolder = ({ dispatch, state, user }) => {
  const { select } = state;
  const Cancel = useCallback(() => {
    dispatch({ type: "NO_MODAL" });
  }, []);

  const Submit = useCallback(
    async (e) => {
      e.preventDefault();
      const title = e.target.title.value;
      const isPublic = e.target.isPublic.value;
      if (!title || !isPublic) {
        alert("모든 입력 요소를 채워주세요.");
        return;
      }
      await axios.post(`${process.env.REACT_APP_WAITLIST_API_URL}/open/search/add`, {
        MemberId: user.id,
        title,
        isPublic,
        list: JSON.stringify(select),
      },
      {withCredentials: true});
      Cancel();
      dispatch({ type: "RESET_SELECT" });
      alert("폴더 생성 후 등록이 완료되었습니다!");
    },
    [select, user]
  );

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
            <input
              className={cx("add-radio")}
              id="public"
              type="radio"
              name="isPublic"
              value="public"
            />
            <span>PUBLIC</span>
          </label>
          <label>
            <input
              className={cx("add-radio")}
              id="private"
              type="radio"
              name="isPublic"
              value="private"
            />
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

const Move = ({ dispatch, state, user }) => {
  const { folders, select } = state;

  const ModalAddOpen = useCallback(() => {
    dispatch({ type: "MODAL_ADD_OPEN" });
  }, []);

  const Cancel = useCallback(() => {
    dispatch({ type: "NO_MODAL" });
  }, []);

  const Submit = useCallback(
    async (e) => {
      e.preventDefault();
      const FolderId = e.target.folder.value;
      if (!FolderId) {
        alert("이동할 폴더를 선택해주세요.");
        return;
      }
      await axios.post(`${process.env.REACT_APP_WAITLIST_API_URL}/open/search/exist`, {
        list: JSON.stringify(select),
        FolderId,
        MemberId: user.id,
      },
      {withCredentials: true});
      Cancel();
      dispatch({ type: "RESET_SELECT" });
      alert("해당 폴더에 등록이 완료되었습니다!");
    },
    [user, select]
  );

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
                  <input
                    className={cx("radio")}
                    type="radio"
                    name="folder"
                    value={folder.id}
                  />
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

const ResultZone = ({ state, dispatch, user }) => {
  const { lists, option, kwd } = state;
  const Cancel = useCallback(() => {
    dispatch({ type: "NO_RESULT_MODAL" });
  }, []);
  return (
    <div className={cx("result")}>
      <div className={cx("result-nav")}>
        <div className={cx("cancel")} onClick={Cancel}>
          <div className={cx("cancel-left")}></div>
          <div className={cx("cancel-right")}></div>
        </div>
      </div>
      <div className={cx("result-title")}>
        <span className={cx("title-select")}>{option}</span>
        &nbsp;:&nbsp;
        <span className={cx("title-kwd")}>{kwd}</span>
        &nbsp;검색결과
      </div>
      <div className={cx("result-line")}></div>
      <div className={cx("result-main")}>
        {lists &&
          lists.map((list, index) => (
            <Result
              key={index}
              user={user}
              list={list}
              state={state}
              dispatch={dispatch}
            />
          ))}
      </div>
      <img src="/img/open/line.png" alt="img" className={cx("line-top")} />
      <img src="/img/open/line.png" alt="img" className={cx("line-bottom")} />
      <img src="/img/open/line.png" alt="img" className={cx("line-left")} />
      <img src="/img/open/line.png" alt="img" className={cx("line-right")} />
    </div>
  );
};

const Result = ({ list, dispatch, user }) => {
  const Click = useCallback(async () => {
    if (!user) {
      alert("로그인 후 이용해주세요.");
      return;
    }
    const res = await axios.get(`${process.env.REACT_APP_WAITLIST_API_URL}/open/folders/${user.id}`,
    {withCredentials: true});
    const { folders } = res.data;
    dispatch({ type: "CLICK_WISHLIST", list, folders });
  }, [user]);
  return (
    <div className={cx("result-box")}>
      <div className={cx("contents")}>
        <div className={cx("result-img-box")}>
          <img className="img" src={list.img} alt="img" />
        </div>
        <div className={cx("result-info")}>
          <div
            className={cx("result-info-title")}
            dangerouslySetInnerHTML={{ __html: list.title }}
          ></div>
          <div className={cx("result-info-line")}>
            <span dangerouslySetInnerHTML={{ __html: list.author }}></span>
            <span className={cx("result-ver")}></span>
            <span dangerouslySetInnerHTML={{ __html: list.pub }}></span>
          </div>
          <div className={cx("result-info-line")}>
            <span>{list.year}</span>
            <span className={cx("result-ver")}></span>
            청구기호:&nbsp;<span>{list.call}</span>
          </div>
          <div className={cx("result-place-zone")}>
            <span>자료이용장소:&nbsp;</span>
            <span className={cx("result-place")}>{list.place}</span>
          </div>
        </div>
      </div>
      <div className={cx("result-btns")}>
        <a className={cx("result-btn")} href={list.detail} target="_blank">
          원문 URL
        </a>
        <div className={cx("result-btn")} onClick={Click}>
          WISHLIST에 추가
        </div>
      </div>
    </div>
  );
};
const SearchZone = ({ dispatch }) => {
  const Select = useRef(null);
  const Input = useRef(null);

  const Submit = useCallback(async (e) => {
    e.preventDefault();
    const option = e.target.options.value;
    const kwd = e.target.kwd.value;
    if (!kwd || !option) {
      alert("모든 입력 칸을 채워주세요.");
      return;
    }
    const res = await axios.post(`${process.env.REACT_APP_WAITLIST_API_URL}/open/search`, {
      option,
      kwd,
    },
    {withCredentials: true});
    const { lists } = res.data;
    dispatch({ type: "DONE_SEARCH", lists, option, kwd });
    Input.current.value = "";
    Select.current.selectedIndex = 0;
  });

  return (
    <div className={cx("search-zone")}>
      <div className={cx("nav")}>
        <Link to="/open">BACK</Link>
        <Link to="/">HOME</Link>
      </div>
      <div className={cx("exp")}>
        국립중앙도서관 오프라인 도서 자료 검색 결과를 10건 반환합니다.
      </div>
      <form className={cx("form")} onSubmit={Submit}>
        <div className={cx("select-zone")}>
          <img
            className={cx("select-img")}
            src="/img/open/search-select.png"
            alt="img"
          />
          <select
            id="targets"
            name="options"
            className={cx("select")}
            ref={Select}
          >
            <option value="전체">전체</option>
            <option value="제목">제목</option>
            <option value="저자">저자</option>
            <option value="발행자">발행자</option>
          </select>
        </div>
        <div className={cx("input-zone")}>
          <img
            className={cx("input-img")}
            src="/img/open/search-input.png"
            alt="img"
          />
          <input
            ref={Input}
            className={cx("kwd", "none")}
            type="text"
            name="kwd"
            placeholder="검색어를 입력해주세요*"
          />
        </div>
        <div className={cx("search-btn")}>
          <img
            className={cx("search-img")}
            src="/img/open/glasses.png"
            alt="img"
          />
          <input
            className={cx("search-input", "none")}
            type="submit"
            value=""
          />
        </div>
      </form>
    </div>
  );
};
const Search = ({ loading, user }) => {
  const [state, dispatch] = useReducer(componentReducer, componentState);
  const { modal } = state;
  return (
    <>
      {loading && <div className="loading">로딩중...</div>}
      {!loading && (
        <>
          <SearchZone dispatch={dispatch} />
          {modal.result && (
            <ResultZone user={user} state={state} dispatch={dispatch} />
          )}
          {modal.move && <Move user={user} dispatch={dispatch} state={state} />}
          {modal.add && (
            <AddFolder user={user} state={state} dispatch={dispatch} />
          )}
        </>
      )}
    </>
  );
};

export default Search;
