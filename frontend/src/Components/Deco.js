import React, {
  useCallback,
  useReducer,
  useMemo,
  useEffect,
  useRef,
} from "react";
import styles from "../Css/Deco.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { componentState, componentReducer } from "../Modules/Open/Deco";
import axios from "axios";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";

const cx = classNames.bind(styles);

const Preview = ({ state, dispatch }) => {
  const { img, quotes, from, deco, canvas } = state;
  const Canvas = useRef(null);
  const PreviewElem = useRef(null);

  const style = useMemo(() => {
    return {
      fontFamily: `var(--font-${deco.fontFamily})`,
      textAlign: `${deco.textAlign}`,
      color: `${deco.color}`,
      fontSize: `${deco.fontSize}px`,
    };
  }, [deco]);

  useEffect(() => {
    dispatch({
      type: "CANVAS",
      ctx: Canvas.current.getContext("2d"),
      canvas: Canvas.current,
      preview: PreviewElem.current,
    });
  }, [Canvas]);

  const Resize = (e) => {
    if (document.documentElement.clientWidth >= 1300) {
      dispatch({ type: "OVER_1300" });
    } else if (
      document.documentElement.clientWidth >= 1100 &&
      document.documentElement.clientWidth < 1300
    ) {
      dispatch({ type: "1300_1100" });
    } else if (document.documentElement.clientWidth < 1100) {
      dispatch({ type: "UNDER_1100" });
    }
  };

  useEffect(() => {
    window.addEventListener("resize", Resize);
    return () => {
      window.removeEventListener("resize", Resize);
    };
  });

  return (
    <div className={cx("preview")} ref={PreviewElem}>
      <img className={cx("preview-img", { none: img === "" })} src={img} />
      <canvas
        className={cx("canvas")}
        width={canvas.width}
        height={canvas.height}
        ref={Canvas}
      ></canvas>
      <div className={cx("preview-text")} style={style}>
        <div className={cx("preview-quotes")}>{quotes}</div>
        <div className={cx("preview-from")}>{from}</div>
      </div>
    </div>
  );
};

const Options = ({ dispatch, state }) => {
  const { preview, img } = state;

  const Change = useCallback(async (e) => {
    const target = e.currentTarget;
    const file = target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post("/deco/preview", formData);
    const { url } = res.data;
    dispatch({ type: "IMG", url });
  }, []);

  const OpenTextModal = useCallback(() => {
    dispatch({ type: "MODAL_TEXT_OPEN" });
  }, []);

  const Reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const OpenCanvas = useCallback(() => {
    dispatch({ type: "CANVAS_OPEN" });
  }, []);

  const OpenDecoModal = useCallback(() => {
    dispatch({ type: "DECO_OPEN" });
  }, []);

  const Download = useCallback(async () => {
    if (!img) {
      alert("이미지는 필수로 등록해야 합니다.");
      return;
    }
    const saveBlob = await domtoimage.toBlob(preview);
    saveAs(saveBlob, "Decorated.png");
  }, [preview, img]);

  return (
    <form className={cx("options")}>
      <div className={cx("option")}>
        <label htmlFor="img">IMG</label>
        <input
          id="img"
          type="file"
          className={cx("input-file")}
          accept="image/*"
          name="image"
          onChange={Change}
        />
      </div>
      <div className={cx("option")} onClick={OpenTextModal}>
        INPUT
      </div>
      <div className={cx("option")} onClick={OpenCanvas}>
        DRAW
      </div>
      <div className={cx("option")} onClick={OpenDecoModal}>
        DECO
      </div>
      <div className={cx("option", "reset")} onClick={Reset}>
        RESET
      </div>
      <div className={cx("option", "download")} onClick={Download}>
        DOWNLOAD
      </div>
    </form>
  );
};

const TextModal = ({ dispatch }) => {
  const Submit = useCallback((e) => {
    e.preventDefault();
    const quotes = e.target.quotes.value;
    const from = e.target.from.value;
    dispatch({ type: "TEXT", quotes, from });
  }, []);

  const Cancel = useCallback(() => {
    dispatch({ type: "MODAL_TEXT_CANCEL" });
  }, []);

  return (
    <div className={cx("modal")}>
      <div className={cx("modal-nav")}>
        <div className={cx("flex")}>
          <div className={cx("circle")}></div>
          <div>사진에 텍스트를 삽입할 수 있어요.</div>
        </div>
        <div className={cx("cancel")} onClick={Cancel}>
          <div className={cx("cancel-left")}></div>
          <div className={cx("cancel-right")}></div>
        </div>
      </div>
      <form className={cx("modal-form")} onSubmit={Submit}>
        <input
          className={cx("input-text")}
          type="text"
          name="quotes"
          placeholder="입력하세요"
        />
        <input
          className={cx("input-text")}
          type="text"
          name="from"
          placeholder="입력하세요"
        />
        <input className={cx("submit")} type="submit" value="등록" />
      </form>
    </div>
  );
};

const Canvas = ({ dispatch, state }) => {
  const { canvas } = state;
  const Cancel = useCallback(() => {
    dispatch({ type: "CANVAS_CANCEL" });
  }, []);

  const startPosition = useCallback(
    (e) => {
      dispatch({ type: "CANVAS_TRUE" });
      canvas.ctx.lineWidth = 5;
      canvas.ctx.lineCap = "round"; // 선끝의 모양 butt, round, square
      canvas.ctx.strokeStyle = canvas.color;
      draw(e);
    },
    [canvas]
  );

  const draw = useCallback(
    (e) => {
      if (!canvas.painting) return;
      console.log("드로우");
      const rect = canvas.elem.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      canvas.ctx.lineTo(x, y);
      canvas.ctx.stroke(); // lineTo로 지정한 경로를 캔버스에 그린다.
      canvas.ctx.beginPath(); // 새로운 경로 시작, 이전 경로 초기화, 새로운 경로 시작,
      canvas.ctx.moveTo(x, y); // beginPath이 새로운 경로를 생성
    },
    [canvas]
  );

  const endPosition = useCallback(
    (e) => {
      dispatch({ type: "CANVAS_FALSE" });
      canvas.ctx.beginPath();
    },
    [canvas]
  );

  useEffect(() => {
    if (canvas.elem) {
      canvas.elem.addEventListener("pointerdown", startPosition);
      canvas.elem.addEventListener("pointerup", endPosition);
      canvas.elem.addEventListener("pointerout", endPosition);
      canvas.elem.addEventListener("pointermove", draw);
    }
    return () => {
      canvas.elem.removeEventListener("pointerdown", startPosition);
      canvas.elem.removeEventListener("pointerup", endPosition);
      canvas.elem.removeEventListener("pointerout", endPosition);
      canvas.elem.removeEventListener("pointermove", draw);
    };
  }, [canvas]);

  const Color = useCallback((tool) => {
    dispatch({ type: "CANVAS_COLOR", color: tool });
  }, []);

  const Reset = useCallback(() => {
    dispatch({ type: "CANVAS_RESET" });
  }, []);

  return (
    <div className={cx("modal")}>
      <div className={cx("modal-nav")}>
        <div className={cx("flex")}>
          <div className={cx("circle")}></div>
          <div>사진 위에 그림을 그려보세요.</div>
        </div>
        <div className={cx("cancel")} onClick={Cancel}>
          <div className={cx("cancel-left")}></div>
          <div className={cx("cancel-right")}></div>
        </div>
      </div>
      <div className={cx("tools")}>
        <div className={cx("color", "red")} onClick={() => Color("red")}></div>
        <div
          className={cx("color", "orange")}
          onClick={() => Color("orange")}
        ></div>
        <div
          className={cx("color", "yellow")}
          onClick={() => Color("yellow")}
        ></div>
        <div
          className={cx("color", "white")}
          onClick={() => Color("white")}
        ></div>
        <div
          className={cx("color", "green")}
          onClick={() => Color("green")}
        ></div>
        <div
          className={cx("color", "blue")}
          onClick={() => Color("blue")}
        ></div>
        <div
          className={cx("color", "black")}
          onClick={() => Color("black")}
        ></div>
        <div
          className={cx("color", "navy")}
          onClick={() => Color("navy")}
        ></div>
        <div
          className={cx("color", "purple")}
          onClick={() => Color("purple")}
        ></div>
        <div className={cx("tool")} onClick={Reset}>
          리셋
        </div>
      </div>
    </div>
  );
};

const Deco = ({ dispatch }) => {
  const Cancel = useCallback(() => {
    dispatch({ type: "DECO_CANCEL" });
  }, []);
  const Submit = useCallback((e) => {
    e.preventDefault();
    const fontFamily = e.target.font.value;
    const fontSize = e.target.size.value;
    const textAlign = e.target.align.value;
    const color = e.target.color.value;
    const deco = {
      fontFamily,
      fontSize,
      textAlign,
      color,
    };
    dispatch({ type: "DECO", deco });
  }, []);

  return (
    <div className={cx("modal")}>
      <div className={cx("modal-nav")}>
        <div className={cx("flex")}>
          <div className={cx("circle")}></div>
          <div>여러 옵션으로 바꿔보세요.</div>
        </div>
        <div className={cx("cancel")} onClick={Cancel}>
          <div className={cx("cancel-left")}></div>
          <div className={cx("cancel-right")}></div>
        </div>
      </div>
      <form className={cx("modal-form")} onSubmit={Submit}>
        <div className={cx("flex")}>
          <select name="font" className={cx("select")}>
            <option value="">폰트</option>
            <option value="poppins">Poppins</option>
            <option value="montserrat">Montserrat</option>
            <option value="Merriweather">Merriweather</option>
            <option value="korean">Noto Sans KR</option>
          </select>
          <select name="size" className={cx("select")}>
            <option value="">크기</option>
            <option value="16">16px</option>
            <option value="24">24px</option>
            <option value="32">32px</option>
            <option value="48">48px</option>
            <option value="64">64px</option>
            <option value="128">128px</option>
          </select>
          <select name="align" className={cx("select")}>
            <option value="">정렬</option>
            <option value="center">가운데</option>
            <option value="start">처음</option>
            <option value="end">끝</option>
          </select>
          <select name="color" className={cx("select")}>
            <option value="">색상</option>
            <option value="red">빨강</option>
            <option value="white">흰색</option>
            <option value="yellow">노랑</option>
            <option value="green">초록</option>
            <option value="blue">파랑</option>
          </select>
        </div>
        <input className={cx("submit")} type="submit" value="등록" />
      </form>
    </div>
  );
};

const Decoration = () => {
  const [state, dispatch] = useReducer(componentReducer, componentState);
  const { modal } = state;
  return (
    <div className={cx("quotes")}>
      <div className={cx("nav")}>
        <div>Decorate your Img</div>
        <Link to="/" className={cx("home")}>
          HOME
        </Link>
      </div>
      <div className={cx("main")}>
        <div>
          <Preview state={state} dispatch={dispatch} />
          <Options state={state} dispatch={dispatch} />
        </div>
        <div>
          {modal.text && <TextModal dispatch={dispatch} />}
          {modal.canvas && <Canvas state={state} dispatch={dispatch} />}
          {modal.deco && <Deco dispatch={dispatch} />}
        </div>
      </div>
    </div>
  );
};

export default Decoration;
