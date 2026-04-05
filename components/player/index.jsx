import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import {
	PlayerStore,
	setPlayerOpen,
	setPlayerMini,
	setPlaying,
	setSliderDown,
} from "../../store";
import AudioMini from "./AudioMini";
import AudioTag from "./Audio";
import HomeContent from "@/components/ui/HomeContent";
import styles from "./index.module.css";
import Dialog from "./Dialog";
import DeeniTvPromoModal from "../actions/DeeniTvPromoModal";

const DEENI_TV_PROMO_STORAGE_KEY = "deenitv-web-promo-shown";
const FIRST_DIALOG_STORAGE_KEY = "firstDialog";

const Player = () => {
	const [windowHeight, setWindowHeight] = useState(0);
	const [panelHeight, setPanelHeight] = useState(0);
	const [maxTranslate, setMaxTranslate] = useState(1);

	const [translate, setTranslate] = useState(0);
	const [currentY, setCurrentY] = useState(0);
	const [tempCurrentY, setTempCurrentY] = useState(0);

	const isPlayerOpen = PlayerStore.useState((s) => s.open);
	const isPlayerMini = PlayerStore.useState((s) => s.mini);
	const sliderDown = PlayerStore.useState((s) => s.sliderDown);
	// console.log("wh", +windowHeight);
	// console.log("Tr", +translate);
	// console.log("currentY", +currentY);
	// console.log(sliderDown);

	const panelRef = useRef(null);
	const headerRef = useRef(null);
	const containerRef = useRef(null);
	const backdropRef = useRef(null);
	const miniMenuRef = useRef(null);

	const router = useRouter();
	const [path, setPath] = useState("/");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [promoOpen, setPromoOpen] = useState(false);
	const promoTimerRef = useRef(null);

	useEffect(() => {
		setPath(router.pathname);
	}, [router]);

	useEffect(() => {
		setSliderDown(false);
		setWindowHeight(window.innerHeight);
		setPanelHeight(window.innerHeight);
		setMaxTranslate(window.innerHeight);
		setTranslate(
			path === "/"
				? 2 * window.innerHeight
				: isPlayerMini
				? window.innerHeight
				: window.innerHeight
		);
	}, [path, sliderDown]);

	useEffect(() => {
		const handleResize = () => {
			setWindowHeight(window.innerHeight);
			setPanelHeight(window.innerHeight);
			setMaxTranslate(window.innerHeight);
			setTranslate(isPlayerMini ? window.innerHeight : 0);
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [isPlayerMini]);

	const handleTouchStart = (event) => {
		// console.log(event.touches[0]);
		setCurrentY(windowHeight - event.touches[0].clientY);
	};

	const handleTouchMove = (event) => {
		setTempCurrentY(currentY);
		setCurrentY(windowHeight - event.touches[0].clientY);

		if (
			translate + tempCurrentY - currentY > 0 &&
			translate + tempCurrentY - currentY < maxTranslate
		) {
			setTranslate(translate + tempCurrentY - currentY);
		}
	};

	const handleTouchEnd = () => {
		if (translate > panelHeight / 3) {
			containerRef.current.style.transition = `transform 250ms ease`;
			backdropRef.current.style.transition = `opacity 250ms ease`;
			setTranslate(maxTranslate);

			setTimeout(() => {
				containerRef.current.style.transition = "unset";
				backdropRef.current.style.transition = "unset";
			}, 250);
		} else {
			containerRef.current.style.transition = `transform 250ms ease`;
			backdropRef.current.style.transition = `opacity 250ms ease`;
			setTranslate(0);

			setTimeout(() => {
				containerRef.current.style.transition = "unset";
				backdropRef.current.style.transition = "unset";
			}, 250);
		}
	};

	useEffect(() => {
		containerRef.current.style.transform = `translateY(${translate}px)`;
		backdropRef.current.style.opacity = 1 - translate / maxTranslate;
		miniMenuRef.current.style.opacity = 1 - translate / maxTranslate;

		if (translate < maxTranslate) {
			setPlayerMini(false);
		} else {
			setPlayerMini(true);
		}
	}, [translate, panelHeight, windowHeight]);

	useEffect(() => {
		isPlayerMini
			? (backdropRef.current.style.display = "none")
			: (backdropRef.current.style.display = "block");
	}, [isPlayerMini]);

	const schedulePromoPopup = () => {
		if (promoTimerRef.current) {
			window.clearTimeout(promoTimerRef.current);
		}

		const delayInSeconds = Math.floor(Math.random() * 21) + 40;
		promoTimerRef.current = window.setTimeout(() => {
			localStorage.setItem(DEENI_TV_PROMO_STORAGE_KEY, JSON.stringify(true));
			setPromoOpen(true);
		}, delayInSeconds * 1000);
	};

	useEffect(() => {
		const firstDialog = JSON.parse(localStorage.getItem(FIRST_DIALOG_STORAGE_KEY) || 'false');
		const promoShown = JSON.parse(localStorage.getItem(DEENI_TV_PROMO_STORAGE_KEY) || 'false');

		if (!firstDialog) {
			setDialogOpen(true);
		}

		if (firstDialog && !promoShown) {
			schedulePromoPopup();
		}

		return () => {
			if (promoTimerRef.current) {
				window.clearTimeout(promoTimerRef.current);
				promoTimerRef.current = null;
			}
		};
	}, []);

	const handleDialog = () => {
		setDialogOpen(false);
		setPlaying(true);
		localStorage.setItem(FIRST_DIALOG_STORAGE_KEY, JSON.stringify(true));
		schedulePromoPopup();
	};

	const handlePromoClose = () => {
		setPromoOpen(false);
	};

	return (
		<>
			{dialogOpen && <Dialog handleDialog={handleDialog} />}
			{promoOpen && <DeeniTvPromoModal onClose={handlePromoClose} />}

			<div className={styles.backdrop} ref={backdropRef}></div>

			<div className={styles.panel_container} ref={containerRef}>
				<div
					className={styles.audio_mini}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}>
					<AudioMini />
				</div>

				<div
					className={styles.panel_header}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}></div>

				<div className={styles.panel_content} ref={miniMenuRef}>
					<HomeContent />
				</div>
			</div>

			<AudioTag />
		</>
	);
};

export default Player;
