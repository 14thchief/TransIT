import styles from './_styles.module.scss';

const Spinner = ({ size }: { size?: 'small' | 'large' }) => {
	return (
		<div className={`${styles['container']} ${size ? styles[size] : ''}`}>
			<div className={styles.loader}></div>
		</div>
	);
};

export default Spinner;
