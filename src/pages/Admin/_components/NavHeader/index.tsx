import { Link } from "react-router-dom";
import styles from "./_styles.module.scss";
import { ArrowRight } from "src/assets/icons/icons";

export type NavheaderProps = {
	links: { text: string; path: string; onClick?: () => void }[];
};

const NavHeader = ({ links }: NavheaderProps) => {
	const slicedLinks = links.length > 1 ? links.slice(0, -1) : links;
	return (
		<div className={styles.header}>
			{slicedLinks.map((link) => (
				<Link
					className={styles.link}
					to={link.path}
					onClick={link.onClick}
					key={link.text}
				>
					<ArrowRight />
					{link.text}
				</Link>
			))}
			{links.length > 1 && (
				<span className={styles.link_disabled}>
					<ArrowRight />
					{links[links.length - 1].text}
				</span>
			)}
		</div>
	);
};

export default NavHeader;
