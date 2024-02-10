const Review = require("../models/Review")
const Hotel = require("../models/Hotel")

async function addReview(hotelId, review) {
	const newReview = await Review.create(review)

	await Hotel.findByIdAndUpdate(hotelId, { $push: { reviews: newReview } })

	await newReview.populate("author")

	return newReview
}

async function deleteReview(hotelId, reviewId) {
	await Review.deleteOne({ _id: reviewId })

	await Hotel.findByIdAndUpdate(hotelId, { $pull: { reviews: reviewId } })
}

module.exports = { addReview, deleteReview }
