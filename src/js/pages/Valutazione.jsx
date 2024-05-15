import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/Valutazione.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Voto from "../components/Voto";
import Swal from "sweetalert2";
import packageInfo from "../../config.json";
import BackToTopButton from "../components/BackToTopButton";
import useCommon from "../useCommon";

const Valutazione = () => {
	// Dichiarazione costanti dal json
	const SERVER=packageInfo.SERVER
	const GET_DOMANDE=packageInfo.GET_DOMANDE
	const VALUTA_DOCENTE=packageInfo.VALUTA_DOCENTE
	// ricavo funzioni da file
	const { CheckToken, Logout } = useCommon();
	// funzioni per massimo e minimo voti
	const MIN = 2;
	const MAX = 10;

	const [domande, setDomande] = useState([]); // array globale con le domande ricavate dal JSON
	const { state } = useLocation();
	const [infos, setinfos] = useState({});
	const navigate = useNavigate();
	const [voti, setVoti] = useState({});

	useEffect(() => {
		// se non ci sono le infomazioni necessarie faccio rifare il login
		setinfos(JSON.parse(localStorage.getItem("vd-info")));
		// se non ci sono le infomazioni necessarie faccio rifare il login
		if (infos === null || infos === "" || state === null) {
			navigate("/");
		} else {
			const { nome } = state; // ricavo nome
			const { cognome } = state; // ricavo cognome
			const { materia } = state; // ricavo materia
			// salvo le informazioni destrutturate nelle variabili
			infos["nome"] = nome;
			infos["cognome"] = cognome;
			infos["materia"] = materia;
			setinfos({ ...infos });
		}
		
		// ottengo le domande dal JSON
		const getDomande = () => {	
			CheckToken()
				.then((data)=> {
					if (data.valido) {
						fetch(SERVER + GET_DOMANDE)
							.then((dati) => dati.json())
							.then((elenco) => {
								// salvo il risultato in un array globale
								setDomande([...elenco.domande]);
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
		getDomande();
	}, []);

	const handleInputChange = (childId, value) => {
		setVoti((prevVoti) => ({ ...prevVoti, [childId]: value }));
	};

	const convalidaVoto = () => {
		let token = JSON.parse(localStorage.getItem("vd-info")).tuo_token
		let nome_docente = infos["nome"];
		let cognome_docente = infos["cognome"];
		// recupero array di objects delle valutazioni
		let valutazioni = [];
		Object.keys(voti).forEach((e)=> {
			valutazioni.push({
				idDomanda: e,
				voto: voti[e]
			})
		});

		
		CheckToken()
			.then((data)=> {
				if (data.valido) {
					fetch(SERVER + VALUTA_DOCENTE, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({nome_docente, cognome_docente, valutazioni, token})
					})
					.then(testo => testo.json())
					.then((data)=> {
						Swal.fire({
							icon: "info",
							title: "Informazioni sull'invio al server",
							text: data.messaggio,
							confirmButtonText: "Torna all'elenco dei docenti"
						}).then((result)=> {
							if (result.isConfirmed) {
								navigate("/Elenco");
							}
						});
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

	const controllo = () => {
		// controllo che siano tutte votate
		if (Object.keys(voti).length < domande.length) {
			Swal.fire({
				icon: "warning",
				title: "Numero di voti insufficiente",
				text: "Assicurarsi di aver votato tutte le domande."
			});
		} else {
			// converto da stringhe a interi e salvo in un array
			let val = Object.values(voti).map((v)=> { return parseInt(v) });
			// controllo il range dei voti
			if (val.every(checkValore)) {
				convalidaVoto();
			} else {
				Swal.fire({
					icon: "error",
					title: "Voti non accettabili",
					text: `I voti inseriti non rispettano i requisiti richiesti. Il voto minimo ammesso è ${MIN} e il voto massimo ammesso è ${MAX}.`
				});
			}
		}
	};

	const checkValore=(voto)=> {
		return (voto>=MIN && voto<=MAX)
	}

	// mostra domande
	const mostraDomande = () => {
		return domande.map((e) => {
			let id = e.id;
			return (
				<Voto
					min={MIN}
					max={MAX} 
					key={id}
					testoDomanda={e["domanda"]}
					id={id}
					valutazioni={voti}
					onInputChange={handleInputChange}
				/>
			);
		});
	};

	document.title = "Valutazione " + infos["nome"] + " " + infos["cognome"] + " - Valutazione Docenti";

	return (
		<div className="container-fluid">
			<Header />
			<form className="pb-5">
				{/* info del prof */}
				<div className="row justify-content-around align-items-center mt-5 w-75 m-auto">
					<div className="col-12 text-center">
						<span className="infos">{infos["nome"] + " " + infos["cognome"]}</span>
					</div>
					<div className="col-12 text-center">
						<span className="materia">
							<i>{infos["materia"]}</i>
						</span>
					</div>
				</div>
				{/* schermata valutazione */}
				<div className="row justify-content-around align-items-center mt-5 w-75 m-auto">
					{mostraDomande()}
				</div>
				{/* pulsanti */}
				<div className="row justify-content-around align-items-center mt-5 mb-5 w-75 m-auto">
					<div className="col-12 col-lg-6 text-center m-2">
						{/* ! quando cancella viene premuto pulisco lo stato --> posso controllare che prima di inviare si siano votate tutte le domande */}
						<button
							className="button"
							type="reset"
							onClick={() => {
								setVoti({});
							}}
						>
							<i className="bi bi-trash3"></i>&nbsp;&nbsp;CANCELLA
						</button>
					</div>
					<div className="col-12 col-lg-6 text-center m-2">
						<button
							className="button"
							type="button"
							onClick={controllo}
						>
							<i className="bi bi-send"></i>&nbsp;&nbsp;INVIA
						</button>
					</div>
				</div>
			</form>
			<Footer />
			<BackToTopButton />
		</div>
	);
};

export default Valutazione;
