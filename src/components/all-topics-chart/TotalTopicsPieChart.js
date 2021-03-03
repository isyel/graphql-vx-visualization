import { scaleOrdinal } from "@vx/scale";
import React, { useState } from "react";
import { withParentSize } from "@vx/responsive";
import { Group } from "@vx/group";
import AnimatedPie from "./AnimatedPie";
import { Pie } from "@vx/shape";

const frequency = (topic) => topic.frequency;
const defaultMargin = { top: 10, right: 20, bottom: 50, left: 20 };

function TotalTopicsPieChart({
	topicsObject,
	parentWidth,
	parentHeight,
	margin = defaultMargin,
	animate = true,
}) {
	const [selectedTopic, setSelectedTopic] = useState(null);

	const topics = Object.keys(topicsObject)
		.map((key) => ({
			topic: `${key}(${topicsObject[key]})`,
			frequency: topicsObject[key],
		}))
		.sort((topic1, topic2) => topic2.frequency - topic1.frequency);
	const topicNames = topics.map((topic) => topic.topic);

	const getTopicColor = scaleOrdinal({
		domain: topicNames,
		range: [
			"rgba(255,255,255,0.55)",
			"rgba(255,255,255,0.5)",
			"rgba(255,255,255,0.45)",
			"rgba(255,255,255,0.4)",
			"rgba(255,255,255,0.35)",
			"rgba(255,255,255,0.3)",
			"rgba(255,255,255,0.25)",
			"rgba(255,255,255,0.2)",
			"rgba(255,255,255,0.15)",
			"rgba(255,255,255,0.1)",
		],
	});

	if (parentWidth < 10) return null;

	const innerWidth = parentWidth - margin.left - margin.right;
	const innerHeight = parentHeight - margin.top - margin.bottom;
	const radius = Math.min(innerWidth, innerHeight) / 2;
	const centerY = innerHeight / 2;
	const centerX = innerWidth / 2;
	const donutThickness = 50;

	return (
		<div>
			<h1 className="text-white px-2 py-1">Posts Per Most Likely Topic</h1>
			<svg width={parentWidth} height={parentHeight}>
				<rect
					rx={14}
					width={parentWidth}
					height={parentHeight}
					fill="transparent"
				/>
				<Group top={centerY + margin.top} left={centerX + margin.left}>
					<Pie
						data={
							selectedTopic
								? topics.filter(({ topic }) => topic === selectedTopic)
								: topics
						}
						pieValue={frequency}
						outerRadius={radius}
						innerRadius={radius - donutThickness}
						cornerRadius={3}
						padAngle={0.005}>
						{(pie) => (
							<AnimatedPie
								{...pie}
								animate={animate}
								getKey={(arc) => arc.data.topic}
								className="cursor-pointer"
								onClickDatum={({ data: { topic } }) =>
									animate &&
									setSelectedTopic(
										selectedTopic && selectedTopic === topic ? null : topic
									)
								}
								getColor={(arc) => getTopicColor(arc.data.topic)}
							/>
						)}
					</Pie>
				</Group>
				{animate && (
					<text
						textAnchor="end"
						x={parentWidth - 16}
						y={parentHeight - 45}
						fill="white"
						fontSize={11}
						fontWeight={300}
						pointerEvents="none">
						Click segments to view in full
					</text>
				)}
			</svg>
		</div>
	);
}

export default withParentSize(TotalTopicsPieChart);
