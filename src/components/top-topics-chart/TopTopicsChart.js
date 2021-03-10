import React, { useState } from "react";
import BarChart from "./BarChart";
import formatMonthToText from "../../util/formatMonthToText";

function TopTopicsChart({ monthlyPosts }) {
	const [monthIndex, setMonthIndex] = useState(0);

	const sortedMonthlyPosts = monthlyPosts.sort(
		(post1, post2) => new Date(post2.date) - new Date(post1.date)
	);
	const topicsObject = sortedMonthlyPosts[monthIndex].topics;
	const topics = Object.keys(topicsObject)
		.map((key) => ({
			label: key,
			frequency: topicsObject[key],
		}))
		.sort((topic1, topic2) => topic2.frequency - topic1.frequency)
		.slice(0, 5);

	return (
		<>
			<h1 className="text-white px-2 py-1">
				Top Likely Topics for the Month of{" "}
				{formatMonthToText(new Date(monthlyPosts[monthIndex].date))}
			</h1>
			<div className="flex flex-col h-5/6">
				<div className="flex-1">
					<BarChart topics={topics} dataType={"Topics"} />
				</div>
				<div className="flex justify-between px-4 h-12">
					<button
						className="button disabled:opacity-25 disabled:cursor-not-allowed"
						onClick={() => setMonthIndex(monthIndex + 1)}
						disabled={monthIndex >= monthlyPosts.length - 1}>
						Previous Month
					</button>
					<button
						className="button disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={() => setMonthIndex(monthIndex - 1)}
						disabled={monthIndex <= 0}>
						Next Month
					</button>
				</div>
			</div>
		</>
	);
}

export default TopTopicsChart;
