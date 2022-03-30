import React, { useEffect, useState, useReducer } from "react";
import moment from 'moment'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";


import { Table, } from 'react-bootstrap'

import { RULE } from '../../../../common/staticData';
import gameService from "../../../../services/game.service";
import PlayersTab from "./PlayersTab";

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

const PlayerStatsTab = ({ gameList, team }) => {

    const [games, setGames] = useState([]);
    const [tagList, setTagList] = useState([])
    const [data, setData] = useReducer((old, action) => ({ ...old, ...action }), {
        team_score: 0,
        opponent_score: 0
    })

    const { team_score, opponent_score } = data

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;

        if (value[value.length - 1] === "all") {
            setGames(gameList);
            return;
        }
        setGames(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    useEffect(() => {
        console.log("games", games, team)
        const gameIds = games.length > 0 ? games.map(g => g.id).join(",") : 0;
        gameService.getScoreInGames(gameIds, team?.team_id ?? 0).then(res => {
            setData({ team_score: res.team_score, opponent_score: res.opponent_score })
        })
        gameService.getAllPlayerTagsByTeam(team?.team_id ?? 0, gameIds).then(res => {
            console.log("getAllPlayerTagsByTeam", res)
            setTagList(res)
        })
    }, [games])

    return (
        <Box sx={{ width: "100%" }}>
            <FormControl sx={{ width: 600 }}>
                <InputLabel id="game-multiple-checkbox-label">Games</InputLabel>
                <Select
                    labelId="game-multiple-checkbox-label"
                    id="game-multiple-checkbox"
                    multiple
                    value={games}
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {`${selected.length} games selected`}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    <MenuItem value="all">
                        <Checkbox
                            checked={gameList.length > 0 && games.length === gameList.length}
                            indeterminate={games.length > 0 && games.length < gameList.length}
                            onChange={e => !e.target.checked && setGames([])}
                        />
                        <ListItemText
                            primary={'Select All'}
                        />
                    </MenuItem>
                    {gameList.map((g) => (
                        <MenuItem key={g.id} value={g}>
                            <Checkbox checked={games.indexOf(g) > -1} />
                            <ListItemText primary={`${moment(g.date).format('DD MMM, YYYY')} ${g.home_team_name} VS ${g.away_team_name}`} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box sx={{ display: 'flex' }}>
                <Box sx={{ width: "20%" }}>
                    <Card sx={{ m: 1, }}>
                        <Typography sx={{ textAlign: 'center', backgroundColor: 'lightgray' }}>{"Goals"}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: "space-evenly", m: 2 }}>
                            <Typography sx={{ textAlign: 'center', fontSize: '0.8rem' }}>{team?.team_name ?? "My Team"}:</Typography>
                            <Typography sx={{ textAlign: 'center', fontSize: '0.8rem' }}>{team_score ?? 0}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: "space-evenly", m: 2 }}>
                            <Typography sx={{ textAlign: 'center', fontSize: '0.8rem' }}>{"Opponents"}:</Typography>
                            <Typography sx={{ textAlign: 'center', fontSize: '0.8rem' }}>{opponent_score ?? 0}</Typography>
                        </Box>
                    </Card>

                    <Card sx={{ m: 1 }}>
                        <PlayersTab gameIds={games.length > 0 ? games.map(g => g.id).join(",") : 0} teamId={team.team_id} />
                    </Card>
                </Box>
                <Grid container>
                    {RULE.map((rule, idx) => {
                        let sum_success = 0, sum_unsuccess = 0
                        return <Grid sm={4} md={3}>
                            <Card sx={{ marginBlock: 0.5, fontSize: "0.8rem", maxWidth: "21rem", marginInline: "auto" }}>
                                <Typography sx={{ textAlign: 'center', backgroundColor: 'lightgray' }}>{rule.title}</Typography>
                                <Table responsive="sm" striped borderless hover size="sm" className='text-uppercase coach-actionlist-table'>
                                    <tbody className='text-center' style={{ m: 0 }}>
                                        {!!rule?.successful && <tr>
                                            {rule.title === "Shot" ?
                                                <>
                                                    <td></td>
                                                    <td><p style={{ fontWeight: "bold" }}>On Target</p></td>
                                                    <td><p style={{ fontWeight: "bold" }}>Off Target</p></td>
                                                </>
                                                :
                                                <>
                                                    <td></td>
                                                    <td><p style={{ fontWeight: "bold" }}>Successful</p></td>
                                                    <td><p style={{ fontWeight: "bold" }}>Unsuccessful</p></td>
                                                </>
                                            }
                                        </tr>}
                                        {rule.row.map((type, i) => {
                                            const data = !!tagList ? tagList.filter(t =>
                                                (RULE[idx]?.opponent === (t.team_id !== team?.team_id ?? 0)) &&
                                                t.action_id === type.action_id &&
                                                (!type?.action_result_id ? true : type.action_result_id.includes(t.action_result_id)) &&
                                                (!type?.action_type_id ? true : type.action_type_id.includes(t.action_type_id))
                                            ) : []
                                            const success = data.filter(f => !rule?.successful ? true : rule?.successful.includes(f.action_result_id))
                                            const unsuccess = data.filter(f => !rule?.unsuccessful ? true : rule?.unsuccessful.includes(f.action_result_id))
                                            sum_success += success.length
                                            sum_unsuccess += unsuccess.length
                                            return (<>
                                                <tr key={i}>
                                                    <td style={{ width: "20%", minWidth: 120 }}><p>{type.title}</p></td>
                                                    <td
                                                        width="40%"
                                                    >
                                                        <span style={success.length > 0 ? { color: "#007200" } : {}}>
                                                            {success.length}
                                                        </span>{" "}
                                                        ({games.length > 0 ? (success.length / games.length) || 0 : 0})
                                                    </td>
                                                    {
                                                        !!rule?.successful &&
                                                        <td
                                                            width="40%"
                                                        >
                                                            <span style={unsuccess.length > 0 ? { color: "red" } : {}}>
                                                                {unsuccess.length}
                                                            </span>{" "}
                                                            ({games.length > 0 ? (unsuccess.length / games.length) || 0 : 0})
                                                        </td>
                                                    }
                                                </tr>
                                                {!!rule?.successful && rule.row.length === i + 1 &&
                                                    <tr key={i + 1}>
                                                        <td></td>
                                                        <td style={{ fontWeight: "bold", color: "#007200" }}>
                                                            {(sum_success / (sum_success + sum_unsuccess) * 100 || 0).toFixed(1)}%
                                                        </td>
                                                        <td style={{ fontWeight: "bold", color: "red" }}>
                                                            {(sum_unsuccess / (sum_success + sum_unsuccess) * 100 || 0).toFixed(1)}%
                                                        </td>
                                                    </tr>
                                                }
                                            </>)
                                        })}
                                    </tbody>
                                </Table>
                            </Card>
                        </Grid>
                    })}
                </Grid>
            </Box>
        </Box >
    );
}

export default PlayerStatsTab;