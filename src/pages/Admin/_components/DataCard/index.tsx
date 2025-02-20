import styles from "./styles.module.scss";

type MetricCardProps = {
    value: string | number;
    description: string;
    icon: any,
    onClick?: ()=> void,
}

const MetricCard = ({
    value,
    description,
    icon,
    onClick,
}: MetricCardProps) => {

    return (
        <div className={`${styles.card} ${onClick && styles.clickable}`} onClick={onClick}>
            <div className={styles.values}>
                <p>{value}</p>
                <small>{description}</small>
            </div>
            <div className={`${styles.iconWrapper}`}>
            {icon}
            </div>
        </div>
    )
}

export default MetricCard;