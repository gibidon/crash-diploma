module.exports = function (reservation) {
	return {
		id: reservation._id,
		user: reservation.user,
		checkIn: reservation.dateStart,
		checkOut: reservation.dateEnd,
		guests: reservation.guestQuantity,
		hotel: reservation.hotel,
	}
}

//TODO change to normal,syncronize with frontend data
