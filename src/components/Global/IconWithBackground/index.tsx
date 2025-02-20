import { ReactElement } from "react";
import styles from "./styles.module.scss";

type IWBProps = {
    bgColor: string;
    element: ReactElement;
}
const IconWithBackground = ({bgColor, element}: IWBProps) => {

    return (
        <div className={styles.container} style={{backgroundColor: bgColor}}>
        {element}
        </div>
    )
}

export default IconWithBackground;