import React, { useContext } from "react";
import { useParams } from "react-router-dom";

import "./PlaceList.css";
import PlaceItem from "./PlaceItem";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import { LoginContext } from "../../shared/context/login-context";

const PlaceList = (props) => {
	const login = useContext(LoginContext);
	const userId = useParams().userId;

	if (props.items.length === 0) {
		if (login.userId === userId) {
			return (
				<div className="place-list center">
					<Card className="place-list__content">
						<h2>No places found. Maybe create one?</h2>
						<Button to="/places/new">Share Place</Button>
					</Card>
				</div>
			);
		} else {
			return (
				<div className="place-list center">
					<Card className="place-list__content">
						<h2>No places was shared by this user.</h2>
					</Card>
				</div>
			);
		}
	}

	return (
		<ul className="place-list">
			{props.items.map((place) => (
				<PlaceItem
					key={place.id}
					id={place.id}
					image={place.image}
					title={place.title}
					description={place.description}
					address={place.address}
					creatorId={place.creator}
					coordinates={place.location}
					onDelete={props.onDeletePlace}
				/>
			))}
		</ul>
	);
};

export default PlaceList;
