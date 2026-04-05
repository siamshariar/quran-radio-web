import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import styles from "./DeeniTvPromoModal.module.css";

const DeeniTvPromoModal = ({ onClose }) => {
	const deeniTvUrl = "#";

	return (
		<div className={styles.root} role="dialog" aria-modal="true" aria-label="Deeni TV promo">
			<div className={styles.backdrop} />
			<div className={styles.card}>
				<button className={styles.closeButton} onClick={onClose} aria-label="Close promo">
					<CloseIcon />
				</button>
				<div className={styles.popupLogo}>
					<Image
						src="/img/logo/deeni-tv.png"
						alt="Deeni TV"
						width={150}
						height={80}
						style={{ objectFit: "contain", objectPosition: "center" }}
						loading="eager"
						unoptimized
					/>
				</div>
				<p className={styles.title}>Deeni.tv is now on the Web</p>
				<p className={styles.text}>
					Explore inspiring Islamic programs, lectures & more with just a click.
				</p>
				<div className={styles.openButtonWrap}>
					<a
						href={deeniTvUrl}
						target="_blank"
						rel="noopener noreferrer"
						onClick={onClose}
						className={styles.openButton}>
						Open Deeni TV
						<PlayCircleOutlineIcon />
					</a>
				</div>
			</div>
		</div>
	);
};

export default DeeniTvPromoModal;
