import type { OriginName } from "../types/origin";
import { OriginChoices } from "./OriginChoices";
import { OriginRadioButton } from "./OriginRadioButton";
import { TooltipButton } from "./TooltipButton";
import "./style.css";

export const GenerateOrigin = ({
	onSelect,
}: {
	onSelect: (value: OriginName) => void;
}) => {
	return (
		<div className="origin-buttons">
			{Object.entries(OriginChoices).map(([name, data]) => (
				<div key={name} className="origin-item">
					<OriginRadioButton
						name="origin"
						value={name}
						onChange={() => onSelect(name as OriginName)}
					/>
					<TooltipButton
						htmlFor={name}
						label={data.label}
						content={data.description}
					/>
				</div>
			))}
		</div>
	);
};

export default GenerateOrigin;
