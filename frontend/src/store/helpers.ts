import {
  createAction,
  createAsyncThunk,
  AsyncThunk,
  AsyncThunkPayloadCreator,
} from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { RootState, AppDispatch, ExtraArgument } from "./store";

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
