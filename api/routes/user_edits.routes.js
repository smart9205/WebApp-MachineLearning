const { authJwt } = require("../middleware");
const controller = require("../controllers/user_edits.controller");
module.exports = app => {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});
	app.use([authJwt.verifyToken]);

	app.post(
		"/user_edits",
		[authJwt.isAdmin],
		controller.create
	);

	app.get(
		"/user_edits",
		controller.findAll
	);

	app.get(
		"/user_edits/:id",
		controller.findOne
	);

	app.put(
		"/user_edits/:id",
		[authJwt.isAdmin],
		controller.update
	);

	app.delete(
		"/user_edits/:id",
		[authJwt.isAdmin],
		controller.delete
	);

	app.delete(
		"/user_edits",
		[authJwt.isAdmin],
		controller.deleteAll
	);
};
