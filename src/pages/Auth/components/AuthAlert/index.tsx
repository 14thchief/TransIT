import Button from "components/Core/Button";
import styles from "./_styles.module.scss";
import { gifs } from "src/assets";

type EmailSentProps = {
	title: string;
	description: React.ReactNode;
	btnText: string;
	btnCallback: () => void;
	secondaryBtn?: React.ReactNode;
	variant?: "emailSuccess" | "success";
};

const AuthAlert = ({
	title,
	description,
	btnText,
	secondaryBtn,
	btnCallback,
	variant = "success",
}: EmailSentProps) => {
	return (
		<div className={styles.status}>
			<div className={styles.status_imageWrapper}>
				<img src={gifs[variant]} alt="icon" />
			</div>

			<div className={styles.status_body}>
				<h4>{title}</h4>
				<p>{description}</p>
			</div>

			<div className={styles.status_buttons}>
				<Button text={btnText} onClick={btnCallback} />

				{secondaryBtn}
			</div>
		</div>
	);
};

export default AuthAlert;
