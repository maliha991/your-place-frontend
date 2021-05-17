import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import { LoginContext } from "../../shared/context/login-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import "./PlaceForm.css";

const UpdatePlace = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [loadedPlace, setLoadedPlace] = useState();
	const history = useHistory();
	const login = useContext(LoginContext);
	const placeId = useParams().placeId;

	const [formState, inputHandler, setFormData] = useForm(
		{
			title: {
				value: "",
				isValid: false,
			},
			description: {
				value: "",
				isValid: false,
			},
			image: {
				value: null,
				isValid: false,
			},
		},
		false
	);

	useEffect(() => {
		const fetchPlace = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/places/${placeId}`
				);
				setLoadedPlace(responseData.place);
				setFormData(
					{
						title: {
							value: responseData.place.title,
							isValid: true,
						},
						description: {
							value: responseData.place.description,
							isValid: true,
						},
						image: {
							value: responseData.place.image,
							isValid: true,
						},
					},
					true
				);
			} catch (error) {}
		};
		fetchPlace();
	}, [sendRequest, placeId, setFormData]);

	const placeUpdateSubmitHandler = async (event) => {
		event.preventDefault();
		try {
			const formData = new FormData();
			formData.append("title", formState.inputs.title.value);
			formData.append("description", formState.inputs.description.value);
			formData.append("image", formState.inputs.image.value);
			await sendRequest(
				`http://localhost:5000/api/places/${placeId}`,
				"PATCH",
				formData,
				{
					Authorization: "Bearer " + login.token,
				}
			);
			history.push(`/${login.userId}/profile`);
		} catch (error) {}
	};

	if (isLoading) {
		return (
			<div className="center">
				<LoadingSpinner asOverlay />
			</div>
		);
	}

	if (!loadedPlace && error) {
		return (
			<div className="center">
				<Card>
					<h2>Couldn't find place!</h2>
				</Card>
			</div>
		);
	}

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{!isLoading && loadedPlace && (
				<form className="place-form" onSubmit={placeUpdateSubmitHandler}>
					<Input
						id="title"
						element="title"
						type="text"
						label="Title"
						validators={[VALIDATOR_REQUIRE()]}
						errorText="Please enter a valid title."
						onInput={inputHandler}
						initialValue={loadedPlace.title}
						initialValid={true}
					/>

					<Input
						id="description"
						element="textarea"
						label="Description"
						validators={[VALIDATOR_MINLENGTH(5)]}
						errorText="Please enter a valid description (at least 5 characters)."
						onInput={inputHandler}
						initialValue={loadedPlace.description}
						initialValid={true}
					/>

					<ImageUpload id="image" onInput={inputHandler} />

					<Button type="submit" disabled={!formState.isValid}>
						UPDATE PLACE
					</Button>
				</form>
			)}
		</React.Fragment>
	);
};

export default UpdatePlace;
