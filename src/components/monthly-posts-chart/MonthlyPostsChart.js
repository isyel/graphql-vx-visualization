import React, { useRef } from "react";
import { withParentSize } from "@vx/responsive";
import { scaleTime, scaleLinear } from "@vx/scale";
import { extent } from "d3-array";
import { AreaClosed, Bar, Line, LinePath } from "@vx/shape";
import { LinearGradient } from "@vx/gradient";
import { AxisBottom } from "@vx/axis";
import { Tooltip, withTooltip } from "@vx/tooltip";
import { bisector } from "d3-array";
import { localPoint } from "@vx/event";
import MaxPrice from "./MaxPrice";
import MinPrice from "./MinPrice";
import formatMonthToText from "../../util/formatMonthToText";

function MonthlyPostsChart({
	parentWidth,
	parentHeight,
	monthlyPosts,
	tooltipLeft,
	tooltipTop,
	tooltipData,
	showTooltip,
	hideTooltip,
}) {
	const svgRef = useRef(null);
	const margin = {
		top: 20,
		bottom: 70,
		left: 0,
		right: 0,
	};
	const width = parentWidth - margin.left - margin.right;
	const height = parentHeight - margin.top - margin.bottom;
	const posts = monthlyPosts
		.map((post) => ({
			date: post.date,
			posts: post.posts.length,
		}))
		.sort((post1, post2) => new Date(post1.date) - new Date(post2.date));

	//Calculations for Chart
	const getMonth = (post) => new Date(post.date);
	const getPost = (post) => post.posts;

	const bisectDate = bisector((d) => getMonth(d)).left;
	const xScale = scaleTime({
		range: [0, width],
		domain: extent(posts, getMonth),
	});
	const minPost = Math.min(...posts.map(getPost));
	const maxPost = Math.max(...posts.map(getPost));
	const maxPostData = [
		{
			date: getMonth(posts[0]),
			posts: maxPost,
		},
		{
			date: getMonth(posts[posts.length - 1]),
			posts: maxPost,
		},
	];
	const minPostData = [
		{
			date: getMonth(posts[0]),
			posts: minPost,
		},
		{
			date: getMonth(posts[posts.length - 1]),
			posts: minPost,
		},
	];

	const yScale = scaleLinear({
		range: [height, 0],
		domain: [minPost, maxPost],
		nice: true,
	});

	const handleTooltip = (event) => {
		const { x } = localPoint(svgRef.current, event) || { x: 0 };
		const x0 = xScale.invert(x);
		const index = bisectDate(posts, x0, 1);
		const d0 = posts[index - 1];
		const d1 = posts[index];
		let d = d0;
		if (d1 && getMonth(d1)) {
			d =
				x0.valueOf() - getMonth(d0).valueOf() >
				getMonth(d1).valueOf() - x0.valueOf()
					? d1
					: d0;
		}
		showTooltip({
			tooltipData: d,
			tooltipLeft: xScale(getMonth(d)),
			tooltipTop: yScale(getPost(d)),
		});
	};

	return (
		<div>
			<svg width={width} height={parentHeight} ref={svgRef}>
				<LinePath
					x={(post) => xScale(getMonth(post))}
					y={(post) => yScale(getPost(post))}
					data={posts}
					stroke="#ffffff"
					strokeWidth={2}
					strokeOpacity={0.6}
					// curve={curveMonotoneX}
				/>
				<AreaClosed
					x={(d) => xScale(getMonth(d))}
					y={(d) => yScale(getPost(d))}
					data={posts}
					yScale={yScale}
					fill="url(#area-fill)"
					// curve={curveMonotoneX}
					stroke="transparent"
				/>
				<LinearGradient
					id="area-fill"
					from="#777782"
					to="#000000"
					fromOpacity={1}
					toOpacity={0.3}
				/>
				<MaxPrice
					posts={maxPostData}
					yScale={yScale}
					xScale={xScale}
					getPost={getPost}
					getMonth={getMonth}
					label={maxPost}
					yText={yScale(maxPost)}
				/>
				<MinPrice
					posts={minPostData}
					yScale={yScale}
					xScale={xScale}
					getPost={getPost}
					getMonth={getMonth}
					label={minPost}
					yText={yScale(minPost)}
				/>
				<AxisBottom
					data={posts}
					scale={xScale}
					x={getMonth}
					numTicks={6}
					top={yScale(minPost) + 20}
					hideAxisLine
					tickLabelProps={() => ({
						fill: "white",
						fontSize: "9px",
					})}
				/>
				<Bar
					data={posts}
					width={width}
					height={height}
					fill="transparent"
					onMouseMove={handleTooltip}
					onTouchMove={handleTooltip}
					onTouchStart={handleTooltip}
					onMouseLeave={() => hideTooltip()}
				/>
				{tooltipData && (
					<g>
						<Line
							from={{ x: tooltipLeft, y: 0 }}
							to={{ x: tooltipLeft, y: height + 30 }}
							stroke="#ffffff"
							strokeWidth={1}
							pointerEvents="none"
							strokeDasharray="5,2"
						/>
						<circle
							r="8"
							cx={tooltipLeft}
							cy={tooltipTop}
							fill="white"
							opacity={0.4}
							style={{ pointerEvents: "none" }}
						/>
						<circle
							r="4"
							cx={tooltipLeft}
							cy={tooltipTop}
							fill="white"
							style={{ pointerEvents: "none" }}
						/>
					</g>
				)}
			</svg>
			{tooltipData && (
				<div>
					<Tooltip
						top={tooltipTop - 35}
						left={tooltipLeft}
						className="bg-gray-500 text-white border-black border">
						{`${getPost(tooltipData)} posts`}
					</Tooltip>
					<Tooltip left={tooltipLeft - 35} top={yScale(minPost) + 20}>
						{`${formatMonthToText(getMonth(tooltipData))}`}
					</Tooltip>
				</div>
			)}
		</div>
	);
}

export default withTooltip(withParentSize(MonthlyPostsChart));
