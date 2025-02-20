import { Inbox } from "../../../assets/icons/icons";
import styles from "./_styles.module.scss";

type EmptyDataProps = {
  title?: string;
  message?: string;
  iconSrc?: string;
};

const EmptyData = ({ message, iconSrc }: EmptyDataProps) => {
  return (
    <div className={styles.emptyData}>
      {iconSrc ? <img src={iconSrc} className="icon" /> : <Inbox className="icon" size={140} />}
      <p>{message || "No data found"}</p>
    </div>
  );
};

export default EmptyData;
