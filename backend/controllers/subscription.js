const Subscription = require("../models/Subscription")

async function addSubscription(email) {
	const newSubscription = await Subscription.create(email)

	return newSubscription
}

module.exports = { addSubscription }
