import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeftOutlined';
import { TEAM_ICON_DEFAULT } from '../../../common/staticData';

import GameService from '../../../services/game.service';
import { LoadingProgress } from '../components/common';
import GameOverview from './tabs/overview';

const Tabs = ['Overview', 'Summary', 'Stats', 'Players'];

const GamePage = () => {
    const params = useParams();
    const [values, setValues] = useState({
        game: {},
        tabSelected: 0,
        loading: false,
        loadingDone: false,
        curTab: 0
    });

    const getFormattedDate = (date) => {
        const old_format = date.match(/\d\d\d\d-\d\d-\d\d/) + '';
        const array = old_format.split('-');

        return `${array[2]} / ${array[1]} / ${array[0]}`;
    };

    const handleTabClick = (idx) => {
        setValues({ ...values, curTab: idx });
    };

    useEffect(() => {
        const pathname = window.location.pathname;

        if (pathname.match(/\/new_coach\/games\//) !== null) {
            setValues({ ...values, loading: true });
            GameService.getGameById(params.gameId).then((res) => {
                setValues({ ...values, game: res, loading: false, loadingDone: true });
            });
        }
    }, [params.gameId]);

    console.log('GamePage => ', values.game);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            {values.loadingDone && (
                <>
                    <Box sx={{ padding: '24px 24px 24px 48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px', 'svg path': { fill: 'black' } }}>
                                <Link to="/new_coach/games">
                                    <ChevronLeftIcon sx={{ width: '30px', height: '30px' }} />
                                </Link>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>Game</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 16px' }}>
                                    <img style={{ width: '20px' }} src={values.game.home_team_image ? values.game.home_team_image : TEAM_ICON_DEFAULT} />
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '18px', fontWeight: 700, color: '#1a1b1d' }}>{values.game.home_team_name}</Typography>
                                </Box>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>VS</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 16px', background: 'white' }}>
                                    <img style={{ width: '20px' }} src={values.game.away_team_image ? values.game.away_team_image : TEAM_ICON_DEFAULT} />
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '18px', fontWeight: 700, color: '#1a1b1d' }}>{values.game.away_team_name}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '400px', padding: '4px 8px' }}>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>{getFormattedDate(values.game.date)}</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>{values.game.league_name}</Typography>
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>{values.game.season_name}</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '32px', paddingLeft: '56px' }}>
                            {Tabs.map((tab, index) => (
                                <Box
                                    key={index}
                                    onClick={() => handleTabClick(index)}
                                    sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '8px', width: 'fit-content', cursor: 'pointer' }}
                                >
                                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '18px', fontWeight: 700, color: '#1a1b1d' }}>{tab}</Typography>
                                    <Box sx={{ width: '100%', height: '2px', backgroundColor: values.curTab === index ? '#0A7304' : '#F8F8F8' }} />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    {values.curTab === 0 && <GameOverview game={values.game} />}
                </>
            )}
            {values.loading && <LoadingProgress />}
        </Box>
    );
};

export default GamePage;
