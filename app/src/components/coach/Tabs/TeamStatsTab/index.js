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

const TeamStatsTab = ({ gameList, team }) => {

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
        const gameIds = games.map(g => g.id).join(",")
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
                            <Typography sx={{ textAlign: 'center', fontSize: '0.75rem' }}>{team?.team_name ?? "My Team"}:</Typography>
                            <Typography sx={{ textAlign: 'center', fontSize: '0.75rem' }}>{team_score ?? 0}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: "space-evenly", m: 2 }}>
                            <Typography sx={{ textAlign: 'center', fontSize: '0.75rem' }}>{"Opponents"}:</Typography>
                            <Typography sx={{ textAlign: 'center', fontSize: '0.75rem' }}>{opponent_score ?? 0}</Typography>
                        </Box>
                    </Card>

                    <Card sx={{ m: 1 }}>
                        <PlayersTab gameIds={games.map(g => g.id).join(",")} teamId={team.team_id} />
                    </Card>
                </Box>
                <Grid container>
                    {[0, 1, 2].map(i =>
                        <Grid sm={6} md={4}>
                            {RULE.filter((r, a) => a % 3 === i).map((rule, idx) =>
                                <Card sx={{ m: 0.5, fontSize: "0.75rem" }}>
                                    <Typography sx={{ textAlign: 'center', backgroundColor: 'lightgray' }}>{rule.title}</Typography>
                                    <Table responsive="sm" striped borderless hover size="sm" className='text-uppercase coach-actionlist-table'>
                                        <tbody className='text-center' style={{ m: 0 }}>
                                            {!!rule?.successful && <tr>
                                                {rule.title === "Shot" ?
                                                    <>
                                                        <td></td>
                                                        <td><p>On Target</p></td>
                                                        <td><p>Off Target</p></td>
                                                    </>
                                                    :
                                                    <>
                                                        <td></td>
                                                        <td><p>Successful</p></td>
                                                        <td><p>Unsuccessful</p></td>
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
                                                return (
                                                    <tr key={i}>
                                                        <td style={{ width: "20%", minWidth: 120 }}><p>{type.title}</p></td>
                                                        <td
                                                            width="40%"
                                                        >
                                                            <span style={success.length > 0 ? { color: "#007200" } : {}}>
                                                                {success.length}
                                                            </span>{" "}
                                                            (avg:{(success.length / games.length) || 0})
                                                        </td>
                                                        {
                                                            !!rule?.successful &&
                                                            <td
                                                                width="40%"
                                                            >
                                                                <span style={unsuccess.length > 0 ? { color: "red" } : {}}>
                                                                    {unsuccess.length}
                                                                </span>{" "}
                                                                (avg:{(unsuccess.length / games.length) || 0})
                                                            </td>
                                                        }
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </Card>)}
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Box >
    );
}

export default TeamStatsTab;