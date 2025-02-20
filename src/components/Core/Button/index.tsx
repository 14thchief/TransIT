import { ReactNode } from "react";
import { ButtonHTMLAttributes } from "react";
import { svgs } from "src/assets";
import styles from "./_styles.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?:
		| "main"
		| "main-reverse"
		| "alt"
		| "grey"
		| "text"
		| "underlined"
		| "transparent";
	width?: "full" | "fit" | number;
	size?: "very-small" | "small" | "medium" | "big";
	text?: React.ReactNode;
	icon?: ReactNode;
	iconRight?: boolean;
	isLoading?: boolean;
}

const Button = ({
	variant = "main",
	width = "full",
	size = "big",
	iconRight = false,
	text,
	icon,
	isLoading,
	disabled,
	...restProps
}: ButtonProps) => {
	return (
		<button
			className={`${styles[variant]} ${styles[size]} ${
				width && typeof width !== "number" && styles[width]
			} ${iconRight && styles["icon_right"]}`}
			style={{ width: typeof width === "number" ? `${width}px` : undefined }}
			{...restProps}
			disabled={isLoading || disabled}
		>
			{icon && <span className={styles.icon}>{icon}</span>}
			{text && text}
			{isLoading && (
				<img className={styles.loading} src={svgs.loading} alt="loading"></img>
			)}
		</button>
	);
};
export default Button;
