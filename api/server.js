const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// database
const db = require("./models");
const Role = db.role;
const Subscription = db.subscription;
const Action = db.action;
const Action_Type = db.action_type;
const Action_Result = db.action_result;

db.sequelize.sync().then(() => {
  initial();
});
// force: true will drop the table if it already exists
// db.sequelize.sync({ force: false }).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Soccer Scouting4U!" });
});

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/whatsapp.routes')(app);
require('./routes/season.routes')(app);
require('./routes/league.routes')(app);
require('./routes/action.routes')(app);
require('./routes/action_type.routes')(app);
require('./routes/action_result.routes')(app);
require('./routes/game.routes')(app);
require('./routes/player.routes')(app);
require('./routes/player_tag.routes')(app);
require('./routes/team.routes')(app);
require('./routes/team_tag.routes')(app);
require('./routes/team_players.routes')(app);
// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {

  Role.findAll({
    where: {},
  }).then(res => {
    if (!res.length) {
      Role.create({ id: 1, name: "admin" });
      Role.create({ id: 2, name: "tagger" });
      Role.create({ id: 3, name: "coach" });
      Role.create({ id: 4, name: "player" });
    }
  });

  Subscription.findAll({
    where: {},
  }).then(res => {
    if (!res.length) {
      Subscription.create({ id: 1, name: "tagger" })
      Subscription.create({ id: 2, name: "coach" })
      Subscription.create({ id: 3, name: "player" })
    }
  })

  Action.findAll({
    where: {},
  }).then(res => {
    if (!res.length) {
      Action.create({ id: 1, name: "Shot" })
      Action.create({ id: 2, name: "Pass" })
      Action.create({ id: 3, name: "Cross" })
      Action.create({ id: 4, name: "Penalty" })
      Action.create({ id: 5, name: "Corner" })
      Action.create({ id: 6, name: "Free Kick" })
      Action.create({ id: 7, name: "Dribble" })
      Action.create({ id: 8, name: "Foul" })
      Action.create({ id: 9, name: "Draw Foul" })
      Action.create({ id: 10, name: "Turnover" })
      Action.create({ id: 11, name: "Goal" })
      Action.create({ id: 12, name: "Saved" })
      Action.create({ id: 13, name: "Assist" })
      Action.create({ id: 14, name: "Interception" })
      Action.create({ id: 15, name: "Clearance" })
      Action.create({ id: 16, name: "Tackle" })
      Action.create({ id: 17, name: "Free Kick" })
      Action.create({ id: 18, name: "Yellow Card" })
      Action.create({ id: 19, name: "Red Card" })
    }
  })

  Action_Type.findAll({
    where: {},
  }).then(res => {
    if (!res.length) {
      Action_Type.create({ id: 1, name: "Right" })
      Action_Type.create({ id: 2, name: "Left" })
      Action_Type.create({ id: 3, name: "Header" })
      Action_Type.create({ id: 4, name: "Short Pass" })
      Action_Type.create({ id: 5, name: "Long Pass" })
      Action_Type.create({ id: 6, name: "Through Pass" })
      Action_Type.create({ id: 7, name: "Key Pass" })
    }
  })

  Action_Result.findAll({
    where: {},
  }).then(res => {
    if (!res.length) {
      Action_Result.create({ id: 1, name: "On Target" })
      Action_Result.create({ id: 2, name: "Off Target", change_possession: true })
      Action_Result.create({ id: 3, name: "Goal", change_possession: true })
      Action_Result.create({ id: 4, name: "Successful", end_possession: false })
      Action_Result.create({ id: 5, name: "Turnover", change_possession: true })
      Action_Result.create({ id: 6, name: "Saved" })
      Action_Result.create({ id: 7, name: "Blocked" })
      Action_Result.create({ id: 8, name: "Cleared" })
      Action_Result.create({ id: 9, name: "Goalkeeper Saved" })
      Action_Result.create({ id: 10, name: "Unsuccessful", change_possession: true })
      Action_Result.create({ id: 11, name: "Bad Pass", change_possession: true })
      Action_Result.create({ id: 12, name: "Bad Dribble", change_possession: true })
      Action_Result.create({ id: 13, name: "Free Kick" })
      Action_Result.create({ id: 14, name: "Penalty" })
    }
  })
}