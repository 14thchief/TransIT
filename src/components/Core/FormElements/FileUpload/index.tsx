import { FieldValues, UseFormRegister } from "react-hook-form";
import styles from "./_styles.module.scss";
import { FileUploadProps } from "../FormElement/types";
import { Receipt, UploadCloud } from "src/assets/icons/icons";
import { useFileUpload } from "src/hooks/useFileUpload";
import { BsX } from "react-icons/bs";
import { MouseEventHandler, useEffect, useState } from "react";

type FileUploadInputProps = FileUploadProps & {
	register: UseFormRegister<FieldValues>;
};

const FileUpload = ({
	fieldName,
	register,
	required,
	resetState,
}: FileUploadInputProps) => {
	const {
		handleBrowseFiles,
		handleDragOver,
		handleDrop,
		uploadedFile,
		errMsg,
	} = useFileUpload({
		fileName: fieldName,
	});

	const [imageSrc, setImageSrc] = useState(
		uploadedFile instanceof File ? URL.createObjectURL(uploadedFile) : undefined
	);
	useEffect(()=> {
		if (resetState) {
			setImageSrc(undefined);
		}
	}, [resetState]);

	useEffect(() => {
		if (uploadedFile instanceof File) {
			setImageSrc(URL.createObjectURL(uploadedFile));
		} else {
			setImageSrc(undefined);
		}
	}, [uploadedFile]);

	const removeImage: MouseEventHandler<HTMLButtonElement> = (event) => {
		event.preventDefault();
		setImageSrc(undefined);
	};

	return (
		<div
			className={`${styles.fileUpload}`}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			<input
				id={fieldName}
				type="file"
				{...register(fieldName, {
					required: required ? "This field is required." : false,
				})}
				onChange={handleBrowseFiles}
			/>
			{errMsg && <span className={styles.error}>{errMsg}</span>}
			{imageSrc ? (
				<div className={styles.uploadedImageContainer}>
					<button onClick={removeImage} className={styles.resetImage}>
						<BsX size={24} />
					</button>
					{uploadedFile?.type.includes("image") ? (
						<img src={imageSrc} alt="Preview Image" />
					) : (
						<div className={styles.filePreview}>
							<Receipt size={48} />
							<span>{uploadedFile?.name}</span>
						</div>
					)}

					<div className={styles.uploadCloud}>
						<UploadCloud size={24} color={"#fff"} />
						Click to change
					</div>
				</div>
			) : (
				<div className={styles.uploadContainer}>
					<UploadCloud color={"#475467"} />
					<div>
						<p>
							<strong>Click to upload</strong> or drag and drop
						</p>
						<p>File max 2MB</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default FileUpload;
