import React, { useState, useEffect, useContext } from "react";
import ReactStars from "react-stars";

import "./PlaceItem.css";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { LoginContext } from "../../shared/context/login-context";
import Map from "../../shared/components/UIElements/Map";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Login from "../../user/pages/Login";

const PlaceItem = (props) => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const login = useContext(LoginContext);

	const [totalRating, setTotalRating] = useState(0);
	const [avgRating, setAvgRating] = useState(0);
	const [counter, setCounter] = useState(0);
	const [showMap, setShowMap] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const ratingChangedHandler = (newRating) => {
		setTotalRating(totalRating + newRating);
	};

	useEffect(() => {
		const avg = (totalRating / (counter || 1)).toFixed(1);
		setAvgRating(avg);
	}, [counter]);

	useEffect(() => {
		if (totalRating > 0) setCounter(counter + 1);
	}, [totalRating]);

	const openMapHandler = () => setShowMap(true);
	const closeMapHandler = () => setShowMap(false);

	const showDeleteWarningHandler = () => {
		setShowConfirmModal(true);
	};

	const cancelDeleteHandler = () => {
		setShowConfirmModal(false);
	};

	const confirmDeleteHandler = async () => {
		setShowConfirmModal(false);
		try {
			await sendRequest(
				`http://localhost:5000/api/places/${props.id}`,
				"DELETE",
				null,
				{
					Authorization: "Bearer " + login.token,
				}
			);
			props.onDelete(props.id);
		} catch (error) {}
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<Modal
				show={showMap}
				onCancel={closeMapHandler}
				header={props.address}
				contentClass="place-item__modal-content"
				footerClass="place-item__modal-actions"
				footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
			>
				<div className="map-container">
					<Map center={props.coordinates} zoom={16} />
				</div>
			</Modal>

			<Modal
				show={showConfirmModal}
				onCancel={cancelDeleteHandler}
				header="Are you sure?"
				footerClass="place-item__modal-actions"
				footer={
					<React.Fragment>
						<Button inverse onClick={cancelDeleteHandler}>
							CANCEL
						</Button>
						<Button danger onClick={confirmDeleteHandler}>
							DELETE
						</Button>
					</React.Fragment>
				}
			>
				<p>
					Do you want to proceed and delete this place? Please note theat it
					can't be undone thereafter.
				</p>
			</Modal>

			<li className="place-item">
				<Card className="place-item__content">
					{isLoading && <LoadingSpinner asOverlay />}
					<div className="place-item__image">
						<img
							src={`http://localhost:5000/${props.image}`}
							alt={props.title}
						/>
					</div>
					<div className="place-item__info">
						<h2> {props.title} </h2>
						<h3> {props.address} </h3>
						<p> {props.description} </p>
					</div>

					<div className="place-item__actions">
						<Button inverse onClick={openMapHandler}>
							VIEW ON MAP
						</Button>
						{login.userId === props.creatorId && (
							<Button to={`/places/${props.id}`}>EDIT</Button>
						)}
						{login.userId === props.creatorId && (
							<Button danger onClick={showDeleteWarningHandler}>
								DELETE
							</Button>
						)}

						{login.isLoggedIn && login.userId != props.creatorId && (
							<div className="place-rating center">
								<ReactStars
									count={5}
									onChange={ratingChangedHandler}
									size={40}
									color2={"#98B78F"}
									value={avgRating}
								/>
								<h3>{`${avgRating}`}</h3>
							</div>
						)}
						{(!login.isLoggedIn || login.userId === props.creatorId) && (
							<div className="place-rating center">
								<ReactStars
									count={5}
									size={40}
									edit={false}
									color2={"#98B78F"}
									value={avgRating}
								/>
								<h3>{`${avgRating}`}</h3>
							</div>
						)}
					</div>
				</Card>
			</li>
		</React.Fragment>
	);
};

export default PlaceItem;
