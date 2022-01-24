import { AppThunk } from 'store/helpers';

export const inviteToSlack =
    (): AppThunk =>
    (_dispatch, _, { api }) =>
        api.inviteToSlack();

export const remindPayment =
    (): AppThunk =>
    (_dispatch, _, { api }) =>
        api.remindPayment();
