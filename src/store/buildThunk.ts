import { createAsyncThunk } from "@reduxjs/toolkit";
import { generateBuild as _generateBuild } from "../lib/dice";
let _generateFn = _generateBuild;
export const _setGenerateFn = (fn: typeof _generateBuild) => {
	_generateFn = fn;
};

export const generateBuildThunk = createAsyncThunk(
	"build/generate",
	async () => {
		return _generateFn();
	},
);
