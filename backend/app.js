require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const {
	addHotel,
	deleteHotel,
	editHotel,
	getHotel,
	getHotels,
	getFeaturedHotels,
} = require("./controllers/hotel")
const {
	login,
	register,
	createReservation,
	getUserReservations,
	getUsers,
	deleteUser,
} = require("./controllers/user")
const {
	updateReservation,
	deleteReservation,
	getReservations,
} = require("./controllers/reservation")

const { addSubscription } = require("./controllers/subscription")
const { addReview, deleteReview } = require("./controllers/review")

const authenticated = require("./middlewares/authenticated")
const hasRole = require("./middlewares/hasRole")
const ROLES = require("./constants/roles")

const mapHotel = require("./helpers/mapHotel")
const mapUser = require("./helpers/mapUser")
const mapReview = require("./helpers/mapReview")
const mapReservation = require("./helpers/mapReservation")

const port = 3001
const app = express()

app.use(cookieParser())
app.use(express.json())

app.post("/register", async (req, res) => {
	try {
		const { user, token } = await register(req.body.login, req.body.password)

		res
			.cookie("token", token, { httpOnly: true })
			.send({ error: null, user: mapUser(user) })
	} catch (e) {
		res.send({ error: e.message || "Unknown error" })
	}
})

app.post("/login", async (req, res) => {
	try {
		const { user, token } = await login(req.body.login, req.body.password)

		res
			.cookie("token", token, { httpOnly: true })
			.send({ error: null, user: mapUser(user) })
	} catch (e) {
		res.send({ error: e.message || "Unknown error" })
	}
})

app.post("/logout", async (req, res) => {
	res.cookie("token", "", { httpOnly: true }).send({})
})

app.post("/subscriptions", async (req, res) => {
	await addSubscription(req.body)

	res.send({ error: null })
})

app.get("/hotels", async (req, res) => {
	const { hotels, lastPage } = await getHotels(
		req.query.search,
		req.query.limit,
		req.query.page,
		req.query.country,
		req.query.min,
		req.query.max,
		req.query.rating
	)

	setTimeout(() => {
		// res.send({ data: { hotels: hotels.map(mapHotel), lastPage } })
		res.send({ hotels: hotels.map(mapHotel), lastPage })
	}, 800)
})

app.get("/hotels/featured", async (req, res) => {
	try {
		const featuredHotels = await getFeaturedHotels()
		res.send(featuredHotels)
	} catch (error) {
		throw new Error("Error getting featured hotels")
	}
})

app.get("/hotel/:id", async (req, res) => {
	const hotel = await getHotel(req.params.id)

	setTimeout(() => {
		res.send({ data: mapHotel(hotel) })
		// res.send(mapHotel(hotel))
	}, 1000)
})

app.post("/users/:id/reservations", async (req, res) => {
	try {
		const newReservation = await createReservation(req.params.id, req.body)
		res.send({ data: newReservation, error: null })
	} catch (error) {
		res.send({ error: error.message || "Unknown error" })
	}
})

app.get("/users/:id/reservations", async (req, res) => {
	const userReservations = await getUserReservations(req.params.id, req.body)

	// res.send({ data: userReservations })
	setTimeout(() => {
		res.send(userReservations.map(mapReservation))
	}, 1000)
})

app.delete("/reservations/:reservationId/hotels/:hotelId", async (req, res) => {
	await deleteReservation(req.params.reservationId, req.params.hotelId)
	res.send({ error: null })
})

app.patch("/reservations/:reservationId", async (req, res) => {
	await updateReservation(req.params.reservationId, {
		checkIn: req.body.checkIn,
		checkOut: req.body.checkOut,
		guestQuantity: req.body.guestQuantity,
	})

	setTimeout(() => {
		res.send({ error: null })
	}, 900)
})

app.use(authenticated)

// app.post("/hotels/create", hasRole([ROLES.ADMIN]), async (req, res) => {
app.get("/users", hasRole([ROLES.ADMIN]), async (req, res) => {
	const users = await getUsers()

	res.send({
		// fiter not to show admins
		users: users.map(mapUser).filter((user) => user.roleId !== ROLES.ADMIN),
		error: null,
	})
})

app.delete("/users/:id", hasRole([ROLES.ADMIN]), async (req, res) => {
	const deletedUser = await deleteUser(req.params.id)
	// console.log(deletedUser)

	return { error: null }
})

app.post("/hotels/create", hasRole([ROLES.ADMIN]), async (req, res) => {
	// app.post("/hotels/create", async (req, res) => {
	const newHotel = await addHotel({
		title: req.body.title,
		rating: req.body.rating,
		description: req.body.description,
		price: req.body.price,
		country: req.body.country,
	})

	res.send({ data: mapHotel(newHotel) })
})

app.patch("/hotels/:id", async (req, res) => {
	const updatedHotel = await editHotel(req.params.id, {
		title: req.body.title,
		description: req.body.description,
		country: req.body.country,
		rating: req.body.rating,
		price: req.body.price,
		images: req.body.images,
	})

	res.send({ data: mapHotel(updatedHotel) })
})

app.delete("/hotels/:id", hasRole([ROLES.ADMIN]), async (req, res) => {
	await deleteHotel(req.params.id)

	res.send({ error: null })
})

app.post("/hotels/:id/reviews", async (req, res) => {
	console.log("req.user.id: ", req.user.id)

	const newReview = await addReview(req.params.id, {
		content: req.body.content,
		author: req.user.id,
	})

	res.send({ data: mapReview(newReview) })
})

app.delete(
	"/hotels/:hotelId/reviews/:reviewId",

	async (req, res) => {
		await deleteReview(req.params.hotelId, req.params.reviewId)

		res.send({ error: null })
	}
)

app.get("/reservations", hasRole([ROLES.ADMIN]), async (req, res) => {
	const reservations = await getReservations({})

	console.log("re", reservations)
	res.send({ reservations: reservations.map(mapReservation), error: null })
})

mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
	app.listen(port, () => {
		console.log(`blog server started on port ${port}`)
	})
})
