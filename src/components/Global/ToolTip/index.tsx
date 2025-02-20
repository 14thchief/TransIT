import { Help } from 'src/assets/icons/icons';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styles from './_styles.module.scss';

const ToolTip = ({
	id,
	content,
}: {
	id: string;
	content: { heading?: string; text: string };
}) => {
	return (
		<>
			<a data-tooltip-id={id} className={styles.tooltip_icon}>
				<Help />
			</a>
			<ReactTooltip id={id} className={styles.tooltip}>
				<div>
					<h4>{content?.heading}</h4>
					<p>{content.text}</p>
				</div>
			</ReactTooltip>
		</>
	);
};

export default ToolTip;
