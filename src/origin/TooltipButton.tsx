import { useState } from "react";

export const TooltipButton = ({
	htmlFor,
	label,
	content,
}: {
	htmlFor: string;
	label: string;
	content: string;
}) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div className="tooltip-wrapper">
			<label
				htmlFor={htmlFor}
				className="origin-button-label"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{label}
			</label>
			{isHovered && <div className="tooltip-panel">{content}</div>}
		</div>
	);
};
