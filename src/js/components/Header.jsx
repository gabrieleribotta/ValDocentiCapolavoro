import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Header.css";
import DeninaLogo from "../../images/logo.png";
import useCommon from "../useCommon";

const Header = () => {
	const { Logout } = useCommon();
	
	const headerElement = useRef();
	const navigate = useNavigate();

	useEffect(() => {
		let prevScrollposHeader = window.scrollY;

		const handleScroll = () => {
			let currentScrollPosHeader = window.scrollY;
			if (headerElement.current && headerElement.current.style) {
				if (prevScrollposHeader > currentScrollPosHeader) {
					headerElement.current.style.top = "0";
				} else {
					headerElement.current.style.top = "-25vw";
				}
			}
			prevScrollposHeader = currentScrollPosHeader;
		};

		// Add the scroll event listener
		window.addEventListener("scroll", handleScroll);

		// Clean up the event listener when the component unmounts
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []); // Empty dependency array means this effect runs once after initial render

	return (
		<div
			className="row justify-content-between align-items-center Header pb-3 pt-3"
			ref={headerElement}
		>
			{/* contenitore logo */}
			<div className="col-3 d-none d-md-flex align-items-center">
				<img src={DeninaLogo} alt="Logo IIS Denina" className="logo" />
			</div>
			{/* contenitore scritta */}
			<div className="col-12 col-md-3 d-flex justify-content-center align-items-center">
				<h1 className="d-none d-lg-block unSelText">
					Valutazione docenti
				</h1>
				<h2 className="d-lg-none unSelText">Valutazione docenti</h2>
			</div>
			{/* contenitore info */}
			<div className="col-3 d-none d-md-flex align-items-center justify-content-end">
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
			{/* contenitore logout */}
			<div className="col-3 d-none d-md-flex align-items-center justify-content-end" onClick={Logout}>
				<div>
					<p className="text-center logout-text">
						Logout
						<br />
						<i className="bi bi-box-arrow-left logout"></i>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Header;
