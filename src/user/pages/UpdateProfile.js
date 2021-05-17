import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import "../../places/pages/PlaceForm.css";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import { LoginContext } from "../../shared/context/login-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_EMAIL,
	VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

const UpdateProfile = () => {
	const login = useContext(LoginContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [loadedProfile, setLoadedProfile] = useState();
	const history = useHistory();
	const userId = useParams().userId;

	const [formState, inputHandler, setFormData] = useForm(
		{
			name: {
				value: "",
				isValid: false,
			},
			email: {
				value: "",
				isValid: false,
			},
			prevPassword: {
				value: "",
				isValid: true,
			},
			newPassword: {
				value: "",
				isValid: true,
			},
			image: {
				value: null,
				isValid: false,
			},
		},
		false
	);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/users/${userId}`
				);
				setLoadedProfile(responseData.user);
				setFormData(
					{
						name: {
							value: responseData.user.name,
							isValid: true,
						},
						email: {
							value: responseData.user.email,
							isValid: true,
						},
						image: {
							value: responseData.user.image,
							isValid: true,
						},
					},
					true
				);
			} catch (error) {}
		};
		fetchProfile();
	}, [sendRequest, userId, setFormData]);

	const userUpdateSubmitHandler = async (event) => {
		event.preventDefault();
		try {
			const formData = new FormData();
			formData.append("name", formState.inputs.name.value);
			formData.append("email", formState.inputs.email.value);
			formData.append("prevPassword", formState.inputs.prevPassword.value);
			formData.append("newPassword", formState.inputs.newPassword.value);
			formData.append("image", formState.inputs.image.value);
			const responseData = await sendRequest(
				`http://localhost:5000/api/users/${userId}`,
				"PATCH",
				formData,
				{
					Authorization: "Bearer " + login.token,
				}
			);
			const { updated } = responseData;
			if (updated) {
				history.push(`/${login.userId}/profile`);
			}
		} catch (error) {}
	};

	if (isLoading) {
		return (
			<div className="center">
				<LoadingSpinner asOverlay />
			</div>
		);
	}

	if (!loadedProfile && !error) {
		return (
			<div className="center">
				<Card>
					<h2>Could not find user profile!</h2>
				</Card>
			</div>
		);
	}

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{!isLoading && loadedProfile && (
				<form className="place-form" onSubmit={userUpdateSubmitHandler}>
					<Input
						id="name"
						element="input"
						type="text"
						label="Name"
						validators={[VALIDATOR_REQUIRE()]}
						errorText="Please enter a valid name."
						onInput={inputHandler}
						initialValue={loadedProfile.name}
						initialValid={true}
					/>
					<Input
						id="email"
						element="input"
						type="email"
						label="E-mail"
						validators={[VALIDATOR_EMAIL()]}
						errorText="Please enter a valid email address."
						onInput={inputHandler}
						initialValue={loadedProfile.email}
						initialValid={true}
					/>
					<Input
						id="prevPassword"
						element="input"
						type="password"
						label="Enter previous password"
						validators={[VALIDATOR_MINLENGTH(6)]}
						errorText="Please enter a valid password."
						onInput={inputHandler}
						initialValid={true}
					/>
					<Input
						id="newPassword"
						element="input"
						type="password"
						label="Enter new password"
						validators={[VALIDATOR_MINLENGTH(6)]}
						errorText="Please enter a valid password."
						onInput={inputHandler}
						initialValid={true}
					/>
					<ImageUpload id="image" onInput={inputHandler} />
					<Button type="submit" disabled={!formState.isValid}>
						UPDATE PROFILE
					</Button>
				</form>
			)}
		</React.Fragment>
	);
};

export default UpdateProfile;
