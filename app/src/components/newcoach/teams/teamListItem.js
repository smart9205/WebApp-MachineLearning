import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import PlayersIcon from '@mui/icons-material/PersonOutlineOutlined';
import SortIcon from '@mui/icons-material/SortOutlined';

import { TEAM_ICON_DEFAULT } from '../../../common/staticData';
import TeamEditDialog from './teamEditDialog';

const TeamListItem = ({ row, isHover }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleChangePath = (teamId, seasonId, leagueId) => () => {
        navigate(`/new_coach/teams/${btoa(`${teamId}|${seasonId}|${leagueId}`)}`);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    return (
        <Box
            sx={{
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
                backgroundColor: 'white',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s ease',
                minWidth: '850px',
                fontWeight: 500,
                height: '70px',
                width: '100%',
                boxShadow: isHover ? '0px 4px 16px rgba(0, 0, 0, 0.1)' : 'none'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 22 }} onClick={handleChangePath(row.team_id, row.season_id, row.league_id)}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <img style={{ height: '48px' }} src={row.team_image ? row.team_image : TEAM_ICON_DEFAULT} alt="Team Logo" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 3, padding: '0 8px' }}>
                    <p className="normal-text">{row.team_name}</p>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 3, padding: '0 8px' }}>
                    <p className="normal-text">{row.league_name}</p>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 3, padding: '0 8px' }}>
                    <p className="normal-text">{row.season_name}</p>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px', flex: 2, padding: '0 8px' }}>
                    <p className="normal-text">GAMES</p>
                    <p className="normal-text">{row.total_game_played}</p>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px', flex: 2, padding: '0 8px' }}>
                    <p className="normal-text">WON</p>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#52B030', borderRadius: '12px', width: '24px', height: '24px' }}>
                            <p className="normal-text">W</p>
                        </Box>
                        <p className="normal-text">{row.won}</p>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px', flex: 2, padding: '0 8px' }}>
                    <p className="normal-text">DRAW</p>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#A4AAB0', borderRadius: '12px', width: '24px', height: '24px' }}>
                            <p className="normal-text">D</p>
                        </Box>
                        <p className="normal-text">{row.draw}</p>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px', flex: 2, padding: '0 8px' }}>
                    <p className="normal-text">LOSE</p>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#C1272D', borderRadius: '12px', width: '24px', height: '24px' }}>
                            <p className="normal-text">L</p>
                        </Box>
                        <p className="normal-text">{row.lost}</p>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px', flex: 2, padding: '0 8px' }}>
                    <p className="normal-text">GOALS</p>
                    <p className="normal-text">{row.goals}</p>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', 'svg path': { fill: '#FE5E00' }, marginLeft: '8px', flex: 2 }}>
                    <PlayersIcon />
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '4px' }}>
                        <p className="normal-text">Players</p>
                        <p className="normal-text">{row.player_count}</p>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flex: 0.5,
                    'svg path': { fill: '#A5A5A8' },
                    '&:hover': { 'svg path': { fill: '#0A7304' } }
                }}
                onClick={() => setOpen(true)}
            >
                <SortIcon />
            </Box>
            <TeamEditDialog open={open} onClose={handleCloseDialog} team={row} />
        </Box>
    );
};

export default TeamListItem;
