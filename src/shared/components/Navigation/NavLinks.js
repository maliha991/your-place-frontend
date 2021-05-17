import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { LoginContext } from "../../context/login-context";
import "./NavLinks.css";

const NavLinks = (props) => {
	const login = useContext(LoginContext);

	return (
		<ul className="nav-links">
			<li>
				<NavLink to="/" exact>
					Users
				</NavLink>
			</li>

			{login.isLoggedIn && (
				<li>
					<NavLink to={`/${login.userId}/profile`}>My Profile</NavLink>
				</li>
			)}

			{login.isLoggedIn && (
				<li>
					<NavLink to="/places/new">Add Place</NavLink>
				</li>
			)}

			{!login.isLoggedIn && (
				<li>
					<NavLink to="/login">Login</NavLink>
				</li>
			)}

			{login.isLoggedIn && (
				<li>
					<button className="logout-btn" onClick={login.logout}>
						Logout
					</button>
				</li>
			)}
		</ul>
	);
};

export default NavLinks;
