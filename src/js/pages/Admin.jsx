import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Swal from "sweetalert2";
import useCommon from "../useCommon";
import packageInfo from "../../config.json";
import "../../css/Admin.css";

const Admin = () => {
	// Dichiarazione costanti dal json
	const SERVER = packageInfo.SERVER;
	const ADMIN_CONSOLE = packageInfo.ADMIN_CONSOLE;
	const GET_DOCENTI = packageInfo.GET_DOCENTI;
	const VIEW_DOCENTE = packageInfo.VIEW_DOCENTE;

	// ricavo funzioni da file
	const { CheckToken, Logout } = useCommon();

	const selectDocente = useRef();
	const divPulsante = useRef();
	const navigate = useNavigate();
	const [token, setToken] = useState(
		JSON.parse(localStorage.getItem("vd-info"))
	);
	const [canValuta, setCanValuta] = useState(false);
	const [dataDocenti, setDataDocenti] = useState({});
	const [votiDocenti, setVotiDocenti] = useState({});

	if (token === null || token === "") {
		navigate("/");
	}

	useEffect(() => {
		CheckToken().then((data) => {
			if (data.valido) {
				fetch(SERVER + ADMIN_CONSOLE, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token: token.tuo_token }),
				})
					.then((dati) => dati.json())
					.then((data) => {
						if (data.errore) {
							navigate("/");
							alert("Errore, non hai il permesso");
						} else {
							data.map((e, i) => {
								if (e.button !== undefined) {
									let btn = document.createElement("input");
									btn.setAttribute("type", "button");
									btn.classList.add("adminButton", "m-2");
									btn.setAttribute("value", e.button);
									btn.addEventListener("click", () =>
										handle_admin_function(e.urlEndpoint)
									);
									divPulsante.current.appendChild(btn);
								} else setCanValuta(e.status);
							});
						}
					});
			} else {
				Logout();
				Swal.fire({
					icon: "error",
					title: "Sessione scaduta",
					text: "La sessione è scaduta, effettuare nuovamente il login",
				});
			}
		});
	}, [token.tuo_token]);

	useLayoutEffect(() => {
		CheckToken().then((data) => {
			if (data.valido) {
				fetch(SERVER + GET_DOCENTI, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ token: token.tuo_token }),
				})
					.then((_data) => _data.json())
					.then((data) => {
						setDataDocenti(data);
					});
			} else {
				Logout();
				Swal.fire({
					icon: "error",
					title: "Sessione scaduta",
					text: "La sessione è scaduta, effettuare nuovamente il login",
				});
			}
		});
	}, []);

	const handle_admin_function = (endpoint) => {
		CheckToken().then((data) => {
			if (data.valido) {
				fetch(SERVER + "/" + endpoint, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ token: token.tuo_token }),
				})
					.then((dati) => dati.json())
					.then((data) => {
						if (data.valuta !== undefined)
							setCanValuta(data.valuta);

						Swal.fire({
							icon: "info",
							text: data.messaggio,
						});
					});
			} else {
				Logout();
				Swal.fire({
					icon: "error",
					title: "Sessione scaduta",
					text: "La sessione è scaduta, effettuare nuovamente il login",
				});
			}
		});
	};

	const view_docente_function = async () => {
		const selectedOption = selectDocente.current.value;
		if (dataDocenti.docenti) {
			const selectedDocente = dataDocenti.docenti.find(
				(docente) => docente.email === selectedOption
			);
			if (selectedDocente) {
				const { nome, cognome } = selectedDocente;
				CheckToken().then((data) => {
					if (data.valido) {
						fetch(SERVER + VIEW_DOCENTE, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								token: token.tuo_token,
								nome_docente: nome,
								cognome_docente: cognome,
							}),
						})
							.then((_data) => _data.json())
							.then((data) => {
								if (data.media !== null) {
									setVotiDocenti(data.media);
								} else {
									setVotiDocenti({});
									Swal.fire({
										icon: "error",
										title: "Errore",
										text: data.messaggio,
									});
								}
							});
					} else {
						Logout();
						Swal.fire({
							icon: "error",
							title: "Sessione scaduta",
							text: "La sessione è scaduta, effettuare nuovamente il login",
						});
					}
				});
			} else {
				setVotiDocenti({});
				Swal.fire({
					icon: "error",
					title: "Errore",
					text: "Errore nella lista docenti",
				});
			}
		}
	};

	const render_select_docenti = () => {
		//try and catch necessario dato che altrimenti al primo tentativo non renderizzerebbe
		try {
			if (
				dataDocenti.docenti !== undefined &&
				Object.keys(dataDocenti).length !== 0
			) {
				const myDocenti = dataDocenti.docenti;
				return myDocenti.map((e, i) => {
					const valore = e.nome + " " + e.cognome;

					return (
						<option
							key={i}
							value={e.email}
							data-nome={e.nome}
							data-cognome={e.cognome}
						>
							{valore}
						</option>
					);
				});
			}
		} catch {
			Swal.fire({
				icon: "error",
				title: "Si è verificato un errore nel caricamento dei docenti",
				text: "La pagina verrà ricaricata automaticamente tra 3 secondi",
				timer: 3000,
			}).then(() => {
				window.location.reload();
			});
		}
	};

	const handleTableVotiDocenti = () => {
		if (Object.keys(votiDocenti).length !== 0) {
			return votiDocenti.map((e, i) => {
				return (
					<div key={i} className="elTableDocenti w-100 my-1">
						<div>{e.domanda}</div>
						<div>{e.media}</div>
					</div>
				);
			});
		}
	};

	const buttonReset = () => {
		if (Object.keys(votiDocenti).length !== 0)
			return (
				<button
					className="littleAdminButton m-2"
					onClick={() => setVotiDocenti({})}
				>
					Pulisci Schermo
				</button>
			);
	};

	document.title = "Gestione delle valutazioni - Valutazione Docenti";

	return (
		<div className="container-fluid">
			<Header />
			<div className="row justify-content-center align-items-center mt-3">
				<span className="col-12 d-flex align-items-center justify-content-center mt-3">
					Pannello di Amministrazione
				</span>
				<div className="d-flex justify-content-center align-items-center flex-column mt-5">
					<select
						ref={selectDocente}
						className="adminButton adminSelect m-2"
					>
						{render_select_docenti()}
					</select>
					<button
						onClick={view_docente_function}
						className="adminButton m-2"
					>
						Visualizza Docente
					</button>
					<div className="d-flex justify-content-space-center align-items-center flex-column mt-5 tableDocenti">
						{buttonReset()}
						{handleTableVotiDocenti()}
					</div>
				</div>
				<div
					className="d-flex justify-content-center align-items-center flex-column mt-5"
					ref={divPulsante}
				></div>
				<span className="d-flex justify-content-center align-items-center flex-column mt-3 mb-5">
					Status:
					{canValuta ? " Valutazioni aperte" : " Valutazioni chiuse"}
				</span>
			</div>
			<Footer />
		</div>
	);
};

export default Admin;
