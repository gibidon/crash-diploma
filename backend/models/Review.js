const mongoose = require("mongoose")
// const validator = require("validator")

const ReviewSchema = mongoose.Schema(
	{
		content: { type: String, required: true },
		author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
)

const Review = mongoose.model("Review", ReviewSchema)

module.exports = Review
