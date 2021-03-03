import React, { useEffect, useRef } from "react";
import { gql, useQuery } from "@apollo/client";
import formatMonth from "../util/formatMonth";
import AuthorsList from "./AuthorsList";
import { useDataLayerValue } from "../react-context-api/DataLayer";
import * as types from "../react-context-api/actionTypes";
import TopTopicsChart from "./TopTopicsChart";
import MonthlyPostsChart from "./MonthlyPostsChart";
import TotalTopicsPieChart from "./TotalTopicsPieChart";
import BarChart from "./BarChart";

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

function Dashboard() {
	const [{ topPostsOfTheMonth, authors }, dispatch] = useDataLayerValue();

	const { loading, error, data } = useQuery(POSTS_QUERY, {
		variables: { count: 200 },
	});

	const topicsAggregation = useRef(null);
	const authorsAggregation = useRef(null);

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

			topicsAggregation.current = groupTopics(data.allPosts);
			if (authors)
				authorsAggregation.current = authors
					.map((author) => ({
						label: author.author.firstName,
						frequency: author.posts.length,
					}))
					.sort((author1, author2) => author2.frequency - author1.frequency)
					.slice(0, 6);
			console.log("Authors: ", authorsAggregation.current);
		}
	}, [dispatch, data, authors]);

	return (
		<div className="container mx-auto my-10">
			<div className="my-5">
				{loading && <p>Loading...</p>}
				{error && <p>Error :(</p>}
				<div className="grid grid-cols-2">
					<div className="md:col-span-1 col-span-2 h-96 bg-gradient-to-br rounded-md from-gray-800 bg-black m-2">
						{topPostsOfTheMonth.length > 0 && (
							<TopTopicsChart monthlyPosts={topPostsOfTheMonth} />
						)}
					</div>
					<div className="md:col-span-1 col-span-2 h-96 bg-gradient-to-br rounded-md from-gray-800 bg-black m-2">
						<h1 className="text-white px-2 py-1">
							Posts Published In the Last 12 Months
						</h1>
						{topPostsOfTheMonth.length > 0 && (
							<MonthlyPostsChart monthlyPosts={topPostsOfTheMonth} />
						)}
					</div>
				</div>
				<div className="grid grid-cols-2">
					<div className="md:col-span-1 col-span-2 h-96 bg-gradient-to-br rounded-md from-gray-800 bg-black m-2">
						{topicsAggregation.current && (
							<TotalTopicsPieChart topicsObject={topicsAggregation.current} />
						)}
					</div>
					<div className="md:col-span-1 col-span-2 h-96 bg-gradient-to-br rounded-md from-gray-800 bg-black m-2">
						<h1 className="text-white px-2 py-1">
							Authors With The Most Publications
						</h1>
						{authorsAggregation.current && (
							<BarChart
								topics={authorsAggregation.current}
								dataType={"Authors"}
							/>
						)}
					</div>
				</div>
			</div>
			<div id="authors">{data && <AuthorsList posts={data.allPosts} />}</div>
		</div>
	);
}

export default Dashboard;
