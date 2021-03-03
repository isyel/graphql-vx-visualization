export default function groupTopics(tempPosts) {
	let counts = {};
	tempPosts?.forEach((post) => {
		if (Array.isArray(post.likelyTopics))
			counts[post.likelyTopics[0].label] =
				1 + (counts[post.likelyTopics[0].label] || 0);
		else
			return (counts[post.likelyTopics] = 1 + (counts[post.likelyTopics] || 0));
	});
	return counts;
}
