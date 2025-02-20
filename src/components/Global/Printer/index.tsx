import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

// import { PrinterProps } from "./types";
// styles
import styles from "./_styles.module.scss";
import Button from "components/Core/Button";
import Modal from "components/Core/Modal";
// const styles = moduleToBEM(styles);

type PrinterProps = {
	open: boolean;
	documentTitle: string;
	children: React.ReactNode;
};
const Printer = ({
	children,
	open,
	documentTitle = "document",
}: PrinterProps) => {
	const printableRef = useRef<HTMLDivElement>(null);
	const handlePrint = useReactToPrint({
		documentTitle: documentTitle,
		removeAfterPrint: true,
	});
	return (
		<Modal open={open} onClose={() => null}>
			<div className={styles.printer}>
				<div ref={printableRef} className={styles.printer_printable}>
					{children}
				</div>
				<div className={styles.footer}>
					{/* <Button onClick={cancel}>text /> */}
					<Button
						onClick={() => {
							handlePrint(null, () => printableRef.current);
						}}
					>
						Print
					</Button>
				</div>
			</div>
		</Modal>
	);
};
export default Printer;
