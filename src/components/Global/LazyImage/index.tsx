import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import styles from "./_styles.module.scss";

type LazyImageProps = {
  src: string;
  alt: string;
  effect?: "blur" | "opacity" | "black-and-white";
  width?: string | number;
  height?: string | number;
  className?: string;
  onClick?: () => void;
};

const LazyImage = ({
  src,
  alt,
  effect = "blur",
  width,
  height,
  className,
  onClick,
}: LazyImageProps) => {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      effect={effect}
      className={`${styles.center_image} ${
        onClick ? styles.pointer : ""
      } ${className}`}
      onClick={onClick}
    />
  );
};

export default LazyImage;
