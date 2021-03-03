import { LinePath } from "@vx/shape";

function MaxPrice({ posts, label, yText, yScale, xScale, getMonth, getPost }) {
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
			<text y={yText} fontSize="8" fill="white" dy="1.3em" dx="1em">
				{`${label} posts`}
			</text>
		</g>
	);
}

export default MaxPrice;
