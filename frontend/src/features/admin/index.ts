import { AppThunk } from 'store/helpers';

export const remindPayment =
  (): AppThunk =>
  (_dispatch, _, { api }) =>
    api.remindPayment();
