import React, { useState } from "react";
import { Link } from "react-router-dom";

import MainHeader from "./MainHeader";
import Backdrop from "../UIElements/Backdrop";
import SideDrawer from "./SideDrawer";
import NavLink from "./NavLinks";
import "./MainNavigation.css";

const MainNavigation = () => {
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);

	const closeDrawerHandler = () => {
		setDrawerIsOpen(false);
	};

	const openDrawerHandler = () => {
		setDrawerIsOpen(true);
	};

	return (
		<React.Fragment>
			{drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
			<SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
				<nav className="main-navigation__drawer-nav">
					<NavLink />
				</nav>
			</SideDrawer>

			<MainHeader>
				<button
					className="main-navigation__menu-btn"
					onClick={openDrawerHandler}
				>
					<span />
					<span />
					<span />
				</button>

				<h1 className="main-navigation__title">
					<Link to="/">YourPlaces</Link>
				</h1>

				<nav className="main-navigation__header-nav">
					<NavLink />
				</nav>
			</MainHeader>
		</React.Fragment>
	);
};

export default MainNavigation;
