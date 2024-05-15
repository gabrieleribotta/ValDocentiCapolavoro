// importo componenti di default
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom"; // ! da importare oltre che node modules
// importo fogli di stile
import "./css/App.css";
// importo i miei componenti
import Login from "./js/pages/Login";
import Home from "./js/pages/Home";
import Elenco from "./js/pages/Elenco";
import Valutazione from "./js/pages/Valutazione";
import Admin from "./js/pages/Admin";
import Docente from "./js/pages/Docente";

const App = () => {
	return (
		<HashRouter>
			// Cambio solo quello che c'è nel TAG Routes
			<Routes>
				{/* pagina di default (login) */}
				<Route path="/" element={<Login />} />
				{/* mostro info utente loggato */}
				<Route path="/Home" element={<Home />} />
				{/* elenco professori */}
				<Route path="/Elenco" element={<Elenco />} />
				{/* valutazione professore per materia */}
				<Route path="/Valutazione" element={<Valutazione />} />
				{/* pagina dell'admin */}
				<Route path="/Admin" element={<Admin />} />
				{/* pagina del docente */}
				<Route path="/Docente" element={<Docente />} />
				{/*Inserisco il riferimento alla nuova pagina, in path inserisco il percorso (/ per la home, * matcha tutte le pagine, lo uso ad esempio per 404 Not Found) e in element il nome del componente (nome dato al momento dell'importazione)*/}
			</Routes>
		</HashRouter>
	);
};

export default App;
