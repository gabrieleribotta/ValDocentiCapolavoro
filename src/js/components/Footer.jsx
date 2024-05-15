import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Footer.css";
import useCommon from "../useCommon";

const Footer = () => {
    const { Logout } = useCommon();
    const navigate = useNavigate();
    const goBack=()=> {
        navigate(-1);
    }
    const footerElement = useRef();

    useEffect(() => {
        let prevScrollposFooter = window.scrollY;

        const handleScroll = () => {
            let currentScrollPosFooter = window.scrollY;
            if (footerElement.current && footerElement.current.style) {
                if (prevScrollposFooter > currentScrollPosFooter) {
                    footerElement.current.style.bottom = "0";
                } else {
                    footerElement.current.style.bottom = "-25vw";
                }
            }
            prevScrollposFooter = currentScrollPosFooter;
        };

        // Add the scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // Empty dependency array means this effect runs once after initial render

    return (
        <div className="d-md-none row justify-content-center align-items-end Footer" ref={footerElement}>
            {/* contenitore icone */}
            <div className="col d-flex align-items-center justify-content-around">
                <div onClick={goBack}>
                    <i className="bi bi-arrow-left-short footer-icon"></i>
                </div>
                <div onClick={Logout}>
                    <i className="bi bi-box-arrow-left footer-icon"></i>
                </div>
            </div>
        </div>
    )
}

export default Footer