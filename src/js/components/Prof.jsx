import React from "react";
import { useNavigate } from "react-router-dom";

const Prof = (props) => {
    const navigate = useNavigate();

    return (
        <div className="col-12 col-lg-3 person-container" key={props.indice} onClick={()=> {navigate("/Valutazione", {state: {
            nome: props.nome,
            cognome: props.cognome,
            materia: props.materie
        }})}}>
            <i>{props.nome + " " + props.cognome}</i>
            <p className="mt-2">{props.materie}</p>
        </div>
    )
}

export default Prof