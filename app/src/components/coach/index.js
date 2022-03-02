import React, { useState, useEffect, useReducer } from 'react'
import moment from 'moment'
import { Grid, TextField, Paper, Box, IconButton, Autocomplete, CircularProgress, Button } from '@mui/material'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import VIDEO_ICON from '../../assets/video_icon.jpg';
import gameService from '../../services/game.service'

import { makeStyles } from '@mui/styles';

import GameTab from './Tabs/gameTab';

const styles = {
    loader: {
        position: 'fixed',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
};

const useStyles = makeStyles((theme) => ({
    '@global': {
        p: {
            color: "black"
        }
    },
}));

export default function Coach() {
    const classes = useStyles();

    const [curTab, setCurTab] = useState(0)
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        teamList: [],
        team: null,

        gameList: [],
        game: null,
        allTagList: [],
    })
    const { teamList, team, gameList, game, allTagList, } = state

    const [drawOpen, setDrawOpen] = useState(true)

    const [loading, setLoading] = useState(true)


    useEffect(() => {
        setLoading(true)
        gameService.getAllMyCoachTeam().then((res) => {
            setState({ teamList: res, team: res[0] })
            setLoading(false)
        })
    }, [])
    useEffect(() => {
        if (!team) return
        setLoading(true)
        gameService.getAllGamesByTeam(team.season_id, team.league_id, team.team_id).then((res) => {
            setState({ gameList: res, game: res[0] })
            setDrawOpen(true)
            setLoading(false)
        })
    }, [team])
    useEffect(() => {
        if (!!team && !!game) {
            setLoading(true)
            gameService.getAllPlayerTagsByTeam(team.team_id, game?.id).then((res) => {
                setState({ allTagList: res })
                setLoading(false)
            })
            gameService.getGameTeamPlayersByTeam(team.team_id, game?.id).then((res) => {
                setState({ playerList: res })
            })
        } else {
            setState({ allTagList: [] })
        }
    }, [team, game])

    if (loading)
        return (
            <div style={styles.loader}>
                <CircularProgress />
            </div>
        )
    else return (
        <Box classes={classes['@global']} style={{ background: "white", paddingTop: 8 }}>
            <Box sx={{ mx: 1, mt: 1, display: drawOpen ? "flex" : "none", gap: 1 }} >
                {["Games", "Team Stats", "Game Stats", "My Edits"].map((title, idx) =>
                    <Button
                        key={idx}
                        style={{ width: "20%" }}
                        variant={curTab === idx ? "contained" : "outlined"}
                        onClick={() => setCurTab(idx)}
                    >
                        {title}
                    </Button>
                )}
                <Autocomplete
                    options={teamList}
                    value={team}
                    fullWidth
                    isOptionEqualToValue={(option, value) => option && option.team_name}
                    disableClearable
                    getOptionLabel={(t) => `${t.season_name} - ${t.league_name} - ${t.team_name}`}
                    renderInput={(params) => (
                        <TextField {...params} label="My Team" />
                    )}
                    onChange={(event, newValue) => {
                        setState({ team: newValue });
                    }}
                />
            </Box>
            <Paper sx={{ m: 1 }}>
                <Box sx={{ px: 1, display: drawOpen ? "flex" : "none", minHeight: 50, maxHeight: 350, overflowY: 'auto' }}>
                    {gameList.length === 0 ?
                        <Box sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>No Game</Box> :
                        <Grid container spacing={2} >
                            {gameList.map((g) => (
                                <Grid item xs={6} md={3} key={g.id} >
                                    <div
                                        style={game !== g ? { opacity: 0.5 } : {}}
                                        onClick={() => { setState({ game: g }) }}
                                    >
                                        <div
                                            className='gameImage'
                                            style={{ backgroundImage: `url(${g?.image?.length > 0 ? g.image : VIDEO_ICON})`, width: 100, height: 70 }}>
                                        </div>
                                        <div>
                                            <div>{moment(g.date).format('DD MMM, YYYY hh:mm')}</div>
                                            <div>{g.home_team_name}</div>
                                            <div>{g.away_team_name}</div>
                                        </div>
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                    }
                </Box>
                <Box sx={{ textAlign: "center", borderTop: "1px #80808038 solid", m: '0 10px' }}>
                    <IconButton onClick={() => setDrawOpen((v) => !v)} sx={{ background: '#8080804d' }}>
                        {
                            drawOpen ?
                                <ArrowDropUpIcon /> :
                                <ArrowDropDownIcon />
                        }
                    </IconButton>
                </Box>
            </Paper>

            <Box className='coach-down-side'
                style={{
                    display: "flex", height: `calc(95vh - ${drawOpen ? gameList?.length === 0 ? 150 : gameList?.length / 4 * 50 + 170 : 100}px)`
                }}>
                {curTab === 0 && <GameTab allTagList={allTagList} />}
                {curTab === 1 && <></>}
                {curTab === 2 && <></>}
                {curTab === 3 && <></>}
            </Box>
        </Box>
    )
}

