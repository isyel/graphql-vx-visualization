import React from "react";
import { Group } from "@vx/group";
import { LinearGradient } from "@vx/gradient";
import { scaleBand, scaleLinear } from "@vx/scale";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { Bar } from "@vx/shape";
import { withParentSize } from "@vx/responsive";

// accessors
const getTopics = (d) => d.label;
const getFrequency = (d) => d.frequency;
export const labelColor = "#ffffff";

function BarChart({ topics, parentWidth, dataType, showLegend = true }) {
	const width = parentWidth;
	const height = 302;

	// bounds
	const xMax = width - 80;
	const yMax = height - 80;

	// scales
	const xScale = scaleBand({
		range: [0, xMax],
		domain: topics.map(getTopics),
		padding: 0.4,
	});

	const yScale = scaleLinear({
		range: [0, yMax],
		domain: [Math.max(...topics.map(getFrequency)), 0],
		nice: true,
	});

	return (
		<div style={{ width: "100%", height: "100%" }} className="relative">
			{showLegend && (
				<div className="absolute left-1/2 ml-6 lg:left-2/3 lg:ml-8 xl:ml-44 xl:left-2/4 bg-opacity-30 bg-black p-1 rounded-lg">
					<h4 className="text-white text-sm">
						Top {topics.length >= 3 ? "3" : ""} {dataType}
					</h4>
					<div className="flex flex-col text-white font-light text-xs">
						{topics &&
							// eslint-disable-next-line array-callback-return
							topics.map((label, index) => {
								if (index < 3)
									return (
										<span
											key={
												index
											}>{`${label.label} - ${label.frequency} posts`}</span>
									);
							})}
					</div>
				</div>
			)}
			<svg width={width} height={height}>
				<LinearGradient from={`#ffffff`} to={`#000000`} id={`gradient`} />
				<rect width={width} height={height} fill="transparent" rx={5} />
				<Group top={25} left={55}>
					<AxisLeft
						left={10}
						scale={yScale}
						data={topics}
						y={getFrequency}
						numTicks={4}
						tickStroke="white"
						stroke="white"
						tickLabelProps={() => ({
							fill: "white",
							fontSize: "9px",
							textAnchor: "end",
							dy: "0.33em",
							dx: "-0.3em",
						})}
					/>
					<text
						x="-25%"
						y="-8%"
						transform="rotate(-90)"
						fontSize={11}
						stroke="white">
						No of Posts
					</text>
					{topics.map((d, i) => {
						const label = getTopics(d);
						const barWidth = xScale.bandwidth();
						const barHeight = yMax - yScale(getFrequency(d));
						const barX = xScale(label);
						const barY = yMax - barHeight;

						return (
							<Bar
								style={{ transition: "height 150ms, y 150ms" }}
								key={`bar-${label}`}
								x={barX}
								y={barY}
								width={barWidth}
								height={barHeight}
								fill="white"
								bottom={0}
							/>
						);
					})}
					<AxisBottom
						scale={xScale}
						label="Topics"
						labelOffset={15}
						top={yMax}
						tickStroke="white"
						stroke="white"
						tickLabelProps={() => ({
							fill: "white",
							fontSize: "9px",
							textAnchor: "middle",
						})}
					/>

					<text x="40%" y="87%" fontSize={11} stroke="white">
						Topics
					</text>
				</Group>
			</svg>
		</div>
	);
}

export default withParentSize(BarChart);
