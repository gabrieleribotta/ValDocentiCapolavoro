import React from "react";
import { Link } from "react-router-dom";
import "../../css/Footer.css";
import DeninaLogo from "../../images/logo.png";

const Footer = () => {
    return (
        <div className="d-md-none row justify-content-center align-items-end Footer pb-3 pt-3">
            {/* contenitore icone */}
            <div className="col d-flex align-items-center justify-content-around">
                <div>
                    <img src={DeninaLogo} alt="Logo IIS Denina" className="logo"/>
                </div>
                <div>
                <p className="text-start text-info">
                    <i className="bi bi-geo-alt-fill"></i>&nbsp;&nbsp;Via della Chiesa 17, Saluzzo (CN)<br/>
                    <i className="bi bi-telephone-fill"></i>&nbsp;&nbsp;Tel: <Link onClick={() => window.location = 'tel:+39017543625'}>0175 43625</Link><br/>
                    <i className="bi bi-telephone-fill"></i>&nbsp;&nbsp;Tel: <Link onClick={() => window.location = 'mailto:cnis014001@istruzione.i'}>cnis014001@istruzione.it</Link><br/>
                    <i className="bi bi-telephone-fill"></i>&nbsp;&nbsp;Tel: <Link onClick={() => window.location = 'mailto:cnis014001@pec.istruzione.it'}>cnis014001@pec.istruzione.it</Link><br/>
                    <i className="bi bi-person-vcard-fill"></i>&nbsp;&nbsp;C.F.: 94033200042
                </p>
                </div>
            </div>
        </div>
    )
}

export default Footer