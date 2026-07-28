export const OriginRadioButton = ({
	name,
	value,
	onChange,
}: {
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	return (
		<input
			className="origin-radio"
			type="radio"
			id={value}
			name={name}
			value={value}
			onChange={onChange}
		/>
	);
};
