import { LinePath } from "@vx/shape";

function MinPrice({
	posts,
	label,
	yText,
	yScale,
	xScale,
	getMonth,
	getPost,
	dy,
}) {
	return (
		<g>
			<LinePath
				x={(d) => xScale(getMonth(d))}
				y={(d) => yScale(getPost(d))}
				data={posts}
				stroke="#ffffff"
				strokeWidth={1}
				strokeOpacity={0.4}
				strokeDasharray={(4, 4)}
			/>
			<text y={yText} fontSize="8" fill="white" dy={dy} dx="1em">
				{`${label} post${parseInt(label) > 1 ? "s" : ""}`}
			</text>
		</g>
	);
}

export default MinPrice;
