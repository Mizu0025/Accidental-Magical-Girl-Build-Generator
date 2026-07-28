import type { ElementByIndividualRoll } from "./character";

export type ResultItem = {
	id: string;
	name: string;
};

export type TableRowConfig = {
	category: string;
	result: string | number | ResultItem[];
	roll: string | number;
};

export type PerkElement = ElementByIndividualRoll & {
	id: string;
	isDuplicate: boolean;
};

export type RenderCellContentProps = {
	result: string | number | ResultItem[];
};
