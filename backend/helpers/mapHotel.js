module.exports = function (hotel) {
	return {
		id: hotel._id,
		title: hotel.title,
		description: hotel.description,
		images: hotel.images,
		price: hotel.price,
		country: hotel.country,
		reviews: hotel.reviews,
		rating: hotel.rating,
	}
}
