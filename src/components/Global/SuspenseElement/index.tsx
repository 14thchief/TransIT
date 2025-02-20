import { svgs } from "src/assets";
import styles from "./_styles.module.scss";

const SuspenseElement = () => {
  return (
    <div className={styles.suspense_container}>
      <img src={svgs.spinner} alt="loader" />
    </div>
  );
};

export default SuspenseElement;
