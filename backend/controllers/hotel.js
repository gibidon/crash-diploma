const Hotel = require("../models/Hotel")

async function getHotels(search = "", limit = 10, page = 1) {
	const [hotels, count] = await Promise.all([
		// Hotel.find({ title: { $regex: search, $options: "i" } })
		Hotel.find({
			title: { $regex: search, $options: "i" },
			// country: { $regex: country, $options: "i" },
		})
			.limit(limit)
			.skip((page - 1) * limit),
		// .sort({ createdAt: -1 }),
		Hotel.countDocuments({ title: { $regex: search, $options: "i" } }),
	])

	console.log("hotels in getHotels: ", hotels)
	return { hotels, lastPage: Math.ceil(count / limit) }
}

async function addHotel(hotel) {
	const newHotel = await Hotel.create(hotel)

	console.log("newHotel in addHotel.create: ", newHotel)
	// await newHotel.populate({
	// 	path: "reviews",
	// 	populate: "author",
	// })

	return newHotel
}

async function editHotel(id, hotel) {
	const newHotel = await Hotel.findByIdAndUpdate(id, hotel, {
		returnDocument: "after",
	})
	await newHotel.populate({ path: "reviews", populate: "author" })

	return newHotel
}

async function getHotel(id) {
	return await Hotel.findById(id).populate({
		path: "reviews",
		populate: "author",
	})
}

async function deleteHotel(id) {
	console.log("deleting hotel", id)
	return await Hotel.deleteOne({ _id: id })
}

module.exports = { addHotel, deleteHotel, editHotel, getHotel, getHotels }
