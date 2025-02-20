import { ReactElement } from "react";
import styles from "./styles.module.scss";

export type CardIconPropType = {
    arrow: ReactElement
    mode?:"basic" | "graphical"
    severity: "success" | "warning" | "critical"
}

const CardIcon = ({
    arrow,
    mode = "basic",
    severity
}: CardIconPropType)=> {

    return (
        <div className={`${styles.iconContainer} ${styles[mode]} ${styles[severity]}`}>
            {arrow}
        </div>
    )
}

export default CardIcon;