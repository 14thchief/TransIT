import CopyToClipboard from "components/Global/CopyToClipboard";
import styles from "./styes.module.scss";
import { formatMoney } from "src/utilities/formatCurrency";
import wema from "../../../../../../../assets/svg/wema.svg";

interface AccountCardProps {
    name: string;
    number: string;
    balance: number;
    bank: string;
    isSelected: boolean;
    onClick?: ()=> void;
}

const AccountCard = ({
    name,
    number,
    balance,
    bank,
    isSelected = false,
    onClick
}: AccountCardProps) => {

    return (
        <div onClick={onClick} className={`${styles.card} ${isSelected && styles.active}`}>
            <div className={styles.name}>
                <div className={styles.imgWrap}>
                    <img src={wema} alt="wema_bank" />
                </div>
                <div className={styles.bankName}>
                    <p>{bank}</p>
                    <strong>{name}</strong>
                </div>
            </div>
            <div className={styles.number}>
                <strong>{number}</strong>
                <CopyToClipboard value={number} iconOnly />
            </div>
            <div className={styles.balance}>
                <p>Account Balance</p>
                <strong>{formatMoney(balance)}</strong>
            </div>
        </div>
    )
}

export default AccountCard;