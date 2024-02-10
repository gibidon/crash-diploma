const Reservation = require("../models/Reservation")
const User = require("../models/User")

async function updateReservation(id, reservation) {
	const newReservation = await Reservation.findByIdAndUpdate(id, reservation, {
		returnDocument: "after",
	})
	// populate
	return newReservation
}

async function deleteReservation(reservationId, hotelId) {
	await Reservation.deleteOne({ _id: reservationId })

	await User.findByIdAndUpdate(hotelId, {
		$pull: { reservations: { hotel: hotelId } },
	})
}

async function getReservations() {
	const reservations = Reservation.find({})

	return reservations
}

module.exports = { getReservations, updateReservation, deleteReservation }
