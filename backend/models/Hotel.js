const mongoose = require("mongoose")
const validator = require("validator")

const HotelSchema = mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	images: {
		type: [String],
		default: [
			"https://avatars.mds.yandex.net/i?id=94e1ac21200e722e68add82c7451d22c065e1a78-9289753-images-thumbs&n=13",
		],
	},
	price: Number,
	country: String,
	rating: Number,
	reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
})

const Hotel = mongoose.model("Hotel", HotelSchema)

module.exports = Hotel
