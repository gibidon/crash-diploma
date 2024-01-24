const mongoose = require("mongoose")

const ReservationSchema = mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	dateStart: { type: String },
	dateEnd: { type: String },
	guestQuantity: { type: Number, default: 1 },
	hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
})

const Reservation = mongoose.model("Reservation", ReservationSchema)

module.exports = Reservation
