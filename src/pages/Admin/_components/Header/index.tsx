import { CgArrowLeft } from "react-icons/cg";
import NavHeader, { NavheaderProps } from "../NavHeader";
import styles from "./styles.module.scss";
import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

export type HeaderAction = {
	mode: "active" | "passive";
	btnVariant?: "main" | "main-reverse";
	text: string;
	onClick?: () => void;
	passiveValue?: string | number;
	passiveValueSeverity?: "good" | "fair" | "bad";
};

const Header = (props: {
	title: string;
	titleVariant?: "default" | "smaller";
	description?: string;
	actions?: ReactElement[];
	links?: NavheaderProps["links"];
	goBack?: boolean | string;
	goBackCb?: ()=> void;
}) => {
	const navigate = useNavigate();

	return (
		<header>
			{props.links?.length ? <NavHeader links={props.links} /> : null}
			<div className={styles.header}>
				{
					props.goBack? (
						<div onClick={props.goBackCb ?? (()=> navigate(-1))} className={styles.goBack}>
							<CgArrowLeft size={18} />
							<p>{typeof props.goBack === "string"? props.goBack : "Back"}</p>
						</div>
					)
					:
					(
						<div className={`${styles.title} ${props.titleVariant && styles[props.titleVariant]}`}>
							<h1>{props.title}</h1>
							{
								props.description 
								&& 
								<p>{props.description}</p>
							}
						</div>
					)
				}
				<div className={styles.actions}>
					{props.actions?.map((item) => item)}
				</div>
			</div>
		</header>
	);
};

export default Header;
