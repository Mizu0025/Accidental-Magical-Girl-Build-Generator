import { Provider } from "react-redux";
import { BuildTable } from "./components/BuildTable";
import { GenerateButton } from "./components/GenerateButton";
import { store } from "./store";
import { useAppSelector } from "./store/hooks";

function AppContent(): React.JSX.Element {
	const build = useAppSelector((state) => state.build.build);

	return (
		<div className="min-h-screen bg-white text-gray-900">
			<div className="max-w-4xl mx-auto p-8">
				<h1 className="text-3xl font-bold text-primary-700 mb-6">
					Accidental Magical Girl — Build Generator
				</h1>
				<div className="flex gap-4 mb-6">
					<GenerateButton />
				</div>
				{build && <BuildTable build={build} />}
			</div>
		</div>
	);
}

export default function App(): React.JSX.Element {
	return (
		<Provider store={store}>
			<AppContent />
		</Provider>
	);
}
