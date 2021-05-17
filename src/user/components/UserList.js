import React from "react";

import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";
import "./UserList.css";

const UserList = (props) => {
	if (props.items.length === 0) {
		return (
			<div className="center">
				<Card>
					<h2>No User Found.</h2>
				</Card>
			</div>
		);
	}

	return (
		<ul className="user-list">
			{props.items.map((user) => (
				<UserItem
					key={user.id}
					id={user.id}
					name={user.name}
					image={user.image}
					placeCount={user.places.length}
					rating={user.rating}
				/>
			))}
		</ul>
	);
};

export default UserList;
