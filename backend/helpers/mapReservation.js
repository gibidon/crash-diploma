module.exports = function (reservation) {
	return {
		id: reservation._id,
		user: reservation.user,
		checkIn: reservation.checkIn,
		checkOut: reservation.checkOut,
		guestQuantity: reservation.guestQuantity,
		hotel: reservation.hotel,
	}
}

//TODO change to normal,syncronize with frontend data
