import React, { useEffect, useRef } from "react";
import { gql, useQuery } from "@apollo/client";
import formatMonth from "../util/formatMonth";
import AuthorsList from "./AuthorsList";
import { useDataLayerValue } from "../react-context-api/DataLayer";
import * as types from "../react-context-api/actionTypes";
import TopTopicsChart from "./top-topics-chart/TopTopicsChart";
import MonthlyPostsChart from "./monthly-posts-chart/MonthlyPostsChart";
import TotalTopicsPieChart from "./all-topics-chart/TotalTopicsPieChart";
import BarChart from "./top-topics-chart/BarChart";
import LoadingComponent from "./LoadingComponent";
import ErrorComponent from "./ErrorComponent";
import groupTopics from "../util/groupTopics";
import VisualCard from "./VisualCard";

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
	const [{ postsOfTheMonth, authors }, dispatch] = useDataLayerValue();

	const { error, data } = useQuery(POSTS_QUERY, {
		variables: { count: 500 },
	});

	const topicsAggregation = useRef(null);
	const authorsAggregation = useRef(null);

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

			dispatch({
				type: types.SET_POSTS_PER_MONTH,
				postsOfTheMonth: topPostOfTheMonth,
			});

			topicsAggregation.current = groupTopics(data.allPosts);
			if (authors)
				authorsAggregation.current = authors
					.map((authorArray) => ({
						label: authorArray.author.firstName,
						frequency: authorArray.posts.length,
					}))
					.sort((author1, author2) => author2.frequency - author1.frequency)
					.slice(0, 6);
		}
	}, [dispatch, data, authors]);

	return (
		<div className="container mx-auto my-10">
			<div className="my-5">
				<div className="grid grid-cols-2">
					<VisualCard>
						{postsOfTheMonth.length > 0 ? (
							<TopTopicsChart monthlyPosts={postsOfTheMonth} />
						) : error ? (
							<ErrorComponent />
						) : (
							<LoadingComponent />
						)}
					</VisualCard>

					<VisualCard>
						{postsOfTheMonth.length > 0 ? (
							<>
								<h1 className="text-white px-2 py-1">
									Posts Published In the Last 12 Months
								</h1>
								<MonthlyPostsChart monthlyPosts={postsOfTheMonth} />
							</>
						) : error ? (
							<ErrorComponent />
						) : (
							<LoadingComponent />
						)}
					</VisualCard>
				</div>
				<div className="grid grid-cols-2">
					<VisualCard>
						{topicsAggregation.current ? (
							<TotalTopicsPieChart topicsObject={topicsAggregation.current} />
						) : error ? (
							<ErrorComponent />
						) : (
							<LoadingComponent />
						)}
					</VisualCard>

					<VisualCard>
						{authorsAggregation.current ? (
							<>
								<h1 className="text-white px-2 py-1">
									Top 6 Authors With The Most Publications
								</h1>
								<BarChart
									topics={authorsAggregation.current}
									dataType={"Authors"}
									showLegend={false}
								/>
							</>
						) : error ? (
							<ErrorComponent />
						) : (
							<LoadingComponent />
						)}
					</VisualCard>
				</div>
			</div>
			<div id="authors">{data && <AuthorsList posts={data.allPosts} />}</div>
		</div>
	);
}

export default Dashboard;
