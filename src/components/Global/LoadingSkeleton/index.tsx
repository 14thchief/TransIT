import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./_styles.module.scss";

type SkeletonProps = {
	count?: number;
	height?: number;
	variant?: "card" | "list";
};

const LoadingSkeleton = ({
	count = 3,
	height = 100,
	variant = "card",
}: SkeletonProps) => {
	return (
		<Skeleton
			count={count}
			height={height}
			containerClassName={styles[variant]}
			inline={true}
		/>
	);
};

export default LoadingSkeleton;
