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
} = require("./controllers/hotel")
const {
	login,
	register,
	createReservation,
	getReservations,
	// updateUserReservations,
} = require("./controllers/user")
const { addReview, deleteReview } = require("./controllers/review")

const authenticated = require("./middlewares/authenticated")

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

		res.cookie("token", token, { httpOnly: true }).send({ error: null, user }) //TODO MAP
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
		// .send({ error: null, user })
	} catch (e) {
		res.send({ error: e.message || "Unknown error" })
	}
})

app.post("/logout", async (req, res) => {
	res.cookie("token", "", { httpOnly: true }).send({})
})

app.get("/hotels", async (req, res) => {
	const { hotels, lastPage } = await getHotels(
		req.query.search,
		req.query.limit,
		req.query.page,
		req.query.country,
		req.query.price
	)

	res.send({ data: { hotels: hotels.map(mapHotel), lastPage } })
})

app.get("/hotel/:id", async (req, res) => {
	const hotel = await getHotel(req.params.id)

	// console.log("hotel in get: ", hotel)
	// setTimeout(() => {
	res.send({ data: mapHotel(hotel) })
	// }, 1500)
})

app.post("/users/:id/reservations", async (req, res) => {
	// const userReservations = await createReservation(req.params.id, req.body)

	// res.send({ data: userReservations })

	await createReservation(req.params.id, req.body)

	res.send({ error: null })
})

app.get("/users/:id/reservations", async (req, res) => {
	const userReservations = await getReservations(req.params.id, req.body)

	// res.send({ data: userReservations })
	res.send(userReservations.map(mapReservation))
})

app.use(authenticated)

// app.post("/hotels/create", hasRole([ROLES.ADMIN]), async (req, res) => {
app.post("/hotels/create", async (req, res) => {
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
	})

	res.send({ data: mapHotel(updatedHotel) })
})

// app.delete("/hotels/:id", hasRole([ROLES.ADMIN]), async (req, res) => {
app.delete("/hotels/:id", async (req, res) => {
	await deleteHotel(req.params.id)

	res.send({ error: null })
})

app.post("/hotels/:id/reviews", async (req, res) => {
	const newReview = await addReview(req.params.id, {
		content: req.body.content,
		author: req.user.id,
		// author: req.body.id,
	})

	res.send({ data: mapReview(newReview) })
})

// app.post(`/book`, async (req, res) => {
// 	await updateUserBookings(req.body.userLogin, req.body.hotelId)
// })

app.delete(
	"/hotels/:hotelId/reviews/:reviewId",
	// hasRole([ROLES.ADMIN, ROLES.MODERATOR]),
	async (req, res) => {
		await deleteReview(req.params.hotelId, req.params.reviewId)

		res.send({ error: null })
	}
)

mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
	app.listen(port, () => {
		console.log(`blog server started on port ${port}`)
	})
})
