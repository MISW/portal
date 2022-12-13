import { createAction, createAsyncThunk, AsyncThunk, AsyncThunkPayloadCreator, ThunkAction, AnyAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { RootState, AppDispatch, ExtraArgument } from './store';

export const hydrated = createAction<RootState, typeof HYDRATE>(HYDRATE);

type DefaultThunkApiConfig<T = unknown> = Readonly<{
  state: RootState;
  dispatch?: AppDispatch;
  extra: ExtraArgument;
  rejectValue?: T;
}>;

type AsyncThunkConfig<T = unknown> = Readonly<{
  state: RootState;
  dispatch?: AppDispatch;
  extra: ExtraArgument;
  rejectValue?: T;
}>;

type CreateAppAsyncThunk = <Returned, ThunkArg = void, ThunkApiConfig extends AsyncThunkConfig = DefaultThunkApiConfig>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>,
  options?: Readonly<{
    condition?: (
      arg: ThunkArg,
      api: Readonly<{
        getState: () => RootState;
        extra: ExtraArgument;
      }>,
    ) => boolean | undefined;
    dispatchConditionRejection?: boolean;
  }>,
) => AsyncThunk<Returned, ThunkArg, ThunkApiConfig>;

export const createAppAsyncThunk = createAsyncThunk as CreateAppAsyncThunk;

export type AppThunk<R = void> = ThunkAction<Promise<R>, RootState, ExtraArgument, AnyAction>;

export type Selector<A> = (state: RootState) => A;
