
import { createAppAsyncThunk } from "store/helpers";
import { save } from "./slice";


export const fetchCurrentOidcAccountInfo = createAppAsyncThunk('currentOidcAccountInfo/fetch', async (_, { dispatch, extra: { api } } ) => {
  const info = await api.fetchCurrentOidcAccountInfo();
  dispatch(save(info));
  return info;
});

