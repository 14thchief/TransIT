import { svgs } from "src/assets";
import styles from "./_styles.module.scss";

const ErrorPage = () => {
	return (
		<div className={styles.component_fallback}>
			<img src={svgs.error} alt="error illustration" />
			<div className={styles.message}>
				<h1>
					Oops! <span>💔</span> <br /> Something went wrong.
				</h1>
				{/* <div className={styles.error_message}> */}
				<p>Try again at a later time.</p>
				{/* </div> */}
			</div>
		</div>
	);
};

export default ErrorPage;
