import * as React from 'react';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import Snackbar from '@mui/material/Snackbar';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import Search from './search'
import GameService from "../../services/game.service";

const useStyles = makeStyles((theme) => ({
  central: {
    '& > *': {
      margin: 6,
    },
  },
}));

export default function Content({ newGameAdded }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [count, setCount] = React.useState(0);
  const [leagueOpen, setLeagueOpen] = React.useState(false);
  const [leagueName, setLeagueName] = React.useState("");
  const [teamOpen, setTeamOpen] = React.useState(false);

  const [teamName, setTeamName] = React.useState("");

  const [gameDate, setGameDate] = React.useState(new Date());
  const [season, setSeason] = React.useState({});
  const [league, setLeague] = React.useState({});
  const [seasonList, setSeasonList] = React.useState([]);
  const [leagueList, setLeagueList] = React.useState([]);
  const [teamList, setTeamList] = React.useState([]);
  const [playerList, setPlayerList] = React.useState([]);

  const [homeTeam, setHomeTeam] = React.useState(false);
  const [awayTeam, setAwayTeam] = React.useState(false);
  const [playerOpen, setPlayerOpen] = React.useState(false);

  const [error, setError] = React.useState({
    f_name: false,
    l_name: false,
    position: false,
    jersey_number: false
  });

  const [playerData, setPlayerData] = React.useState({
    f_name: "",
    l_name: "",
    date_of_birth: new Date(),
    position: "",
    jersey_number: 1
  });

  React.useEffect(() => {
    GameService.getAllSeasons().then((res) => {
      setSeasonList(res);
      setSeason(res[0]);
    });
    GameService.getAllLeagues().then((res) => {
      setLeagueList(res);
      setLeague(res[0]);
    })
  }, [count]);

  const getTeamList = () => {
    GameService.getAllTeams().then((res) => {
      setTeamList(res);
    });
  }
  const getPlayerList = () => {
    GameService.getAllPlayers().then((res) => {
      setPlayerList(res);
    });
  }
  const handleClickPlayerOpen = () => {
    setPlayerOpen(true);
  };
  React.useEffect(() => {
    getTeamList();
    getPlayerList();
  }, []);

  const handleChange = name => event => {
    setPlayerData({ ...playerData, [name]: event.target.value });
  };
  
  React.useEffect(() => {
    setError({
      f_name: playerData.f_name.length === 0,
      l_name: playerData.l_name.length === 0,
      position: playerData.position.length === 0,
      jersey_number: Number(playerData.jersey_number) <= 0
    })
    console.log("palyer", playerData)
  }, [playerData])

  const checkErrorPlayer = () => {
    return !(Object.keys(error).find(key => error[key]));
  }


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const handleClickTeamOpen = () => {
    setTeamOpen(true);
  };
  const handleTeamClose = (result) => {
    setTeamOpen(false);

    if (!result) return;
    GameService.addTeam({ name: teamName }).then(
      (response) => {
        console.log("NewTeam", response);
        getTeamList();
        setOpen(true);
        setAlert(`${teamName} is successfully added!`);
      },
      (error) => {
      }
    );
  };
  const handlePlayerClose = (result) => {
    setPlayerOpen(false);
    
    if(!result) return;
    
    GameService.addPlayer(playerData).then((response) => {
      console.log("NewPlayer", response);
      getPlayerList();
      setOpen(true);
      setAlert(`${response.f_name} ${response.l_name} is successfully added!`);
    },
    (error) => {
    }
    );
  };

  const addGame = () => {
    if (!homeTeam || !awayTeam || !season || !league) {
      setOpen(true);
      setAlert("Selected enough data to add a new game!");
    }

    GameService.addGame({
      season_id: season.id,
      league_id: league.id,
      home_team_id: homeTeam.id,
      away_team_id: awayTeam.id,
      date: gameDate
    }).then((res) => {
      console.log("Add Game Result", res);

      newGameAdded();
      setOpen(true);
      setAlert("Added a new game");
    })
  }

  const homeTeamCallBack = React.useCallback((param) => {
    setHomeTeam(param);
  }, []);

  const awayTeamCallBack = React.useCallback((param) => {
    setAwayTeam(param);
  }, []);

  const handleLeagueClose = (result) => {
    setLeagueOpen(false);

    if (!result) return;
    GameService.addLeague({ name: leagueName }).then(
      (response) => {
        setOpen(true);
        setCount(count + 1);
        setAlert(`${leagueName} is successfully added!`);
      },
      (error) => {
      }
    );
  };

  return (
    <Box>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {alert}
        </Alert>
      </Snackbar>
      <Dialog open={teamOpen} onClose={e => handleTeamClose(false)}>
        <DialogTitle>Add New Team</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add new Team, please input Team name.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            label="Team Name"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={e => handleTeamClose(false)}>Cancel</Button>
          <Button onClick={e => handleTeamClose(true)}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={playerOpen} onClose={e => handlePlayerClose(false)}>
        <DialogTitle>Add New Player</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add new Player, please input Player details
          </DialogContentText>
          <div style={{ display: 'flex' }}>
            <TextField
              autoFocus
              sx={{m:0.8}}
              value={playerData.f_name}
              onChange={handleChange("f_name")}
              helperText={error.f_name ? "First Name cannot be empty" : ""}
              error={error.f_name}
              label="First Name"
              fullWidth
              variant="outlined"
            />
            <TextField
              sx={{m:0.8}}
              value={playerData.l_name}
              onChange={handleChange("l_name")}
              helperText={error.l_name ? "Last Name cannot be empty" : ""}
              error={error.l_name}
              label="Last  Name"
              fullWidth
              variant="outlined"
            />
          </div>
          <div style={{ display: 'flex' }}>
            <TextField
            sx={{m:0.8}}
              value={playerData.position}
              onChange={handleChange("position")}
              helperText={error.position ? "Position cannot be empty" : ""}
              error={error.position}
              label="Position"
              fullWidth
              variant="outlined"
            />
            <LocalizationProvider dateAdapter={AdapterDateFns} >
              <DatePicker
                label="Date of Birth"
                value={playerData.date_of_birth}
                onChange={handleChange("date_of_birth")}
                renderInput={(params) =>
                  <TextField
                  sx={{m:0.8}}
                    {...params}
                    className={classes.input}
                  />
                }
              />
            </LocalizationProvider>
          </div>
          <TextField
          sx={{m:0.8}}
            label="Jercey Number"
            type="number"
            value={playerData.jersey_number}
            onChange={handleChange("jersey_number")}
            helperText={error.jersey_number ? "Jersey Number cannot be less than 0" : ""}
            error={error.jersey_number}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={e => handlePlayerClose(false)}>Cancel</Button>
          <Button onClick={e => checkErrorPlayer() && handlePlayerClose(true)}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={leagueOpen} onClose={e => handleLeagueClose(false)}>
        <DialogTitle>Add New League</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add new League, please input League name.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            value={leagueName}
            onChange={e => setLeagueName(e.target.value)}
            label="League Name"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={e => handleLeagueClose(false)}>Cancel</Button>
          <Button onClick={e => handleLeagueClose(true)}>Add</Button>
        </DialogActions>
      </Dialog>

      <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={4}>
          <Search
            teamtype="home"
            selectedTeamCallBack={homeTeamCallBack}
            season={season}
            league={league}
            teamList={teamList}
            playerList={playerList}
          />
        </Grid>
        <Grid item xs={4} className={classes.central}>
          <div style={{ textAlign: "center" }}>
            <Button 
              sx={{width:120}}              
              variant="outlined"
              onClick={() => handleClickTeamOpen()}
              startIcon={<AddIcon />}
            >
              Team
            </Button>
          </div>
          <div style={{ textAlign: "center" }}>
            <Button
              sx={{width:120}}      
              variant="outlined"
              onClick={e => handleClickPlayerOpen()}
              startIcon={<AddIcon />}
            >
              Player
            </Button>
          </div>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Game Date"
              value={gameDate}
              onChange={(newValue) => {
                setGameDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
          <Autocomplete
            id="combo-box-demo"
            options={seasonList}
            value={season}
            isOptionEqualToValue={(option, value) => option && option.name}
            getOptionLabel={
              (option) => !option.name ? "" : option.name
            }
            fullWidth
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              );
            }}
            renderInput={(params) => <TextField {...params} label="Season" />}
            onChange={(event, newValue) => {
              setSeason(newValue);
            }}
          />
          <div style={{ display: 'flex' }}>
            <Autocomplete
              id="combo-box-demo"
              options={leagueList}
              value={league}
              isOptionEqualToValue={(option, value) => option && option.name}
              getOptionLabel={
                (option) => !option.name ? "" : option.name
              }
              fullWidth
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                );
              }}
              renderInput={(params) => <TextField {...params} label="League" />}
              onChange={(event, newValue) => {
                setLeague(newValue);
              }}
            />
            <IconButton style={{ alignSelf: 'center' }} aria-label="delete" size="large" onClick={e => setLeagueOpen(true)}>
              <AddCircleIcon />
            </IconButton>
          </div>
          <div style={{ textAlign: "center" }}>
            <Button variant="outlined" sx={{ mt: 5 }} onClick={addGame}>Add Game</Button>
          </div>
        </Grid>
        <Grid item xs={4}>
          <Search
            teamtype="away"
            selectedTeamCallBack={awayTeamCallBack}
            season={season}
            league={league}
            teamList={teamList}
            playerList={playerList}
          />
        </Grid>
      </Grid>
    </Box>
  );
}