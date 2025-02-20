/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import usePersistedState from "./usePersistedState";

type UseFileUploadProps = {
	allowedTypes?: string[];
	allowedSize?: number;
	fileName: string;
	persist?: boolean;
};

export const useFileUpload = ({
	allowedTypes = [
		"image/jpeg",
		"image/png",
		"image/webp",
		"image/avif",
		"image/svg+xml",
		"application/pdf",
		"application/msword", //doc
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document", //docx
		"application/vnd.ms-powerpoint", //ppt
		"application/vnd.openxmlformats-officedocument.presentationml.presentation", //pptx
		"application/vnd.ms-excel", //xls
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", //xlsx
		"application/zip",
		"application/vnd.rar",
		"text/csv",
		// You can add more MIME types if what you need is not here.
	],
	allowedSize = 2, // In Megabytes(MB)
	fileName,
	persist = false,
}: UseFileUploadProps) => {
	const [uploadedFile, setUploadedFile] = persist? 
		usePersistedState<File | null>({
			defaultValue: null,
			storageKey: `uploaded-file-${fileName}`,
		})
		: useState<File | null>(null);

	const [errMsg, setErrMsg] = useState("");

	const allowedSizeInBytes = allowedSize * 1024 * 1024;

	const handleUpload = (file: File) => {
		if (
			file &&
			allowedTypes.includes(file.type) &&
			file.size <= allowedSizeInBytes
		) {
			setUploadedFile(file);
			setErrMsg("");
		} else if (!allowedTypes.includes(file.type)) {
			setErrMsg("Invalid file type.");
		} else if (file.size > allowedSizeInBytes) {
			setErrMsg(`Maximum file size is ${allowedSize}MB.`);
		}
	};

	const handleBrowseFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			handleUpload(file);
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		handleUpload(file);
	};

	return {
		handleBrowseFiles,
		handleDragOver,
		handleDrop,
		uploadedFile,
		setUploadedFile,
		errMsg,
	};
};
