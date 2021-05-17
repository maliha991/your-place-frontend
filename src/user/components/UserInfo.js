import React from "react";

import "./UserInfo.css";
import UserInfoItem from "./UserInfoItem";

const UserInfo = (props) => {
	return (
		<ul className="user-info">
			<UserInfoItem
				key={props.items.id}
				id={props.items.id}
				name={props.items.name}
				image={props.items.image}
				email={props.items.email}
				placeCount={props.items.places.length}
				rating={props.items.rating}
				onDelete={props.onDeleteProfile}
			/>
		</ul>
	);
};

export default UserInfo;
