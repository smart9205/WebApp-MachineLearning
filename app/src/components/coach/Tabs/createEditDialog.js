import React, { useState, useReducer, useEffect } from "react";

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    Autocomplete,
    Grid,
    OutlinedInput,
    Chip,
} from '@mui/material'
import { useTheme } from '@mui/material/styles';
import moment from 'moment'
import gameService from "../../../services/game.service";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, action, theme) {
    return {
        fontWeight:
            action.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}


const CreateEditDialog = ({ open, handleOpen, teamList }) => {

    const theme = useTheme();

    const [curSelect, setCurSelect] = useState(0)

    const [game, setGame] = useState([])
    const [action, setAction] = useState([])
    const [actionType, setActionType] = useState([])
    const [actionResult, setActionResult] = useState([])

    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        actionList: [],
        actionTypeList: [],
        actionResultList: [],

        team: teamList[0] ?? null,
        gameList: [],

        playerList: [],
        player: null,
    })
    const { actionList, actionTypeList, actionResultList, team, gameList, player, playerList } = state

    useEffect(() => {
        gameService.getAllActions().then(res => setState({ actionList: res, action: res[0] ?? null }))
        gameService.getAllActionTypes().then(res => setState({ actionTypeList: res, actionType: res[0] ?? null }))
        gameService.getAllActionResults().then(res => setState({ actionResultList: res, actionResult: res[0] }))
    }, [])

    useEffect(() => {
        if (!team) return
        gameService.getAllGamesByTeam(team.season_id, team.league_id, team.team_id).then((res) => {
            setState({ gameList: res, game: res[0] ?? null })
        })
        setGame([])
    }, [team])

    useEffect(() => {
        if (!!team && game.length > 0) {
            console.log("gamelist", game)
            gameService.getGameTeamPlayersByTeam(team.team_id, game.map(g => g.id).join(",")).then((res) => {
                setState({ playerList: res })
            })
        }
    }, [team, game])

    useEffect(() => {
        setAction([])
        setActionType([])
        setActionResult([])
        setState({ player: null })
    }, [curSelect])


    const handleSearch = () => {
        console.log("handle search")
    }

    const handleChangeGame = (event) => {
        const { target: { value } } = event;
        if (value.length > 5) return;
        setGame(typeof value === 'string' ? value.split(',') : value);
    };

    const handleChangeAction = (event) => {
        const { target: { value } } = event;
        setAction(typeof value === 'string' ? value.split(',') : value);
    };

    const handleChangeActionType = (event) => {
        const { target: { value } } = event;
        setActionType(typeof value === 'string' ? value.split(',') : value);
    };

    const handleChangeActionResult = (event) => {
        const { target: { value } } = event;
        setActionResult(typeof value === 'string' ? value.split(',') : value);
    };

    return (
        <Dialog
            fullWidth
            maxWidth={"lg"}
            open={open}
            onClose={() => handleOpen(false)}
        >
            <DialogTitle>Create Edits</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={4}>
                        <Autocomplete
                            options={teamList}
                            value={team}
                            fullWidth
                            isOptionEqualToValue={(option, value) => option && option.team_name}
                            getOptionSelected={(option, value) => option.id === value.id}
                            disableClearable
                            getOptionLabel={(t) => `${t.team_name}`}
                            renderInput={(params) => (
                                <TextField {...params} label="My Team" />
                            )}
                            onChange={(event, newValue) => {
                                setState({ team: newValue });
                            }}
                        />
                    </Grid>
                    <Grid item xs={8} >
                        <FormControl fullWidth>
                            <InputLabel id="select-multiple-game-label">Games</InputLabel>
                            <Select
                                labelId="select-multiple-game-label"
                                id="select-multiple-game"
                                multiple
                                value={game}
                                onChange={handleChangeGame}
                                input={<OutlinedInput id="select-multiple-game" label="Games" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value, idx) => (
                                            <Chip key={idx} label={`${value.season_name} - ${value.league_name} - ${moment(value.date).format('DD MMM, YYYY')} - ${value.home_team_name} VS ${value.away_team_name}`} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {gameList.map((a, idx) =>
                                    <MenuItem key={idx} value={a} style={getStyles(a, game, theme)}>
                                        {`${a.season_name} - ${a.league_name} - ${moment(a.date).format('DD MMM, YYYY')} - ${a.home_team_name} VS ${a.away_team_name}`}
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ my: 2 }}>
                    {["Defense", "Offense"].map((label, idx) =>
                        <Grid item xs={4} key={idx}>
                            <Button
                                key={idx}
                                variant={idx === curSelect && !player ? "contained" : "outlined"}
                                onClick={() => setCurSelect(idx)}
                                sx={{ m: 1 }}
                            >
                                {label}
                            </Button>
                        </Grid>
                    )}
                    <Grid item xs={4}>
                        <Autocomplete
                            options={playerList}
                            value={player}
                            fullWidth
                            isOptionEqualToValue={(option, value) => option && option.name}
                            getOptionSelected={(option, value) => option.id === value.id}
                            disableClearable
                            getOptionLabel={(t) => `${t.name}`}
                            renderInput={(params) => (
                                <TextField {...params} label="Individual" />
                            )}
                            onChange={(event, newValue) => {
                                setCurSelect(2);
                                setState({ player: newValue });
                            }}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel id="select-multiple-action-label">Actions</InputLabel>
                        <Select
                            labelId="select-multiple-action-label"
                            id="select-multiple-action"
                            multiple
                            value={action}
                            onChange={handleChangeAction}
                            input={<OutlinedInput id="select-multiple-action" label="Actions" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value, idx) => (
                                        <Chip key={idx} label={value?.name} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {actionList.map((a, idx) =>
                                <MenuItem key={idx} value={a} style={getStyles(a, action, theme)}>{a?.name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel id="select-multiple-actiontype-label">Action Types</InputLabel>
                        <Select
                            labelId="select-multiple-actiontype-label"
                            id="select-multiple-actiontype"
                            multiple
                            value={actionType}
                            onChange={handleChangeActionType}
                            input={<OutlinedInput id="select-multiple-actiontype" label="Action Types" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value, idx) => (
                                        <Chip key={idx} label={value?.name} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {actionTypeList.map((a, idx) =>
                                <MenuItem key={idx} value={a} style={getStyles(a, actionType, theme)}>{a?.name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel id="select-multiple-action-label">Action Results</InputLabel>
                        <Select
                            labelId="select-multiple-action-label"
                            id="select-multiple-action"
                            multiple
                            value={actionResult}
                            onChange={handleChangeActionResult}
                            input={<OutlinedInput id="select-multiple-action" label="Action Results" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value, idx) => (
                                        <Chip key={idx} label={value?.name} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {actionResultList.map((a, idx) =>
                                <MenuItem key={idx} value={a} style={getStyles(a, actionResult, theme)}>{a?.name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleOpen(false)}>Close</Button>
                <Button onClick={() => handleSearch()}>Search</Button>
            </DialogActions>
        </Dialog >

    );
}

export default CreateEditDialog;