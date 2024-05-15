import React from "react";
import "../../css/Header.css";
import DeninaLogo from "../../images/logo.png";

const Header = () => {
	return (
		<div className="row justify-content-start align-items-center Header pb-3 pt-3">
			{/* contenitore logo */}
			<div className="col-3 d-none d-lg-flex align-items-center">
				<img src={DeninaLogo} alt="Logo IIS Denina" className="logo" />
			</div>
			{/* contenitore scritta */}
			<div className="col-12 col-lg-3 d-flex justify-content-center align-items-center unSelText">
				<h1 className="d-none d-lg-block">Valutazione docenti</h1>
				<h2 className="d-lg-none">Valutazione docenti</h2>
			</div>
			{/* contenitore info */}
			<div className="col-3 d-none d-lg-flex align-items-center justify-content-end">
				<p className="text-end info-link">
					<i className="bi bi-geo-alt-fill"></i>&nbsp;&nbsp;Via della
					Chiesa 17, Saluzzo (CN)
					<br />
					<i className="bi bi-telephone-fill"></i>&nbsp;&nbsp;Tel:{" "}
					<a href="tel:+39017543625">0175 43625</a>
					<br />
					<i className="bi bi-envelope-fill"></i>&nbsp;&nbsp;eMail:{" "}
					<a href="mailto:cnis014001@istruzione.it">
						cnis014001@istruzione.it
					</a>
					<br />
					<i className="bi bi-envelope-fill"></i>&nbsp;&nbsp;eMail:{" "}
					<a href="mailto:cnis014001@pec.istruzione.it">
						cnis014001@pec.istruzione.it
					</a>
					<br />
					<i className="bi bi-person-vcard-fill"></i>&nbsp;&nbsp;C.F.
					94033200042
				</p>
			</div>
		</div>
	);
};

export default Header;
