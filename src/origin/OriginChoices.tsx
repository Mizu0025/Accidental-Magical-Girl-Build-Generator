import { Origin, OriginDescription } from "../constants/origin";
import type { OriginChoice } from "../types/origin";

export const OriginChoices: OriginChoice = Object.fromEntries(
	Object.values(Origin).map((origin) => [
		origin,
		{
			label: origin,
			description: OriginDescription[origin as keyof typeof OriginDescription],
		},
	]),
);
