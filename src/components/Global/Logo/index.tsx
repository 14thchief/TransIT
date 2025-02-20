import { images } from "src/assets";
import styles from "./_styles.module.scss";

type LogoProps = {
	size?: "large" | "medium" | "small";
	onClick?: () => null;
};

const Logo = ({ size = "large", onClick }: LogoProps) => {
	return (
		<div className={`${styles.logo} ${styles[size]}`} onClick={onClick}>
			<img src={images.logo} alt="logo" />
			{/* <h2>SOFTGATE</h2> */}
		</div>
	);
};
export default Logo;
