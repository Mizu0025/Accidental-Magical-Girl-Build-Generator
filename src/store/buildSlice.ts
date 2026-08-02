import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CharacterBuild } from "../lib/dice";
import { generateBuildThunk } from "./buildThunk";

interface BuildState {
	build: CharacterBuild | null;
	isGenerating: boolean;
}

const initialState: BuildState = {
	build: null,
	isGenerating: false,
};

export const buildSlice = createSlice({
	name: "build",
	initialState,
	reducers: {
		setBuild(state, action: PayloadAction<CharacterBuild>) {
			state.build = action.payload;
		},
		startGeneration(state) {
			state.isGenerating = true;
		},
		resetBuild(state) {
			state.build = null;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(generateBuildThunk.pending, (state) => {
				state.isGenerating = true;
			})
			.addCase(generateBuildThunk.fulfilled, (state, action) => {
				state.isGenerating = false;
				state.build = action.payload;
			});
	},
});
export const { setBuild, startGeneration, resetBuild } = buildSlice.actions;
export default buildSlice.reducer;
