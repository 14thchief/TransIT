import styles from "./_styles.module.scss";

const Divider = ({ text = "" }) => {
  return (
    <div className={styles.divider}>
      <span>{text}</span>
    </div>
  );
};

export default Divider;
