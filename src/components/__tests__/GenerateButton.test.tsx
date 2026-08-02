import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import buildReducer from "../../store/buildSlice";
import { GenerateButton } from "../GenerateButton";

const createMockStore = () =>
	configureStore({
		reducer: { build: buildReducer },
	});

describe("GenerateButton", () => {
	it("renders button with correct text", () => {
		render(
			<Provider store={createMockStore()}>
				<GenerateButton />
			</Provider>,
		);
		expect(screen.getByRole("button")).toHaveTextContent(
			"Generate Character Build",
		);
	});

	it("shows Regenerate when build already exists", () => {
		const store = createMockStore();
		store.dispatch({ type: "build/setBuild", payload: { build: null } });
		render(
			<Provider store={store}>
				<GenerateButton />
			</Provider>,
		);
		expect(screen.getByRole("button")).toHaveTextContent("Regenerate");
	});
});
