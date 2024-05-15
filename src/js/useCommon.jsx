import { useNavigate } from "react-router-dom";
import packageInfo from "../config.json";

const useCommon = () => {
	const nav = useNavigate();
	
	const CheckToken = async () => {
		const SERVER = packageInfo.SERVER;
		const TOKEN_VALIDO = packageInfo.TOKEN_VALIDO;

		const tokenToCheck = JSON.parse(localStorage.getItem("vd-info")).tuo_token;
		return new Promise((resolve, reject) => {
			fetch(SERVER + TOKEN_VALIDO, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({"token":tokenToCheck})
			})
			.then(testo=>testo.json())
			.then((data)=>{
				resolve(data);
			})
		});
	};

	const Logout = () => {
		const SERVER = packageInfo.SERVER;
		const LOGOUT = packageInfo.LOGOUT;
		
		// comunico al server
		fetch(SERVER + LOGOUT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({"token":JSON.parse(localStorage.getItem("vd-info")).tuo_token})
		})
		.then(dati => dati.json())
		.then(()=> {
			// pulisco i dati dalla local storage
			localStorage.setItem("vd-info", "");
			localStorage.setItem("vd-user", "");
			// redirect verso la pagina di login
			nav("/");
		});
	}

	return { CheckToken, Logout }
};

export default useCommon
