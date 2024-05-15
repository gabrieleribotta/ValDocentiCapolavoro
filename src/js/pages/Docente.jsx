import {React,useRef,useEffect,useState} from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Aiuto from "../components/Aiuto";
import { Bar } from "react-chartjs-2";
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,} from 'chart.js';
import "../../css/Docente.css"
import packageInfo from "../../config.json";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useCommon from "../useCommon";

  ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
  );



const Docente = () => {
	const SERVER=packageInfo.SERVER
	const NOME_COGNOME_DOCENTE=packageInfo.NOME_COGNOME_DOCENTE
	const VIEW_DOCENTE=packageInfo.VIEW_DOCENTE
	const SCARICA_PDF=packageInfo.SCARICA_PDF

	const [token, setToken] = useState(
		JSON.parse(localStorage.getItem("vd-info")).tuo_token
	);
	const [nome, setNome] = useState()
	const [cognome, setCognome] = useState()
	const [medie, setMedie] = useState()
	const [domand,setDomand] = useState()

	const navigate=useNavigate()

	const grafo = useRef()
	const niente = useRef()
	const domande = useRef()
	const iniziate = useRef()

	// ricavo funzioni da file
	const { CheckToken, Logout } = useCommon();

	let labels=[]
	if(domand!==undefined){
		for (let k=0;k<domand.length;k++)
			labels.push("Domanda " + parseInt(k+1))
	}
	const data={
		labels: labels,
		datasets:[{
			backgroundColor: "rgba(0,142,212,1)",
			hoverBackgroundColor: "rgba(0,182,252,1)",
			label: 'Media totale per domanda',
			data: medie,
			skipNull: true
		}]
	}

	const options={
		responsive: true,
		scales: {
			y:{
				max: 10,
				stepSize:1,
			  },
			x:{},
		  },
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: 'Diagramma delle votazioni ricevute da ' + nome + ' ' + cognome
			},
		}
	}

	useEffect(()=>{
		CheckToken()
		.then((dat)=>{
			if(dat.valido){
				fetch(SERVER + NOME_COGNOME_DOCENTE,{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token: token }),
				})
				.then((dati)=>dati.json())
				.then((data)=>{
					if(data.nome===null){
						navigate("/")
						alert(data.messaggio)
					}
					setNome(data.nome)
					setCognome(data.cognome)
				})
			}
			else{
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
		})
		
	},[token])

	useEffect(()=>{
		CheckToken()
		.then(dat=>{
			if(dat.valido){
				fetch(SERVER + VIEW_DOCENTE,{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({nome_docente:nome,cognome_docente:cognome,token:token}),
				})
				.then(datiProf=>datiProf.json())
				.then(profDati=>{
					if(profDati.media==null){
						grafo.current.className="d-none"
						iniziate.current.className="d-none"
						niente.current.className="row nonVal"
		
						if (profDati.messaggio[11]==='d'){
							grafo.current.className="d-none"
							niente.current.className="d-none"
							iniziate.current.className="row nonVal"
						}
					}
					else{
						let med=[]
						let doman=[]
						for (let i=0;i<profDati.media.length;i++){
							med.push(profDati.media[i].media)
							doman.push(profDati.media[i].domanda)
						}
						setMedie(med)
						setDomand(doman)
						iniziate.current.className="d-none"
						grafo.current.className="row"
						niente.current.className="d-none"
						stampaDomande(doman)
					}
				})
			}
			else{
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
		})
		
	},[nome,cognome])
	
	const stampaDomande=(questions)=>{
		for (let j=0;j<questions.length;j++){
			questions[j] = "Domanda " + parseInt(j+1) + ". " + questions[j] + "<br/><br/>"
			domande.current.innerHTML+=questions[j]
		}		
	}

	// const scaricaPDF=()=>{
	// 	CheckToken()
	// 	.then(mess=>{
	// 		if(mess.valido){
	// 			fetch(SERVER + SCARICA_PDF,{
	// 				method:"POST",
	// 				headers:{"Content-Type":"application/json"},
	// 				body: JSON.stringify({token:token,nome_docente:nome,cognome_docente:cognome,valutazioni:medie})
	// 			})
	// 			.then(scarica=>scarica.blob())
	// 			.then(scarica=>{
	// 				let url=document.createElement("a")
	// 				url.target="new"
	// 				url.download=`medie_${nome}_${cognome}.pdf`
	// 				url.href=window.URL.createObjectURL(scarica)
	// 				url.click()
	// 			})
	// 		}
	// 	})
	// } NON FUNZIONANTE/DA IMPLEMENTARE

	return( 
		<div className="container-fluid">
			<Header/>
			<div className="d-none" id="contenitore_grafico" ref={grafo}>
				<Bar id="grafico" className="d" options={options} data={data}></Bar>
				{/* <div className="contBottPdf"><input type="button" value="Scarica il PDF contenente le valutazioni" id="pdf" onClick={scaricaPDF}/></div> */}
				<div className="d-flex align-items-center justify-content-center">
					<div className="col-12 doman" ref={domande}></div>	
				</div>		
			</div>
			<div className="row nonVal" ref={niente}>
				Il docente non è ancora stato valutato
			</div>
			<div className="row nonVal" ref={iniziate}>
				Durante il periodo di valutazione non è possibile visualizzare le medie
			</div>
			<Aiuto/>
			<Footer/>
		</div>
	)
};

export default Docente;
