import React, { useEffect } from "react";
import { useDataLayerValue } from "../react-context-api/DataLayer";
import * as types from "../react-context-api/actionTypes";
import formatMonth from "../util/formatMonth";
import Author from "./Author";

function AuthorsList({ posts }) {
	const [{ authors }, dispatch] = useDataLayerValue();

	useEffect(() => {
		const authorsData = posts
			.map((post) => {
				return {
					id: post.author.id,
					author: post.author,
					posts: posts.filter(
						(eachPost) => post.author.id === eachPost.author.id
					),
				};
			})
			.filter(
				(authorPosts, index, self) =>
					index ===
					self.findIndex((singleObject) => singleObject.id === authorPosts.id)
			);
		dispatch({ type: types.SET_AUTHORS, authors: authorsData });

		const authorMonthlyPosts = authorsData.map((authorData) => {
			return {
				id: authorData.id,
				author: authorData.author,
				monthlyPosts: authorData.posts
					.map(
						(eachPost) => {
							const tempPosts = authorData.posts.filter(
								(singlePost) =>
									formatMonth(singlePost.createdAt) ===
									formatMonth(eachPost.createdAt)
							);
							return {
								date: formatMonth(eachPost.createdAt),
								posts: tempPosts,
								topics: groupTopics(tempPosts),
							};
						}
						// formatMonth(eachPost.createdAt) === formatMonth(post.createdAt)
					)
					.filter(
						(monthPosts, index, self) =>
							index ===
							self.findIndex(
								(singleObject) => singleObject.date === monthPosts.date
							)
					),
			};
		});

		dispatch({ type: types.SET_AUTHORS_MONTHLY_POSTS, authorMonthlyPosts });
	}, [dispatch, posts]);

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

	return (
		<div>
			<h1 className="text-3xl font-bold pl-2">Posts Authors</h1>
			{authors.map((authorObject, key) => (
				<Author
					key={key}
					author={authorObject.author}
					posts={authorObject.posts}
				/>
			))}
		</div>
	);
}

export default AuthorsList;
