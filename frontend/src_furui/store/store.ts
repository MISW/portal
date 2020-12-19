import {
  configureStore,
  getDefaultMiddleware,
  AnyAction,
  ThunkAction,
} from "../src_furui/@reduxjs/toolkit";
import {
  Context,
  MakeStore,
  createWrapper,
} from "../src_furui/next-redux-wrapper";
import { AppContext } from "../src_furui/next/app";
import rootReducer from "./reducer";
import { ApiClient, createApiClient } from "../src_furui/infra/api";
import { nonNullOrThrow } from "../src_furui/utils";

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

const makeStore: MakeStore<RootState> = (ctx) => {
  const req = isAppContext(ctx)
    ? ctx.ctx.req
    : "req" in ctx
    ? ctx.req
    : undefined;
  const cookie = req?.headers.cookie;
  const baseUrl = process.browser
    ? "/"
    : nonNullOrThrow(process.env.BACKEND_HOST);
  const api = createApiClient(baseUrl, cookie ? { headers: { cookie } } : {});
  return createStore({ api });
};

/**
 * wrapper object that connects the store with Next.js
 */
export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV !== "production",
});
