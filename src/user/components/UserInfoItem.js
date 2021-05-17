import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import ReactStars from "react-stars";

import EditImage from "../../images/edit.svg";
import DeleteImage from "../../images/delete.svg";
import "./UserInfoItem.css";
import "../../shared/components/UIElements/Card";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import { LoginContext } from "../../shared/context/login-context";
import Modal from "../../shared/components/UIElements/Modal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserInfoItem = (props) => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const login = useContext(LoginContext);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const history = useHistory();

	const showDeleteWarningHandler = () => {
		setShowConfirmModal(true);
	};

	const cancelDeleteHandler = () => {
		setShowConfirmModal(false);
	};

	const confirmDeleteProfileHandler = async () => {
		setShowConfirmModal(false);
		try {
			await sendRequest(
				`http://localhost:5000/api/users/${props.id}`,
				"DELETE",
				null,
				{
					Authorization: "Bearer " + login.token,
				}
			);
			props.onDelete();
		} catch (error) {}
	};

	const EditProfileHandler = () => {
		history.push(`/users/${props.id}`);
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<Modal
				show={showConfirmModal}
				onCancel={cancelDeleteHandler}
				header="Are you sure?"
				footerClass="profile-item__modal-actions"
				footer={
					<React.Fragment>
						<Button inverse onClick={cancelDeleteHandler}>
							CANCEL
						</Button>
						<Button danger onClick={confirmDeleteProfileHandler}>
							DELETE
						</Button>
					</React.Fragment>
				}
			>
				<p>
					Do you want to proceed and delete the profile? Please note that it
					can't be undone thereafter.
				</p>
			</Modal>
			<li className="user-info-item">
				<Card className="user-info-item__content">
					{isLoading && <LoadingSpinner asOverlay />}
					<div className="user-info-item__image">
						<img
							src={`http://localhost:5000/${props.image}`}
							alt={props.name}
						/>
					</div>

					<div className="user-info-item__description">
						<h2> {props.name} </h2>
						<h3> {props.email} </h3>
						<h3>
							{props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}
						</h3>

						<div className="user-rating">
							<h3> {props.rating} </h3>
							<ReactStars
								count={5}
								size={35}
								color2={"#98B78F"}
								edit={false}
								value={props.rating}
							/>
						</div>

						{login.userId === props.id && (
							<React.Fragment>
								<img
									className="edit"
									src={EditImage}
									alt="edit-button"
									onClick={EditProfileHandler}
								/>

								<img
									className="delete"
									onClick={showDeleteWarningHandler}
									src={DeleteImage}
									alt="trash-can"
								/>
							</React.Fragment>
						)}
					</div>
				</Card>
			</li>
		</React.Fragment>
	);
};

export default UserInfoItem;
