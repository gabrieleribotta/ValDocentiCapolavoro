import React, { useRef, useEffect } from "react";

const BackToTopButton = () => {
	// back to top button
	const backToTopBtn = useRef();

	useEffect(() => {
		const scrollFunction = () => {
			const btnStyle = backToTopBtn.current && backToTopBtn.current.style;

			if (btnStyle) {
				if (
					document.body.scrollTop > 20 ||
					document.documentElement.scrollTop > 20
				) {
					btnStyle.display = "flex";
				} else {
					btnStyle.display = "none";
				}
			}
		};

		// Add the scroll event listener
		window.addEventListener("scroll", scrollFunction);

		// Clean up the event listener when the component unmounts
		return () => {
			window.removeEventListener("scroll", scrollFunction);
		};
	}, []); // Empty dependency array means this effect runs once after initial render

	// When the user clicks on the button, scroll to the top of the document
	const topFunction = () => {
		document.body.scrollTop = 0; // For Safari
		document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	};

    return (
        <button id="backToTopBtn" title="Torna su" onClick={topFunction} ref={backToTopBtn}>
            <i className="bi bi-arrow-up"></i>
        </button>
    )
}

export default BackToTopButton