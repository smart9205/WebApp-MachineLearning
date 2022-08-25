const db = require("../models");
const axios = require("axios");
const Game = db.game;
const Op = db.Sequelize.Op;
const Sequelize = db.sequelize;
const Team_Tag = db.team_tag

exports.create = (req, res) => {
  // Validate request
  // if (!req.body.name) {
  //   res.status(400).send({
  //     message: "Name can not be empty!"
  //   });
  //   return;
  // }
  Game.create(req.body)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Game."
      });
    });

};

exports.getNewStreamURL = async (req, res) => {
  try {
    const response = await axios.post("https://api.newstream.ai/api/video/v1/youtube_download_link", req.body);
    return res.send(response?.data);

  } catch (e) { return res.send("error occured") }
};

exports.getbyTeam = (req, res) => {
  const seasonId = req.params.season;
  const leagueId = req.params.league;
  const teamId = req.params.team;

  Sequelize.query(`
    SELECT 
      public."Games".*,
      public."Seasons".name as season_name,
      public."Leagues".name as league_name,
      HomeTeam.name as home_team_name,
      AwayTeam.name as away_team_name
    FROM public."Games" 
    JOIN public."Seasons" on public."Games".season_id = public."Seasons".id
    JOIN public."Leagues" on public."Games".league_id = public."Leagues".id
    JOIN public."Teams" as HomeTeam on public."Games".home_team_id = HomeTeam.id
    JOIN public."Teams" as AwayTeam on public."Games".away_team_id = AwayTeam.id
    WHERE (public."Games".home_team_id = ${teamId} OR public."Games".away_team_id = ${teamId})  
      AND public."Games".season_id = ${seasonId} AND public."Games".league_id = ${leagueId}
    ORDER BY public."Games".date desc
  `)
    .then(data => {
      res.send(data[0]);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving games."
      });
    });
};

exports.getbyCoach = (req, res) => {
  const coachId = req.params.coachId;

  Sequelize.query(`
    SELECT 
    distinct public."Games".*,
    public."Seasons".name as season_name,
    public."Leagues".name as league_name,
    HomeTeam.name as home_team_name,
    AwayTeam.name as away_team_name,
	  HomeTeam.image as home_team_image,
	  AwayTeam.image as away_team_image
    FROM public."Games" 
    JOIN public."Seasons" on public."Games".season_id = public."Seasons".id
    JOIN public."Leagues" on public."Games".league_id = public."Leagues".id
    JOIN public."Teams" as HomeTeam on public."Games".home_team_id = HomeTeam.id
    JOIN public."Teams" as AwayTeam on public."Games".away_team_id = AwayTeam.id
    join public."Coach_Teams" as Coach_Teams on public."Games".season_id = Coach_Teams.season_id
    WHERE (public."Games".home_team_id = Coach_Teams.team_id OR public."Games".away_team_id = Coach_Teams.team_id)  
      AND public."Games".season_id = Coach_Teams.season_id AND public."Games".league_id = Coach_Teams.league_id and Coach_Teams.user_id=${coachId} 
    ORDER BY public."Games".date desc
  `)
    .then(data => {
      res.send(data[0]);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving games."
      });
    });
};


exports.deleteGames = (req, res) => {
  Sequelize.query(`
    DELETE FROM public."Games" WHERE id IN (${req.body.games.map((id) => id)})
  `)
    .then(data => {
      res.send(data[0]);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving games."
      });
    });
};

exports.findAll = (req, res) => {
  Sequelize.query(`
    SELECT 
      public."Games".*,
      public."Seasons".name as season_name,
      public."Leagues".name as league_name,
      HomeTeam.name as home_team_name,
      AwayTeam.name as away_team_name
    FROM public."Games" 
    JOIN public."Seasons" on public."Games".season_id = public."Seasons".id
    JOIN public."Leagues" on public."Games".league_id = public."Leagues".id
    JOIN public."Teams" as HomeTeam on public."Games".home_team_id = HomeTeam.id
    JOIN public."Teams" as AwayTeam on public."Games".away_team_id = AwayTeam.id
  `)
    .then(data => {
      res.send(data[0]);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving games."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Sequelize.query(`
    SELECT 
      public."Games".*,
      public."Seasons".name as season_name,
      public."Leagues".name as league_name,
      HomeTeam.name as home_team_name,
      AwayTeam.name as away_team_name
    FROM public."Games" 
    JOIN public."Seasons" on public."Games".season_id = public."Seasons".id
    JOIN public."Leagues" on public."Games".league_id = public."Leagues".id
    JOIN public."Teams" as HomeTeam on public."Games".home_team_id = HomeTeam.id
    JOIN public."Teams" as AwayTeam on public."Games".away_team_id = AwayTeam.id
    where public."Games".id = ${id}
  `)
    .then(data => {
      res.send(data[0][0]);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving games."
      });
    });

};

exports.getScoreInGames = (req, res) => {
  const gameIds = req.body.gameIds;
  const teamId = req.body.teamId;

  Sequelize.query(`
    SELECT 
      SUM(CASE WHEN team_id = ${teamId} THEN 1 ELSE 0 END) as team_score,
      SUM(CASE WHEN team_id <> ${teamId} THEN 1 ELSE 0 END) as opponent_score
    FROM public."Player_Tags"
    LEFT JOIN public."Team_Tags" on public."Team_Tags".id = public."Player_Tags".team_tag_id
    LEFT JOIN public."Games" on public."Games".id = public."Team_Tags".game_id
    Where game_id in (${gameIds.length > 0 ? gameIds : 0}) and action_result_id = 3
  `)
    .then(data => {
      res.send(data[0][0]);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving games."
      });
    });
};

exports.getPlayerActions = (req, res) => {
  const gameIds = req.body.gameIds;
  const teamId = req.body.teamId;

  Sequelize.query(`
    SELECT 
      public."Players".*,
      SUM(CASE WHEN action_result_id = 3 THEN 1 ELSE 0 END) as "G",
      SUM(CASE WHEN action_id = 1 THEN 1 ELSE 0 END) as "SH",
      SUM(CASE WHEN action_id = 2 THEN 1 ELSE 0 END) as "P",
      SUM(CASE WHEN action_id = 10 THEN 1 ELSE 0 END) as "I",
      SUM(CASE WHEN action_id = 8 and action_type_id in (1, 2, 3) THEN 1 ELSE 0 END) as "S",
      SUM(CASE WHEN action_id = 11 and action_type_id in (1, 2, 3) THEN 1 ELSE 0 END) as "C"
      
    FROM public."Player_Tags"

    LEFT JOIN public."Team_Tags" on public."Team_Tags".id = public."Player_Tags".team_tag_id
    LEFT JOIN public."Games" on public."Games".id = public."Team_Tags".game_id
    LEFT JOIN public."Players" on public."Players".id = public."Player_Tags".player_id

    Where game_id in (${gameIds}) and team_id = ${teamId}
    group by public."Players".id
  `)
    .then(data => {
      res.send(data[0]);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving games."
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Game.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Game was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Game with id = ${id}. Maybe Game was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Game with id=" + id
      });
    });
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  const teamTag = await Team_Tag.findOne({
    where: { game_id: id }
  })

  if (teamTag !== null) {
    return res.send({
      result: "fail",
      message: "Game can not be deleted as have tags"
    });
  }

  Game.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          result: "success",
          message: "Game was deleted successfully!"
        });
      } else {
        res.send({
          result: "success",
          message: `Cannot delete Game with id = ${id}. Maybe Game was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Game with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Game.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Games were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Games."
      });
    });
};

