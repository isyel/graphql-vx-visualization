import React from "react";
import { useDataLayerValue } from "../react-context-api/DataLayer";

function AuthorProfile({ match }) {
	const authorId = match.params.id;
	const [{ authorMonthlyPosts }] = useDataLayerValue();

	const authorProfile = authorMonthlyPosts.find(
		(author) => author.id === authorId
	);
	console.log("authorProfile: ", authorProfile);

	return (
		<div>
			<p>Author Id is {authorId}</p>
		</div>
	);
}

export default AuthorProfile;
