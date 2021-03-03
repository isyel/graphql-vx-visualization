import React from "react";
import { animated, useTransition, interpolate } from "react-spring";

const fromLeaveTransition = ({ endAngle }) => ({
	// enter from 360° if end angle is > 180°
	startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
	endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
	opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }) => ({
	startAngle,
	endAngle,
	opacity: 1,
});

export default function AnimatedPie({
	animate,
	arcs,
	path,
	getKey,
	getColor,
	onClickDatum,
}) {
	const transitions = useTransition(arcs, getKey, {
		from: animate ? fromLeaveTransition : enterUpdateTransition,
		enter: enterUpdateTransition,
		update: enterUpdateTransition,
		leave: animate ? fromLeaveTransition : enterUpdateTransition,
	});

	return (
		<>
			{transitions.map(({ item: arc, props, key }) => {
				const [centroidX, centroidY] = path.centroid(arc);
				const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.15;

				return (
					<g key={key}>
						<animated.path
							// compute interpolated path d attribute from intermediate angle values
							d={interpolate(
								[props.startAngle, props.endAngle],
								(startAngle, endAngle) =>
									path({
										...arc,
										startAngle,
										endAngle,
									})
							)}
							fill={getColor(arc)}
							onClick={() => onClickDatum(arc)}
							onTouchStart={() => onClickDatum(arc)}
						/>
						{hasSpaceForLabel && (
							<animated.g style={{ opacity: props.opacity }}>
								<text
									fill="white"
									x={centroidX}
									y={centroidY}
									dy=".33em"
									fontSize={10}
									textAnchor="middle"
									pointerEvents="none">
									{getKey(arc)}
								</text>
							</animated.g>
						)}
					</g>
				);
			})}
		</>
	);
}
