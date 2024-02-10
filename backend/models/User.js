const mongoose = require("mongoose")
const roles = require("../constants/roles")

const UserSchema = mongoose.Schema(
	{
		login: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: Number, default: roles.USER },
		reservations: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "Reservation" },
		],
	},
	{ timestamps: true }
)

const User = mongoose.model("User", UserSchema)

module.exports = User
