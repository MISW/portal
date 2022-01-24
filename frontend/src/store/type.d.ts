import 'react-redux';
import { RootState, AppDispatch, Store } from './store';

declare module 'react-redux' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultRootState extends RootState {}
    export function useDispatch<TDispatch = AppDispatch>(): TDispatch;
    export function useStore(): Store;
}
