const mongoose = require("mongoose")

const SubscriptionSchema = mongoose.Schema(
	{
		email: { type: String },
	},
	{ timestamps: true }
)

const Subscription = mongoose.model("Subscription", SubscriptionSchema)

module.exports = Subscription
