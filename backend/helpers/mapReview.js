module.exports = function (review) {
	return {
		content: review.content,
		author: review.author.login,
		// id: review._id,
		// publishedAt: review.createdAt,
	}
}
