import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
//import cityTemperature from "@vx/mock-data/lib/mocks/cityTemperature";
import formatMonth from "../util/formatMonth";
import AuthorsList from "./AuthorsList";
import { useDataLayerValue } from "../react-context-api/DataLayer";
import * as types from "../react-context-api/actionTypes";
import TopPostsChart from "./TopPostsChart";
import MonthlyPostsChart from "./MonthlyPostsChart";

const POSTS_QUERY = gql`
	query PostsQuery($count: Int!) {
		allPosts(count: $count) {
			id
			title
			body
			published
			createdAt
			author {
				id
				firstName
				lastName
				avatar
			}
			likelyTopics {
				label
				likelihood
			}
		}
	}
`;

//const cityTemperatureData = cityTemperature.slice(0, 12);

function Dashboard() {
	const [{ topPostsOfTheMonth }, dispatch] = useDataLayerValue();

	const { loading, error, data } = useQuery(POSTS_QUERY, {
		variables: { count: 200 },
	});

	function groupTopics(tempPosts) {
		let counts = {};
		tempPosts?.forEach((post) => {
			if (Array.isArray(post.likelyTopics))
				counts[post.likelyTopics[0].label] =
					1 + (counts[post.likelyTopics[0].label] || 0);
			else
				return (counts[post.likelyTopics] =
					1 + (counts[post.likelyTopics] || 0));
		});
		return counts;
	}

	useEffect(() => {
		if (data) {
			const topPostOfTheMonth = data.allPosts
				.map((post) => {
					const tempPosts = data.allPosts.filter(
						(eachPost) =>
							formatMonth(eachPost.createdAt) === formatMonth(post.createdAt)
					);
					return {
						date: formatMonth(post.createdAt),
						posts: tempPosts,
						topics: groupTopics(tempPosts),
					};
				})
				.filter(
					(monthPosts, index, self) =>
						index ===
						self.findIndex(
							(singleObject) => singleObject.date === monthPosts.date
						)
				);

			dispatch({ type: types.SET_TOP_POSTS, topPosts: topPostOfTheMonth });
		}
	}, [dispatch, data]);

	return (
		<div className="container mx-auto my-10">
			<div className="my-5">
				{loading && <p>Loading...</p>}
				{error && <p>Error :(</p>}
				<div className="grid grid-cols-2">
					<div className="md:col-span-1 col-span-2 h-96 bg-gradient-to-br rounded-md from-gray-800 bg-black m-2">
						<h1 className="text-white px-2 py-1">Top Posts of the Month</h1>
						<p>Chart Goes here</p>
						<TopPostsChart monthlyPosts={topPostsOfTheMonth} />
					</div>
					<div className="md:col-span-1 col-span-2 h-96 bg-gradient-to-br rounded-md from-gray-800 bg-black m-2">
						<h1 className="text-white px-2 py-1">
							Posts Published In the Last 12 Months
						</h1>
						<MonthlyPostsChart monthlyPosts={topPostsOfTheMonth} />
					</div>
				</div>
			</div>

			{data && <AuthorsList posts={data.allPosts} />}
		</div>
	);
}

export default Dashboard;
