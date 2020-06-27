import "react-redux";
import { RootState, AppDispatch, Store } from "./store";

declare module "react-redux" {
  interface DefaultRootState extends RootState {}
  export function useDispatch<TDispatch = AppDispatch>(): TDispatch;
  export function useStore(): Store;
}
