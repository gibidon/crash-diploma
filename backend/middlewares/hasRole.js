module.exports = function (roles) {
	return (req, res, next) => {
		console.log("req.user.role: ", req.user.role)
		if (!roles.includes(req.user.role)) {
			res.send({ error: "Access denied" })

			return
		}

		next()
	}
}
