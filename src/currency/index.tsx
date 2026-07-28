import { OriginCurrency } from "../constants/currency";
import type { OriginName } from "../types/origin";
import "./style.css";

const MagicalCurrency = ({ origin }: { origin: OriginName }) => {
	const currency = OriginCurrency[origin];

	return (
		<div className="currency-display">
			<p>Gold: {currency.gold}</p>
			<p>Silver: {currency.silver}</p>
			<p>Bronze: {currency.bronze}</p>
		</div>
	);
};

export default MagicalCurrency;
