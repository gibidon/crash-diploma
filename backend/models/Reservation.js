const mongoose = require("mongoose")
const getDateNow = require("../utils/get-date-now")

const dateToday = new Date().toISOString().split("T")[0]

const ReservationSchema = mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	checkIn: { type: Date, min: getDateNow() },
	checkOut: { type: Date, min: getDateNow() },
	guestQuantity: { type: Number, default: 1 },
	hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
})

const Reservation = mongoose.model("Reservation", ReservationSchema)

module.exports = Reservation
