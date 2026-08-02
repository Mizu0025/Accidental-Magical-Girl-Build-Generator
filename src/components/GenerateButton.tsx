import { generateBuildThunk } from "../store/buildThunk";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export function GenerateButton(): React.JSX.Element {
	const dispatch = useAppDispatch();
	const build = useAppSelector((state) => state.build.build);
	const isGenerating = useAppSelector((state) => state.build.isGenerating);

	return (
		<button
			type="button"
			className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
			onClick={() => dispatch(generateBuildThunk())}
			disabled={isGenerating}
		>
			{build ? "Regenerate" : "Generate Character Build"}
		</button>
	);
}
