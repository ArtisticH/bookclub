function m(n, e, ...t) {
  if (import.meta.NODE_ENV !== "production" && e === void 0)
    throw new Error("invariant requires an error message argument");
  if (!n) {
    let o;
    if (e === void 0)
      o = new Error(
        "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."
      );
    else {
      let s = 0;
      o = new Error(
        e.replace(/%s/g, function() {
          return t[s++];
        })
      ), o.name = "Invariant Violation";
    }
    throw o.framesToPop = 1, o;
  }
}
const l = (n) => typeof n == "function", z = (n) => typeof n == "symbol" || typeof n == "object" && Object.prototype.toString.call(n) === "[object Symbol]", P = (n) => n.length === 0, j = (n) => n.toString(), w = (n) => typeof n == "string", C = "/", h = "||";
function D(n) {
  return w(n) || l(n) || z(n);
}
function W(n) {
  return P(n) ? !1 : n.every(D);
}
function un(...n) {
  m(
    W(n),
    "Expected action types to be strings, symbols, or action creators"
  );
  const e = n.map(j).join(h);
  return { toString: () => e };
}
const p = (n) => n, v = (n) => n === null;
function A(n, e = p, t) {
  m(
    l(e) || v(e),
    "Expected payloadCreator to be a function, undefined or null"
  );
  const o = v(e) || e === p ? p : (i, ...u) => i instanceof Error ? i : e(i, ...u), s = l(t), c = n.toString(), r = (...i) => {
    const u = o(...i), f = { type: n };
    return u instanceof Error && (f.error = !0), u !== void 0 && (f.payload = u), s && (f.meta = t(...i)), f;
  };
  return r.toString = () => c, r;
}
const g = (n) => {
  if (typeof n != "object" || n === null)
    return !1;
  let e = n;
  for (; Object.getPrototypeOf(e) !== null; )
    e = Object.getPrototypeOf(e);
  return Object.getPrototypeOf(n) === e;
}, x = (n) => Array.isArray(n), T = (n) => n == null, Z = (n) => n[n.length - 1], K = /\s/, _ = /([-.:_])/, q = /([a-z][A-Z]|[A-Z][a-z])/, O = "/", G = /[\W_]+(.|$)/g, Y = (n) => n.replace(G, (e, t) => t ? " " + t : ""), B = /(.)([A-Z]+)/g, H = (n) => n.replace(
  B,
  (e, t, o) => t + " " + o.toLowerCase().split("").join(" ")
), J = (n) => K.test(n) ? n.toLowerCase() : _.test(n) ? (Y(n) || n).toLowerCase() : q.test(n) ? H(n).toLowerCase() : n.toLowerCase(), Q = (n) => J(n).replace(/[\W_]+(.|$)/g, (e, t) => t ? " " + t : "").trim(), I = (n) => Q(n).replace(
  /\s(\w)/g,
  (e, t) => t.toUpperCase()
), R = (n) => n.includes(O) ? n.split(O).map(I).join(O) : I(n), S = (n, e) => n.reduce(
  (t, o) => e(t, o),
  {}
), b = (n) => typeof Map < "u" && n instanceof Map;
function $(n) {
  if (b(n))
    return Array.from(n.keys());
  if (typeof Reflect < "u" && typeof Reflect.ownKeys == "function")
    return Reflect.ownKeys(n);
  let e = Object.getOwnPropertyNames(n);
  return typeof Object.getOwnPropertySymbols == "function" && (e = e.concat(Object.getOwnPropertySymbols(n))), e;
}
function L(n, e) {
  return b(e) ? e.get(n) : e[n];
}
const M = (n) => function e(t, { namespace: o = C, prefix: s } = {}, c = {}, r = "") {
  function i(f) {
    if (!r)
      return f;
    const d = f.toString().split(h), a = r.split(h);
    return [].concat(
      ...a.map((E) => d.map((y) => `${E}${o}${y}`))
    ).join(h);
  }
  function u(f) {
    return r || !s || s && new RegExp(`^${s}${o}`).test(f) ? f : `${s}${o}${f}`;
  }
  return $(t).forEach((f) => {
    const d = u(i(f)), a = L(f, t);
    n(a) ? e(a, { namespace: o, prefix: s }, c, d) : c[d] = a;
  }), c;
}, X = M(g);
function k(n, { namespace: e = C, prefix: t } = {}) {
  function o(c, r, i) {
    const u = R(i.shift());
    P(i) ? r[u] = n[c] : (r[u] || (r[u] = {}), o(
      c,
      r[u],
      i
    ));
  }
  const s = {};
  return Object.getOwnPropertyNames(n).forEach((c) => {
    const r = t ? c.replace(`${t}${e}`, "") : c;
    return o(
      c,
      s,
      r.split(e)
    );
  }), s;
}
function fn(n, ...e) {
  const t = g(Z(e)) ? e.pop() : {};
  return m(
    e.every(w) && (w(n) || g(n)),
    "Expected optional object followed by string action types"
  ), w(n) ? N(
    [n, ...e],
    t
  ) : {
    ...F(n, t),
    ...N(e, t)
  };
}
function F(n, e) {
  const t = X(n, e), o = U(t);
  return k(o, e);
}
function U(n, { prefix: e, namespace: t = C } = {}) {
  function o(s) {
    if (l(s) || T(s))
      return !0;
    if (x(s)) {
      const [c = p, r] = s;
      return l(c) && l(r);
    }
    return !1;
  }
  return S(
    Object.keys(n),
    (s, c) => {
      const r = n[c];
      m(
        o(r),
        `Expected function, undefined, null, or array with payload and meta functions for ${c}`
      );
      const i = e ? `${e}${t}${c}` : c, u = x(r) ? A(i, ...r) : A(i, r);
      return { ...s, [c]: u };
    }
  );
}
function N(n, e) {
  const t = S(
    n,
    (s, c) => ({ ...s, [c]: p })
  ), o = U(t, e);
  return S(
    Object.keys(o),
    (s, c) => ({
      ...s,
      [R(c)]: o[c]
    })
  );
}
var nn = en;
function en(n, e) {
  return function t() {
    e == null && (e = n.length);
    var o = [].slice.call(arguments);
    return o.length >= e ? n.apply(this, o) : function() {
      return t.apply(this, o.concat([].slice.call(arguments)));
    };
  };
}
const an = (n, e) => nn(A(n, e), e.length), tn = (n) => n === void 0;
function on(n, e = p, t) {
  const o = j(n).split(h);
  m(
    !tn(t),
    `defaultState for reducer handling ${o.join(", ")} should be defined`
  ), m(
    l(e) || g(e),
    "Expected reducer to be a function or object with next and throw reducers"
  );
  const [s, c] = l(e) ? [e, e] : [e.next, e.throw].map(
    (r) => T(r) ? p : r
  );
  return (r = t, i) => {
    const { type: u } = i;
    return !u || !o.includes(j(u)) ? r : (i.error === !0 ? c : s)(r, i);
  };
}
const rn = function() {
  for (var n = arguments.length, e = Array(n), t = 0; t < n; t++)
    e[t] = arguments[t];
  var o = typeof e[0] != "function" && e.shift(), s = e;
  if (typeof o > "u")
    throw new TypeError("The initial state may not be undefined. If you do not want to set a value for this reducer, you can use null instead of undefined.");
  return function(c, r) {
    for (var i = arguments.length, u = Array(i > 2 ? i - 2 : 0), f = 2; f < i; f++)
      u[f - 2] = arguments[f];
    var d = typeof c > "u", a = typeof r > "u";
    return d && a && o ? o : s.reduce(function(E, y, V) {
      if (typeof y > "u")
        throw new TypeError("An undefined reducer was passed in at index " + V);
      return y.apply(void 0, [E, r].concat(u));
    }, d && !a && o ? o : c);
  };
};
function cn(n) {
  const e = $(n), t = e.every(
    (o) => o === "next" || o === "throw"
  );
  return e.length > 0 && e.length <= 2 && t;
}
const sn = M(
  (n) => (g(n) || b(n)) && !cn(n)
);
function ln(n, e, t = {}) {
  m(
    g(n) || b(n),
    "Expected handlers to be a plain object."
  );
  const o = sn(n, t), s = $(o).map(
    (r) => on(r, L(r, o), e)
  ), c = rn(e, ...s);
  return (r = e, i) => c(r, i);
}
export {
  un as combineActions,
  A as createAction,
  fn as createActions,
  an as createCurriedAction,
  on as handleAction,
  ln as handleActions
};
