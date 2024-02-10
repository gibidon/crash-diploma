module.exports = function (review) {
	return {
		content: review.content,
		author: review.author.login ?? review.author,
		//TODO bug not showing name instantly
	}
}
