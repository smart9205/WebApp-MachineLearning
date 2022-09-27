import { Dialog, DialogContent, DialogTitle, Box, Typography, FormControlLabel, Switch, Select, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { SaveButton } from '../components/common';
import UploadButton from '../components/uploadButton';
import GameService from '../../../services/game.service';
import { MenuProps } from '../components/common';

import CloseIcon from '@mui/icons-material/CloseOutlined';
import { TEAM_ICON_DEFAULT } from '../../../common/staticData';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';

const GameEditPage = ({ open, onClose, game, updateGameList }) => {
    const [values, setValues] = useState({
        image: '',
        mute: false,
        homeStanding: {},
        awayStanding: {},
        standingList: []
    });

    const saveChanges = () => {
        GameService.updateGame({
            id: game.id,
            image: values.image,
            season_id: game.season_id,
            league_id: game.league_id,
            home_team_id: game.home_team_id,
            home_team_standing_id: values.homeStanding.id,
            away_team_id: game.away_team_time,
            away_team_standing_id: values.awayStanding.id,
            date: game.date,
            video_url: game.video_url,
            mobile_video_url: game.mobile_video_url,
            mute_video: values.mute
        }).then(() => {
            onClose();
            updateGameList(true);
        });
    };

    const handleSelectChange = (isHome) => (e) => {
        if (isHome) setValues({ ...values, homeStanding: e.target.value });
        else setValues({ ...values, awayStanding: e.target.value });
    };

    useEffect(() => {
        setValues({
            ...values,
            image: game.image,
            mute: game.mute_video
        });
    }, [game]);

    useEffect(() => {
        GameService.getTeamInitialStanding().then((res) => {
            setValues({ ...values, standingList: res });
        });
    }, []);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="2000px" maxheight="initial">
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '28px', fontWeight: 700, color: '#1a1b1d' }}>Edit Game</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', cursor: 'pointer' }} onClick={onClose}>
                        <CloseIcon sx={{ width: '18px', height: '18px' }} />
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a1b1d' }}>Close</Typography>
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent style={{ display: 'flex', margin: '0 24px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                        <UploadButton
                            class_name="upload-game-view"
                            id_name="game-logo"
                            dirName={process.env.REACT_APP_DIR_GAME}
                            img={values.image}
                            onURL={(url) => setValues({ ...values, image: url })}
                            defaultImage={TEAM_ICON_DEFAULT}
                        />
                        <FormControlLabel
                            sx={{ mt: 1 }}
                            control={<Switch checked={values.mute} onChange={() => setValues({ ...values, mute: !values.mute })} inputProps={{ 'aria-label': 'controlled' }} />}
                            label="Mute Video"
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img src={game.home_team_image ? game.home_team_image : TEAM_ICON_DEFAULT} style={{ height: '36px' }} />
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>{game.home_team_goals}</Typography>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>{game.home_team_name}</Typography>
                            </div>
                            <Select
                                value={values.homeStanding}
                                onChange={handleSelectChange(true)}
                                label=""
                                variant="outlined"
                                IconComponent={ExpandMoreIcon}
                                inputProps={{ 'aria-label': 'Without label' }}
                                MenuProps={MenuProps}
                                sx={{ outline: 'none', height: '36px', width: '200px', textAlign: 'center', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                            >
                                {values.standingList.map((stand, index) => (
                                    <MenuItem key={index} value={stand}>
                                        {stand.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E8E8E8', borderRadius: '8px', width: '300px', height: '400px' }}>
                                {values.homeStanding.image && values.homeStanding.image.length > 0 && (
                                    <img src={values.homeStanding.image} style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img src={game.away_team_image ? game.away_team_image : TEAM_ICON_DEFAULT} style={{ height: '36px' }} />
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>{game.away_team_goals}</Typography>
                                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#1a1b1d' }}>{game.away_team_name}</Typography>
                            </div>
                            <Select
                                value={values.awayStanding}
                                onChange={handleSelectChange(false)}
                                label=""
                                variant="outlined"
                                IconComponent={ExpandMoreIcon}
                                inputProps={{ 'aria-label': 'Without label' }}
                                MenuProps={MenuProps}
                                sx={{ outline: 'none', height: '36px', width: '200px', textAlign: 'center', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                            >
                                {values.standingList.map((stand, index) => (
                                    <MenuItem key={index} value={stand}>
                                        {stand.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E8E8E8', borderRadius: '8px', width: '300px', height: '400px' }}>
                                {values.awayStanding.image && values.awayStanding.image.length > 0 && (
                                    <img src={values.awayStanding.image} style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <SaveButton
                    disabled={
                        values.image === game.image && values.mute === game.mute_video && values.homeStanding.id === game.home_team_standing_id && values.awayStanding.id === game.away_team_standing_id
                    }
                    onClick={saveChanges}
                    sx={{ width: '300px', fontSize: '14px' }}
                >
                    Save changes
                </SaveButton>
            </DialogContent>
        </Dialog>
    );
};

export default GameEditPage;
