import React, { useRef, useState, useEffect } from "react";

import "./ImageUpload.css";
import Button from "../FormElements/Button";

const ImageUpload = (props) => {
	const [file, setFile] = useState();
	const [previewUrl, setPreviewUrl] = useState();
	const [isValid, setIsValid] = useState(false);
	const chooseFileRef = useRef();

	useEffect(() => {
		if (!file) {
			return;
		}
		const fileReader = new FileReader();
		fileReader.onload = () => {
			setPreviewUrl(fileReader.result);
		};
		fileReader.readAsDataURL(file);
	}, [file]);

	const chooseHandler = (event) => {
		let chosenFile;
		let fileIsValid = isValid;
		if (event.target.files && event.target.files.length === 1) {
			chosenFile = event.target.files[0];
			setFile(chosenFile);
			setIsValid(true);
			fileIsValid = true;
		} else {
			setIsValid(false);
			fileIsValid = false;
		}
		props.onInput(props.id, chosenFile, fileIsValid);
	};

	const chooseImageHandler = () => {
		chooseFileRef.current.click();
	};

	return (
		<div className="form-control">
			<input
				ref={chooseFileRef}
				id={props.id}
				type="file"
				style={{ display: "none" }}
				accept=".jpg, .png, .jpeg"
				onChange={chooseHandler}
			/>
			<div className={`image-upload ${props.center && "center"}`}>
				<div className="image-upload__preview">
					{previewUrl && <img src={previewUrl} alt="preview" />}
					{!previewUrl && <p>Please choose an image.</p>}
				</div>
				<Button type="button" onClick={chooseImageHandler}>
					CHOOSE IMAGE
				</Button>
			</div>
			{!isValid && <p> {props.errorText} </p>}
		</div>
	);
};

export default ImageUpload;
