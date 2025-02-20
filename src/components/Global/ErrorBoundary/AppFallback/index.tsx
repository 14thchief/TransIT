import { Link } from "react-router-dom";
import { svgs } from "src/assets";
import AuthLayout from "src/layout/AuthLayout/AuthLayout";
import styles from "./_styles.module.scss";
import Button from "components/Core/Button";

type AppFallbackProps = {
	error: any;
	resetErrorBoundary: () => null;
};

const AppFallback = ({ error, resetErrorBoundary }: AppFallbackProps) => {
	return (
		<AuthLayout>
			<div className={styles.fallback_body}>
				<img src={svgs.error} alt="error illustration" />
				<div className={styles.message}>
					<h1>
						Oops! <span>💔</span> <br /> Something went wrong.
					</h1>
					<h4>
						But it's most likely not your fault. Please try again or contact
						support.
					</h4>
					<div className={styles.error_message}>
						<p>{error.message}</p>
					</div>
					<div className={styles.buttons}>
						<Link to={"/"}>
							<Button text="Try again" onClick={resetErrorBoundary} />
						</Link>
						<Button text="Contact Support" variant="alt" />
					</div>
				</div>
			</div>
		</AuthLayout>
	);
};

export default AppFallback;
