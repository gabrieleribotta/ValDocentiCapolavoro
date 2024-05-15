import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Login.css";
import Header from "../components/Header-login";
import Footer from "../components/Footer-login";
import packageInfo from "../../config.json";

const Login = () => {
	//Dichiarazione costanti dal json
	const SERVER=packageInfo.SERVER
	const LOGIN=packageInfo.LOGIN

	const [msgErrore, setmsgErrore] = useState(""); // stato in cui salvo il messaggio di errore
	const errorMessage = useRef(); // ref dell'elemento in cui mostro il messaggio di errore

	useEffect(() => {
		// controllo se loggato
		if (
			localStorage.getItem("vd-info") !== null &&
			localStorage.getItem("vd-info") !== "" &&
			JSON.parse(localStorage.getItem("vd-info")).credenziali_res
		) {
			navigate("/Home", { replace: true });
		}
		else(
			navigate("/", { replace: true })
		)
		// per evitare che quando utente log out, rimanga nome in title
		document.title = "Login - Valutazione Docenti";
	}, []);

	// salvo valori
	const username = useRef();
	const password = useRef();
	const eye = useRef();

	let navigate = useNavigate();

	// invio dati form se tasto invio premuto
	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			checkLogin();
		}
	};

	// mostra password
	const showPsw = () => {
		if (password.current.type === "password") {
			password.current.type = "text";
			eye.current.className = "bi bi-eye-slash";
		} else if (password.current.type === "text") {
			password.current.type = "password";
			eye.current.className = "bi bi-eye";
		}
	};

	// controllo credenziali
	const checkLogin = () => {
		let valUser = username.current.value.trim(),
			valPassword = password.current.value.trim();
		fetch(SERVER + LOGIN, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user: valUser, password: valPassword }),
		})
			.then((dati) => dati.json())
			.then((info) => {
				if (info.credenziali_res) {
					localStorage.setItem("vd-info", JSON.stringify(info));
					localStorage.setItem("vd-user", JSON.stringify(valUser));
					navigate("/Home", { replace: true });
				} else {
					errore(info.messaggio);
				}
			});
	};

	const errore = (msg) => {
		setmsgErrore(msg);
		errorMessage.current.className = "d-flex error w-100";
	};

	return (
		<div className="container-fluid">
			<Header />
			{/* Error card */}
			<div className="row justify-content-center align-items-center mt-5">
				<div className="col-10 col-md-6 d-flex align-items-center">
					<div className="d-none error w-100" ref={errorMessage}>
						<div className="error__icon me-3">
							<svg
								fill="none"
								height="24"
								viewBox="0 0 24 24"
								width="24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"
									fill="#393a37"
								></path>
							</svg>
						</div>
						<div className="error__title">{msgErrore}</div>
					</div>
				</div>
			</div>
			{/* User input */}
			<form onKeyDown={handleKeyDown}>
				<div className="row justify-content-center align-items-center mt-3">
					<div className="col-12 d-flex justify-content-center align-items-center mt-5 mb-4">
						{/* campo nome utente */}
						<div className="w-75 text-center input-group">
							<span className="input-group-text input-group-text-left">
								<i className="bi bi-person-fill"></i>
							</span>
							<input
								type="text"
								placeholder="Username:"
								ref={username}
								className="form-control input-fields input-group-text-right"
							/>
						</div>
					</div>
					<div className="col-12 d-flex justify-content-center align-items-center mt-4">
						{/* campo password */}
						<div className="w-75 text-center input-group">
							<span className="input-group-text input-group-text-left">
								<i className="bi bi-key-fill"></i>
							</span>
							<input
								type="password"
								placeholder="Password:"
								ref={password}
								className="form-control input-fields"
							/>
							<span
								className="input-group-text input-group-text-right"
								data-field-id="yourPassword"
								data-status="hidden"
								onClick={showPsw}
							>
								<i className="bi bi-eye" ref={eye}></i>
							</span>
						</div>
					</div>
					<div className="col-12 d-flex justify-content-center align-items-center mt-5">
						{/* bottone invio */}
						<div className="w-50 text-center">
							<input
								type="button"
								className="btn-login"
								onClick={checkLogin}
								value="Login"
							/>
						</div>
					</div>
				</div>
			</form>
			<Footer />
		</div>
	);
};

export default Login;
