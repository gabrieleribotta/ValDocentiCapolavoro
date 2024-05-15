import React from "react";
import Swal from "sweetalert2";
import "../../css/Docente.css"

const Aiuto = () => {

	const aiuto=()=>{
		Swal.fire({
			icon: "info",
			title: "Medie",
			text: "Per vedere la media precisa, cliccare la barra corrispondente nel grafico",
			confirmButtonText: "Capito",
		})
	}

    return (
        <button className="d-md-none" id="pulsanteAiuto" title="Torna su" onClick={aiuto}>
            ?
        </button>
    )
}

export default Aiuto