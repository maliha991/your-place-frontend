import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import UserInfo from "../components/UserInfo";
import PlaceList from "../../places/components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { LoginContext } from "../../shared/context/login-context";

const UserProfile = () => {
	// const USERS = [
	// 	{
	// 		id: "u1",
	// 		name: "Mithila",
	// 		email: "mithila@gmail.com",
	// 		image:
	// 			"https://images.pexels.com/photos/4427792/pexels-photo-4427792.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
	// 		places: 2,
	// 		rating: 3.5,
	// 	},

	// 	{
	// 		id: "u2",
	// 		name: "Maliha",
	// 		email: "maliha@gmail.com",
	// 		image:
	// 			"https://images.pexels.com/photos/4427792/pexels-photo-4427792.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
	// 		places: 3,
	// 		rating: 4.5,
	// 	},
	// ];

	// const DUMMY_PLACES = [
	// 	{
	// 		id: "p1",
	// 		title: "Empire State Building",
	// 		description: "One of the most famous sky scrapers in the world!",
	// 		imageUrl:
	// 			"https://www.findingtheuniverse.com/wp-content/uploads/2020/07/Empire-State-Building-view-from-uptown_by_Laurence-Norah-2.jpg",
	// 		address: "20 W 34th St, New York, NY 10001, United States",
	// 		location: {
	// 			lat: 40.7484405,
	// 			lng: -73.9878531,
	// 		},
	// 		creator: "u1",
	// 	},

	// 	{
	// 		id: "p2",
	// 		title: "Emp. State Building",
	// 		description: "One of the most famous sky scrapers in the world!",
	// 		imageUrl:
	// 			"https://www.findingtheuniverse.com/wp-content/uploads/2020/07/Empire-State-Building-view-from-uptown_by_Laurence-Norah-2.jpg",
	// 		address: "20 W 34th St, New York, NY 10001, United States",
	// 		location: {
	// 			lat: 40.7484405,
	// 			lng: -73.9878531,
	// 		},
	// 		creator: "u2",
	// 	},
	// ];

	const [loadedPlaces, setLoadedPlaces] = useState();
	const [loadedProfiles, setLoadedProfiles] = useState();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const userId = useParams().userId;
	const history = useHistory();
	const { logout } = useContext(LoginContext);

	useEffect(() => {
		const fetchProfiles = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/users/${userId}`
				);
				setLoadedPlaces(responseData.places);
				setLoadedProfiles(responseData.user);
			} catch (error) {}
		};
		fetchProfiles();
	}, [sendRequest, userId]);

	const placeDeleteHandler = (deletedPlaceId) => {
		setLoadedPlaces((prevPlaces) =>
			prevPlaces.filter((place) => place.id !== deletedPlaceId)
		);
	};

	const profileDeleteHandler = () => {
		setLoadedPlaces((prevPlaces) =>
			prevPlaces.filter((place) => place.creator !== userId)
		);
		setLoadedProfiles((prevProfile) => (prevProfile = null));
		history.push("/");
		logout();
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && loadedProfiles && (
				<UserInfo
					items={loadedProfiles}
					onDeleteProfile={profileDeleteHandler}
				/>
			)}
			{!isLoading && loadedPlaces && (
				<PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />
			)}
		</React.Fragment>
	);
};

export default UserProfile;
