import { useEffect, useState } from "react";
import { type Currency, OriginCurrency } from "../constants/currency";
import "./style.css";
import type { OriginName } from "../types/origin";

const MagicalCurrency = ({ origin }: { origin: OriginName }) => {
	const [currency, setCurrency] = useState<Currency>({
		gold: 0,
		silver: 0,
		bronze: 0,
	});
	useEffect(() => {
		const newCurrency = OriginCurrency[origin];
		setCurrency(newCurrency);
	}, [origin]);

	return (
		<div className="currency-display">
			<p>Gold: {currency.gold}</p>
			<p>Silver: {currency.silver}</p>
			<p>Bronze: {currency.bronze}</p>
		</div>
	);
};

export default MagicalCurrency;
