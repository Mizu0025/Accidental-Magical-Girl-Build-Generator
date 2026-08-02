import { configureStore } from "@reduxjs/toolkit";
import buildReducer from "./buildSlice";

export const store = configureStore({ reducer: { build: buildReducer } });

export interface RootState {
	build: ReturnType<typeof buildReducer>;
}

export type AppDispatch = typeof store.dispatch;
