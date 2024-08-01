import React, { useCallback, useReducer, useMemo, useEffect } from "react";
import styles from "../../Css/Open/Lists.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { componentState, componentReducer } from "../../Modules/Open/Lists";

const cx = classNames.bind(styles);

// const Pagenation = ({ data, state, ContainerDispatch, dispatch }) => {
//   const { last, page } = state;
//   const { updateLists } = ContainerDispatch;
//   const { FolderId, member } = data;

//   const Change = useCallback((e) => {
//     dispatch({ type: "PAGE", payload: e.target.value });
//   }, []);

//   const Move = useCallback(async () => {
//     if(page > last) {
//       alert('존재하지 않는 페이지입니다.');
//       return;
//     }
//     const res = await axios.get(`/list/page/${FolderId}/${member.id}/${page}`);
//     const lists = res.data.lists;
//     updateLists(lists);
//   }, [page]);

//   const Last = useCallback(async () => {
//     if(page == last) {
//       alert('마지막 페이지입니다.');
//       return;
//     }
//     const res = await axios.get(`/list/page/${FolderId}/${member.id}/${last}`);
//     const lists = res.data.lists;
//     updateLists(lists);
//     dispatch({ type: "PAGE", payload: last });
//   }, [last]);

//   const First = useCallback(async () => {
//     if(page == 1) {
//       alert('첫 페이지입니다.');
//       return;
//     }
//     const res = await axios.get(`/list/page/${FolderId}/${member.id}/${1}`);
//     const lists = res.data.lists;
//     updateLists(lists);
//     dispatch({ type: "PAGE", payload: 1 });
//   }, []);

//   const Next = useCallback(async () => {
//     if(page == last) {
//       alert('마지막 페이지입니다.');
//       return;
//     }
//     const target = page != last ? page + 1 : last;
//     const res = await axios.get(
//       `/list/page/${FolderId}/${member.id}/${target}`
//     );
//     const lists = res.data.lists;
//     updateLists(lists);
//     dispatch({ type: "PAGE", payload: target });
//   }, [page, last]);

//   const Before = useCallback(async () => {
//     if(page == 1) {
//       alert('첫 페이지입니다.');
//       return;
//     }
//     const target = page != 1 ? page - 1 : 1;
//     const res = await axios.get(
//       `/list/page/${FolderId}/${member.id}/${target}`
//     );
//     const lists = res.data.lists;
//     updateLists(lists);
//     dispatch({ type: "PAGE", payload: target });
//   }, [page, last]);

//   return (
//     <div className={cx("pagenation")}>
//       <div className={cx("page-btn")} onClick={First}>
//         &lt;&lt;
//       </div>
//       <div className={cx("page-btn")} onClick={Before}>
//         &lt;
//       </div>
//       <input
//         onChange={Change}
//         type="text"
//         name="page"
//         className={cx("page-input")}
//         value={page}
//       />
//       <div className={cx("page-last")}>/&nbsp;&nbsp;{last}</div>
//       <div className={cx("page-move")} onClick={Move}>
//         이동
//       </div>
//       <div className={cx("page-btn")} onClick={Next}>
//         &gt;
//       </div>
//       <div className={cx("page-btn")} onClick={Last}>
//         &gt;&gt;
//       </div>
//     </div>
//   );
// };

const AddFolder = ({ dispatch }) => {
  const Cancel = useCallback(() => {
    dispatch({ type: 'NO_MODAL' })
  }, []);

  return (
    <div className={cx("modal", 'add')}>
      <div className={cx("modal-nav", 'add')}>
        <div className={cx("modal-title")}>폴더 추가 후 등록</div>
        <div className={cx("cancel")} onClick={Cancel}>
          <div className={cx("cancel-left")}></div>
          <div className={cx("cancel-right")}></div>
        </div>
      </div>
      <form className={cx("form-add")}>
        <div className={cx("radio-box")}>
          <label>
            <input id="public" type="radio" name="isPublic" value="public" />
            <span>PUBLIC</span>
          </label>
          <label>
            <input id="private" type="radio" name="isPublic" value="private" />
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
        <input class="submit" type="submit" value="추가" />
      </form>
    </div>
  );
};

const Move = ({ dispatch }) => {
  const ModalAddOpen = useCallback(() => {
    dispatch({ type: 'MODAL_ADD_OPEN' })
  }, []);

  const Cancel = useCallback(() => {
    dispatch({ type: 'NO_MODAL' })
  }, []);


  return (
    <div className={cx("modal", 'folder')}>
      <div className={cx("modal-nav")}>
        <div className={cx("modal-title")}>폴더</div>
        <div className={cx("cancel")} onClick={Cancel}>
          <div className={cx("cancel-left")}></div>
          <div className={cx("cancel-right")}></div>
        </div>
      </div>
      <form className={cx("form-folder")}>
        <div>
          <div className={cx("add-btn")} onClick={ModalAddOpen}>폴더 추가</div>
        </div>
        <div className={cx("empty")} hidden>
          먼저 폴더를 추가해주세요.
        </div>
        <div className={cx("label-box")}>
        <label className={cx("label")}>
          <div>
            <input type="radio" name="folder" value="" />
            <span></span>
          </div>
          <div></div>
        </label>
        </div>
        <input className={cx("submit")} type="submit" value="추가"/>
      </form>
    </div>
  );
};

const Book = ({ list }) => {
  return (
    <div className={cx("list-box")}>
      <div>
        <div className={cx("list-title")}>{list.title}</div>
        <div className={cx("list-line")}></div>
        <div className={cx('common')}>{list.author}</div>
        <div className={cx('common')}>{list.publisher}</div>
        <div className={cx('common')}>{list.date}</div>
        <div className={cx('common')}>{list.codeName}</div>
      </div>
      <div className={cx('img-box')}>
        <img className="img" src={list.img} alt="img" />
      </div>
    </div>
  );
};

const Lists = ({ data, loading, ContainerDispatch }) => {
  const [state, dispatch] = useReducer(componentReducer, componentState);
  const { modal } = state;

  const ModalMoveOpen = useCallback(() => {
    dispatch({ type: 'MODAL_MOVE_OPEN' })
  }, []);

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
              <div className={cx("wish-btn")} onClick={ModalMoveOpen}>WISHLIST에 추가</div>
            </div>
            <div className={cx("main")}>
              {data && data.lists && 
                data.lists.map((list, index) => (
                  <Book key={index} list={list} />
                ))}
            </div>
            <div className={cx("line")}></div>
            {/* <Pagenation /> */}
          </div>
          {modal.move && <Move dispatch={dispatch}/>}
          {modal.add && <AddFolder dispatch={dispatch}/>}
        </>
      )}
    </>
  );
};

export default Lists;
