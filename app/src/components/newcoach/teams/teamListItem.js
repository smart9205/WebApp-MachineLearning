import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import PlayersIcon from '@mui/icons-material/PersonOutlineOutlined';
import SortIcon from '@mui/icons-material/SortOutlined';

import { TEAM_ICON_DEFAULT } from '../../../common/staticData';

const TeamListItem = ({ row, isHover }) => {
    const getTeamPath = (id) => {
        return `/new_coach/teams/${id}`;
    };

    return (
        <Link to={getTeamPath(row.id)}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <img style={{ height: '48px' }} src={row.team_image ? row.team_image : TEAM_ICON_DEFAULT} alt="Team Logo" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 3, padding: '0 8px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>{row.team_name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 4, padding: '0 8px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>{row.league_name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 7, padding: '0 8px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>{row.season_name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 2, marginLeft: '8px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', 'svg path': { fill: '#FE5E00' } }}>
                        <PlayersIcon />
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '4px' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#a5a5a8' }}>Players</Typography>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>{row.player_count}</Typography>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            'svg path': { fill: '#A5A5A8' },
                            '&:hover': { 'svg path': { fill: '#1a1b1d' } }
                        }}
                    >
                        <SortIcon />
                    </Box>
                </Box>
            </Box>
        </Link>
    );
};

export default TeamListItem;