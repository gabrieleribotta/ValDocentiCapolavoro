import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Prof from "../components/Prof";
import "../../css/Elenco.css";
import Swal from "sweetalert2";
import packageInfo from "../../config.json";
import BackToTopButton from "../components/BackToTopButton";
import useCommon from "../useCommon";

const Elenco = () => {
	// Dichiarazione costanti dal json
	const SERVER=packageInfo.SERVER
	const GET_DOCENTI_CLASSE=packageInfo.GET_DOCENTI_CLASSE

	const [PROFF, setPROFF] = useState([]); // array globale con i prof ricavati dal JSON
	const [infos, setinfos] = useState({});
	const navigate = useNavigate();

	// ricavo funzioni da file
	const { CheckToken, Logout } = useCommon();

	useEffect(() => {
		// se non ci sono le infomazioni necessarie faccio rifare il login
		setinfos(JSON.parse(localStorage.getItem("vd-info")));
		// se non ci sono le infomazioni necessarie faccio rifare il login
		if (infos === null || infos === "") {
			navigate("/");
		} else {
			// ottengo l'elenco dei docenti
			CheckToken()
				.then((data)=> {
					if (data.valido) {
						fetch(SERVER + GET_DOCENTI_CLASSE, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								token: JSON.parse(localStorage.getItem("vd-info"))
									.tuo_token,
							}),
						})
							.then((testo) => testo.json())
							.then((data) => {
								if (data.docenti !== null) {
									setPROFF(data.docenti);
								} else {
									Swal.fire({
										icon: "warning",
										title: "Impossibile caricare i docenti",
										text: data.messaggio,
										confirmButtonText: "Torna alla home",
									}).then((result) => {
										if (result.isConfirmed) {
											navigate("/Home");
										}
									});
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
						
		}
	}, []);

	const creaProf = () => {
		return PROFF.map((e, i) => {
			return (
				<Prof
					nome={e.nome}
					cognome={e.cognome}
					materie={e.materie.join(", ")}
					key={i}
					indice={i}
				/>
			);
		});
	};

	document.title = "Elenco dei professori - Valutazione Docenti";

	return (
		<div className="container-fluid">
			<Header />
			<div className="row justify-content-around align-items-center mt-5 w-75 m-auto">
				<span className="text-center mb-4">
					Elenco dei professori da valutare
				</span>
				{creaProf()}
			</div>
			<Footer />
			<BackToTopButton />
		</div>
	);
};

export default Elenco;
