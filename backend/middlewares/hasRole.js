module.exports = function (roles) {
	return (req, res, next) => {
		console.log("roles in hasrole: ", roles, typeof roles[0])
		console.log("role in hasRole: ", req.user.role, typeof req.user.role)
		console.log("result- ", roles.includes(req.user.role))
		if (!roles.includes(req.user.role)) {
			res.send({ error: "Access denied" })

			return
		}
		console.log("handing over to next in hasRole")
		next()
	}
}
