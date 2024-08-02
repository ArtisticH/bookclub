import { handleActions } from "redux-actions";
import axios from "axios";
import { produce } from "immer";

const componentState = {
  img: "",
  quotes: null,
  from: null,
  modal: {
    text: false,
    canvas: false,
    deco: false,
  },
  deco: {
    fontFamily: "",
    fontSize: "",
    textAlign: "",
    color: "",
  },
  canvas: {
    ctx: null,
    elem: null,
    painting: false,
    color: "black",
    width: 500,
    height: 500,
  },
  preview: null,
};

function componentReducer(state, action) {
  switch (action.type) {
    case "IMG":
      return produce(state, (draft) => {
        draft.img = action.url;
      });
    case "TEXT":
      return produce(state, (draft) => {
        draft.quotes = action.quotes;
        draft.from = action.from;
        draft.modal.text = false;
      });
    case "MODAL_TEXT_CANCEL":
      return produce(state, (draft) => {
        draft.modal.text = false;
      });
    case "MODAL_TEXT_OPEN":
      return produce(state, (draft) => {
        draft.modal.text = true;
      });
    case "CANVAS_OPEN":
      return produce(state, (draft) => {
        draft.modal.canvas = true;
      });

    case "CANVAS_CANCEL":
      return produce(state, (draft) => {
        draft.modal.canvas = false;
      });
    case "DECO_OPEN":
      return produce(state, (draft) => {
        draft.modal.deco = true;
      });

    case "DECO_CANCEL":
      return produce(state, (draft) => {
        draft.modal.deco = false;
      });
    case "DECO":
      return produce(state, (draft) => {
        draft.deco.fontFamily = action.deco.fontFamily;
        draft.deco.fontSize = action.deco.fontSize;
        draft.deco.textAlign = action.deco.textAlign;
        draft.deco.color = action.deco.color;
      });
    case "CANVAS":
      return produce(state, (draft) => {
        draft.canvas.ctx = action.ctx;
        draft.canvas.elem = action.canvas;
        draft.preview = action.preview;
      });
    case "CANVAS_TRUE":
      return produce(state, (draft) => {
        draft.canvas.painting = true;
      });
    case "CANVAS_FALSE":
      return produce(state, (draft) => {
        draft.canvas.painting = false;
      });
    case "CANVAS_RESET":
      return produce(state, (draft) => {
        draft.canvas.painting = false;
        draft.canvas.color = "black";
        draft.canvas.ctx.clearRect(
          0,
          0,
          draft.canvas.width,
          draft.canvas.height
        );
      });
    case "CANVAS_COLOR":
      return produce(state, (draft) => {
        draft.canvas.color = action.color;
      });
    case "OVER_1300":
      return produce(state, (draft) => {
        draft.canvas.width = 700;
        draft.canvas.height = 700;
      });
    case "1300_1100":
      return produce(state, (draft) => {
        draft.canvas.width = 600;
        draft.canvas.height = 600;
      });
    case "UNDER_1100":
      return produce(state, (draft) => {
        draft.canvas.width = 500;
        draft.canvas.height = 500;
      });
    case "RESET":
      return produce(state, (draft) => {
        draft.img = "";
        draft.quotes = null;
        draft.from = null;
        draft.modal.text = false;
        draft.modal.canvas = false;
        draft.modal.deco = false;
        draft.deco.fontFamily = "";
        draft.deco.fontSize = "";
        draft.deco.textAlign = "";
        draft.deco.color = "";
        draft.canvas.color = "black";
        draft.canvas.painting = false;
        draft.canvas.ctx.clearRect(
          0,
          0,
          draft.canvas.width,
          draft.canvas.height
        );
      });
  }
}

export { componentState, componentReducer };
