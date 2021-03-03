import React from "react";
import { useDataLayerValue } from "../react-context-api/DataLayer";
import TopTopicsChart from "./top-topics-chart/TopTopicsChart";
import MonthlyPostsChart from "./monthly-posts-chart/MonthlyPostsChart";
import TotalTopicsPieChart from "./all-topics-chart/TotalTopicsPieChart";
import groupTopics from "../util/groupTopics";

function AuthorProfile({ match }) {
	const authorId = match.params.id;
	const [{ authorMonthlyPosts, authors }] = useDataLayerValue();

	const authorProfile = authorMonthlyPosts.find(
		(author) => author.id === authorId
	);
	const authorPosts = authors.find((author) => author.id === authorId);

	const noOfPosts = authorProfile.monthlyPosts.reduce(
		(sum, post) => sum + post.posts.length,
		0
	);

	const topicsObject = groupTopics(authorPosts.posts);

	return (
		<div className="container mx-auto my-10">
			<div className="flex flex-row justify-between items-center pb-16 px-4 md:px-10">
				<div className="flex flex-col sm:flex-row items-start justify-items-start w-2/3">
					<img
						className="rounded-md w-16 md:mr-8"
						src="/avatar.jpg"
						alt={authorProfile.author.firstName}
					/>
					<div className="flex flex-col">
						<h1 className="text-lg text-gray-800 font-semibold">
							{authorProfile.author.firstName} {authorProfile.author.lastName}
						</h1>
						<p>
							Last Publication:{" "}
							<span>{authorProfile.monthlyPosts[0].posts[0].title}</span>
						</p>
					</div>
				</div>
				<div className="flex flex-col sm:flex-row items-center">
					<span className="text-3xl font-bold text-gray-800 pr-1">
						{noOfPosts}
					</span>
					<span className="text-base font-light text-gray-600">Posts</span>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2">
				<div className="col-span-1 dark-card">
					{authorProfile.monthlyPosts && (
						<TopTopicsChart monthlyPosts={authorProfile.monthlyPosts} />
					)}
				</div>
				<div className="col-span-1 dark-card">
					<h1 className="text-white px-2 py-1">
						{`${authorProfile.author.firstName}'s`} posting frequency
					</h1>
					{authorProfile.monthlyPosts && (
						<MonthlyPostsChart monthlyPosts={authorProfile.monthlyPosts} />
					)}
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2">
				<div className="col-span-2 dark-card">
					{topicsObject && <TotalTopicsPieChart topicsObject={topicsObject} />}
				</div>
			</div>
		</div>
	);
}

export default AuthorProfile;
