import React, {useState} from "react";
import useDynamicRefs from "use-dynamic-refs";

const Voto = (props) => {
	const { min, max, testoDomanda, id, valutazioni, onInputChange } = props;
	const [getRef, setRef] = useDynamicRefs();

	const [inputValue, setInputValue] = useState('');

	const handleChange = (event) => {
		const { value } = event.target;
		setInputValue(value);
		onInputChange(id, value); // call the father's callback function
	};

	return (
		<div className="col-12 col-lg-8 card text-center">
			<p className="w-100 m-auto">{testoDomanda}</p>
			<input
				className="w-75 m-auto mt-5 mb-5"
				type="range"
				name={id}
				min={min}
				max={max}
				ref={setRef(id)}
				onChange={handleChange}
			/>
			<span className="w-50 m-auto">{valutazioni[id]}/{max}</span>
		</div>
	);
};

export default Voto;
