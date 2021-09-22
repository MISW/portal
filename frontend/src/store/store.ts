import {
  configureStore,
  getDefaultMiddleware,
  AnyAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import { Context, MakeStore, createWrapper } from "next-redux-wrapper";
import { AppContext } from "next/app";
import rootReducer from "./reducer";
import { ApiClient, createApiClient } from "infra/api";

export type ExtraArgument = Readonly<{
  api: ApiClient;
}>;

export const createStore = (props: ExtraArgument) => {
  const middleware = getDefaultMiddleware({
    thunk: {
      extraArgument: {
        api: props.api,
      },
    },
  });
  const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware,
  });
  if (process.env.NODE_ENV === "development" && (module as any).hot) {
    (module as any).hot.accept("./reducer", () => {
      // 開発環境でしか動作しないので問題ない
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const newRootReducer = require("./reducer").default;
      store.replaceReducer(newRootReducer);
    });
  }
  return store;
};

export type Store = ReturnType<typeof createStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = Store["dispatch"];
export type AppActions =
  | AnyAction
  | ThunkAction<unknown, RootState, ExtraArgument, AnyAction>;

const isAppContext = (ctx: Context): ctx is AppContext => "Component" in ctx;

if (!process.browser && process.env.BACKEND_HOST == null) {
  console.warn("BACKEND_HOST is required");
}

const makeStore: MakeStore<Store> = (ctx) => {
  const req = isAppContext(ctx)
    ? ctx.ctx.req
    : "req" in ctx
    ? ctx.req
    : undefined;
  const cookie = req?.headers.cookie;
  /**
   * TODO:
   * preprender時に参照されてしまうので、何もないとき空文字列にしてしまっている。
   * そもそも500エラーの可能性があるprerenderでstoreが初期化されるのはおかしいわけだが、DefaultLayoutが_app.tsxで配置されてしまっている以上、_app.tsxでstoreを構築する必要があり、回避策としてこうなっている
   */
  const baseUrl = process.browser ? "/" : process.env.BACKEND_HOST ?? "";
  const api = createApiClient(baseUrl, cookie ? { headers: { cookie } } : {});
  return createStore({ api });
};

/**
 * wrapper object that connects the store with Next.js
 */
export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV !== "production",
});
