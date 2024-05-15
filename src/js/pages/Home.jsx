import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Login.css";
import "../../css/Home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import packageInfo from "../../config.json";
import useCommon from "../useCommon";
import Swal from "sweetalert2";

const Home = () => {
	const { CheckToken, Logout } = useCommon();
	// Dichiarazione costanti dal json
	const SERVER = packageInfo.SERVER;
	const RUOLO = packageInfo.RUOLO
	
	const [infos, setinfos] = useState({});
	const submitBtn = useRef();
	const navigate = useNavigate();
	useEffect(() => {
		setinfos(JSON.parse(localStorage.getItem("vd-info")));
		// se non ci sono le infomazioni necessarie faccio rifare il login
		if (infos === null || infos === "") {
			navigate("/");
		}
		handleTipo();
	}, []);

	const handleNameShown = () => {
		// per togliere la parte dopo la @
		// uso 'if' dato che se non ci fosse darebbe errore a fare la split di undefined all'inizio
		let ins = JSON.parse(localStorage.getItem("vd-user"));
		let user;
		try {
			user = ins.split("@")[0];
		} catch {
			user = ins;
		}

		try {
			return user.split(".").map((e)=> {
				return firstLetterUpper(e);
			}).join(" ");
		} catch {
			return "";
		}
	};

	const handlePrivilege = () => {
		CheckToken()
		.then((data)=> {
			if (data.valido) {
				fetch(SERVER + RUOLO, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({"token": JSON.parse(localStorage.getItem("vd-info")).tuo_token})
				})
					.then((dati) => dati.json())
					.then((tipo) => {
						if (tipo.tipo === "S") {
							navigate("/Elenco", { replace: true });
						} else if (tipo.tipo === "A") {
							navigate("/Admin", { replace: true });
						} else if (tipo.tipo === "D") {
							navigate("/Docente", { replace: true });
						}
					});
			} else {
				Logout();
				Swal.fire({
					icon: "error",
					title: "Sessione scaduta",
					text: "La sessione è scaduta, effettuare nuovamente il login"
				});
			}
		});
	};

	const handleTipo = () => {
		CheckToken()
		.then((data)=> {
			if (data.valido) {
				fetch(SERVER + RUOLO, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({"token": JSON.parse(localStorage.getItem("vd-info")).tuo_token})
				})
				.then((dati) => dati.json())
				.then((tipo) => {
					if (tipo.tipo === "A") {
						submitBtn.current.innerText = "Gestione delle valutazioni";
					} else if (tipo.tipo === "D") {
						submitBtn.current.innerText = "Visualizza medie delle valutazioni";
					} else if (tipo.tipo === "S") {
						submitBtn.current.innerText = "Valuta";
					}
				});
			} else {
				Logout();
				Swal.fire({
					icon: "error",
					title: "Sessione scaduta",
					text: "La sessione è scaduta, effettuare nuovamente il login"
				});
			}
		});
	};

	const firstLetterUpper = (e) => {
		return e.charAt(0).toUpperCase() + e.slice(1);
	};
	
	document.title = "Home - " + handleNameShown();

	return (
		<div className="container-fluid">
			<Header />
			<div className="row justify-content-center align-items-center mt-3">
				<div className="col-12 d-flex justify-content-center align-items-center mt-5 mb-4">
					{/* messaggio di benvenuto */}
					<p className="text-infos text-center">
						Benvenuto/a,
						<br />
						{handleNameShown()}
					</p>
				</div>
				<div className="col-12 d-flex justify-content-center align-items-center mt-4">
					{/* bottone invio */}
					<div className="w-50 text-center">
						<button
							className="btn-login text-center"
							onClick={handlePrivilege}
							ref={submitBtn}
						>
						</button>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Home;
