import {
  createAction,
  createAsyncThunk,
  AsyncThunk,
  AsyncThunkPayloadCreator,
} from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { RootState, AppDispatch, ExtraArgument } from "./store";
import { useDispatch } from "react-redux";
import { useCallback } from "react";

export const hydrated = createAction<RootState, typeof HYDRATE>(HYDRATE);

type DefaultThunkApiConfig = Readonly<{
  state: RootState;
  dispatch?: AppDispatch;
  extra: ExtraArgument;
  rejectValue?: unknown;
}>;

type CreateAppAsyncThunk = <
  Returned,
  ThunkArg = void,
  ThunkApiConfig = DefaultThunkApiConfig
>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>,
  options?: Readonly<{
    condition?: (
      arg: ThunkArg,
      api: Readonly<{ getState: () => RootState; extra: ExtraArgument }>
    ) => boolean | undefined;
    dispatchConditionRejection?: boolean;
  }>
) => AsyncThunk<Returned, ThunkArg, ThunkApiConfig>;

export const createAppAsyncThunk = createAsyncThunk as CreateAppAsyncThunk;

export type Selector<A> = (state: RootState) => A;

type ArgumentType1<F> = F extends (arg: infer Arg) => any ? Arg : never;
export const useThunk = <ReturnType, ArgType>(
  thunk: AsyncThunk<ReturnType, ArgType, DefaultThunkApiConfig>
) => {
  const dispatch = useDispatch();

  return useCallback((arg: ArgType) => dispatch(thunk(arg)), [dispatch, thunk]);
};
