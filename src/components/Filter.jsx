export function Filter({ placeholder, options, type = 'select', onChange, className, value }) {
	if (type === 'date') {
		return <input type='date' className={`${className} bg-transparent w-48 p-3`} onChange={onChange} />;
	}

	return (
		<select className={`${className} bg-transparent w-48 p-3`} onChange={onChange} value={value}>
			<option value='' disabled hidden>
				{placeholder}
			</option>
			{options.map((option, index) => (
				<option key={index} value={option}>
					{option}
				</option>
			))}
		</select>
	);
}
