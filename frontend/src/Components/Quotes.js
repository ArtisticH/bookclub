import React, {
  useCallback,
  useReducer,
  useMemo,
  useEffect,
  useRef,
} from "react";
import styles from "../Css/Quotes.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { componentState, componentReducer } from "../Modules/Open/Quotes";
import axios from "axios";
import mergeImages from 'merge-images';

const cx = classNames.bind(styles);

const Preview = ({ state, dispatch }) => {
  const { img, quotes, from, deco, modal } = state;
  const Canvas = useRef(null);
  const Img = useRef(null);

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
      imgElem: Img.current,
    });
  }, [Img, Canvas]);

  return (
    <div className={cx("preview")}>
      <img className={cx("preview-img", { none: img === "" })} src={img} ref={Img}/>
      <canvas
        className={cx("canvas")}
        width="400"
        height="400"
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
  const { canvas, imgElem, img } = state;

  const This = useRef(null);

  const Change = useCallback(async (e) => {
    const target = e.currentTarget;
    const file = target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post("/quotes/preview", formData);
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
    // const link = document.createElement('a');
    // link.href = canvas.elem.toDataURL('image/jpeg');
    // link.download = 'merged_image.jpg';
    // link.click();
    // console.log(canvas.elem.toDataURL('image/jpeg'))
    const blob = await new Promise((resolve, reject) => {
      canvas.elem.toBlob((blob) => {
        if (!blob) {
          console.error('Blob 생성 실패');
          reject('Blob 생성 실패');
        } else {
          resolve(blob);
        }
      }, 'image/png');
    });
    // Blob 객체를 파일 형태로 변환
    const file = new File([blob], 'image.png', { type: 'image/png' });
    // FormData에 파일 추가
    const formData = new FormData();
    formData.append('image', file);
    const { data: { url } } = await axios.post('/quotes/preview', formData);
    // console.log(url);
    // const link = document.createElement('a');
    // link.href = url
    // link.download = 'merged_image.jpg';
    // link.click();


    mergeImages([img, url])
  .then(b64 => This.current.src = b64);
  //   console.log(canvas.elem.toDataURL('image/jpeg'), imgElem, img)

  }, [imgElem, canvas, img]);


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
      <img ref={This} style={{border: '2px solid red', width: '400px', height: '400px', display: 'block'}}/>
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
  let painting = false;
  let color = "black";
  let line = 5;
  const Cancel = useCallback(() => {
    dispatch({ type: "CANVAS_CANCEL" });
  }, []);

  const startPosition = useCallback(
    (e) => {
      painting = true;
      canvas.ctx.lineWidth = line;
      canvas.ctx.lineCap = "round"; // 선끝의 모양 butt, round, square
      canvas.ctx.strokeStyle = color;
      draw(e);
    },
    [canvas, painting, color, line]
  );

  const draw = useCallback(
    (e) => {
      if (!painting) return;
      const rect = canvas.elem.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      canvas.ctx.lineTo(x, y);
      canvas.ctx.stroke(); // lineTo로 지정한 경로를 캔버스에 그린다.
      canvas.ctx.beginPath(); // 새로운 경로 시작, 이전 경로 초기화, 새로운 경로 시작,
      canvas.ctx.moveTo(x, y); // beginPath이 새로운 경로를 생성
    },
    [canvas, painting]
  );

  const endPosition = useCallback(
    (e) => {
      painting = false;
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
  }, []);

  const Color = useCallback((tool) => {
    color = tool;
  }, []);

  const Reset = useCallback(() => {
    color = "black";
    line = 5;
    canvas.ctx.clearRect(0, 0, canvas.elem.width, canvas.elem.height);
  }, [canvas]);

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

const Quotes = () => {
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
        <Preview state={state} dispatch={dispatch} />
        <Options state={state} dispatch={dispatch} />
        {modal.text && <TextModal dispatch={dispatch} />}
        {modal.canvas && <Canvas state={state} dispatch={dispatch} />}
        {modal.deco && <Deco dispatch={dispatch} />}
      </div>
    </div>
  );
};

export default Quotes;
