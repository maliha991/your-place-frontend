import React, { useState, useCallback } from "react";
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch,
} from "react-router-dom";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UpdatePlace from "./places/pages/UpdatePlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserProfile from "./user/pages/UserProfile";
import Login from "./user/pages/Login";
import UpdateProfile from "./user/pages/UpdateProfile";
import { LoginContext } from "./shared/context/login-context";

const App = () => {
	const [token, setToken] = useState(false);
	const [userId, setUserId] = useState(false);

	const login = useCallback((uid, token) => {
		setToken(token);
		setUserId(uid);
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setUserId(null);
	}, []);

	let routes;

	if (token) {
		routes = (
			<Switch>
				<Route path="/" exact>
					<Users />
				</Route>

				<Route path="/:userId/profile" exact>
					<UserProfile />
				</Route>
				<Route path="/users/:userId">
					<UpdateProfile />
				</Route>
				<Route path="/places/new" exact>
					<NewPlace />
				</Route>

				<Route path="/places/:placeId">
					<UpdatePlace />
				</Route>

				<Redirect to="/" />
			</Switch>
		);
	} else {
		routes = (
			<Switch>
				<Route path="/" exact>
					<Users />
				</Route>

				<Route path="/:userId/profile" exact>
					<UserProfile />
				</Route>

				<Route path="/login">
					<Login />
				</Route>

				<Redirect to="/login" />
			</Switch>
		);
	}

	return (
		<LoginContext.Provider
			value={{
				isLoggedIn: !!token,
				token: token,
				login: login,
				logout: logout,
				userId: userId,
			}}
		>
			<Router>
				<MainNavigation />
				<main>{routes}</main>
			</Router>
		</LoginContext.Provider>
	);
};

export default App;
