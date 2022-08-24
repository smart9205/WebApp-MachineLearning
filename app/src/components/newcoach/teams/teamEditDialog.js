import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Dialog, DialogContent, DialogTitle, TextField, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { ColorPicker } from 'material-ui-color';

import CloseIcon from '@mui/icons-material/CloseOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';

import { TEAM_ICON_DEFAULT } from '../../../common/staticData';
import { SaveButton, LoadingProgress } from '../components/common';
import UploadButton from '../components/uploadButton';
import lang from '../../../assets/lang.json';
import GameService from '../../../services/game.service';

const TeamEditDialog = ({ open, onClose, team }) => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        id: 0,
        name: '',
        image: '',
        team_color: '',
        second_color: '',
        sponsor_logo: '',
        sponsor_url: '',
        show_sponsor: false,
        create_highlights: false,
        team_language: 'en',
        filter_by_position: false
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (prop) => (e) => {
        setValues({ ...values, [prop]: e.target.value });
    };

    const saveChanges = () => {
        setLoading(true);
        GameService.updateTeam(values)
            .then((res) => {
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
            });
        onClose();
        navigate('/new_coach/teams/');
    };

    useEffect(() => {
        setValues({
            ...values,
            id: team.team_id,
            name: team.team_name,
            image: team.team_image,
            team_color: team.team_color,
            second_color: team.second_color,
            sponsor_logo: team.sponsor_logo,
            sponsor_url: team.sponsor_url,
            show_sponsor: team.show_sponsor,
            create_highlights: team.create_highlights,
            team_language: team.team_language,
            filter_by_position: team.filter_by_position
        });
    }, [team]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" maxheight="initial">
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', cursor: 'pointer' }} onClick={onClose}>
                    <CloseIcon sx={{ width: '14px', height: '14px' }} />
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#1a1b1d' }}>Close</Typography>
                </Box>
            </DialogTitle>
            <DialogContent style={{ display: 'flex', margin: '0 200px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '32px', paddingBottom: '42px' }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>Edit Team</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '8px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '20px', fontWeight: 700, color: '#1a1b1d' }}>Team Logo</Typography>
                        <UploadButton
                            class_name="upload-team-view"
                            id_name="team-logo"
                            dirName={process.env.REACT_APP_DIR_TEAM}
                            img={values.image}
                            onURL={(url) => setValues({ ...values, image: url })}
                            defaultImage={TEAM_ICON_DEFAULT}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '8px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '20px', fontWeight: 700, color: '#1a1b1d' }}>Sponsor Logo</Typography>
                        <UploadButton
                            class_name="upload-sponsor-view"
                            id_name="sponsor-logo"
                            dirName={process.env.REACT_APP_DIR_TEAM}
                            img={values.sponsor_logo}
                            onURL={(url) => setValues({ ...values, sponsor_logo: url })}
                            defaultImage={TEAM_ICON_DEFAULT}
                        />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d', marginLeft: '16px' }}>Team Language</Typography>
                    <Select
                        value={values.team_language}
                        onChange={handleChange('team_language')}
                        label=""
                        variant="outlined"
                        IconComponent={ExpandMoreIcon}
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ outline: 'none', height: '48px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                    >
                        {lang.map((item, index) => (
                            <MenuItem key={index} value={item.code}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d', marginLeft: '16px' }}>Team Color</Typography>
                        <ColorPicker
                            defaultValue="transparent"
                            value={values.team_color}
                            onChange={(color) => setValues({ ...values, team_color: '#' + color.hex })}
                            style={{ '& .ColorPicker-MuiInputBase-input': { color: '#1a1b1d' } }}
                        />
                        <FormControlLabel
                            sx={{ mt: 1 }}
                            control={
                                <Switch
                                    checked={values.create_highlights}
                                    onChange={() => setValues({ ...values, create_highlights: !values.create_highlights })}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            }
                            label="Create Highlights"
                        />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d', marginLeft: '16px' }}>Second Color</Typography>
                        <ColorPicker
                            defaultValue="transparent"
                            value={values.second_color}
                            onChange={(color) => setValues({ ...values, second_color: '#' + color.hex })}
                            style={{ '& .ColorPicker-MuiInputBase-input': { color: '#1a1b1d' } }}
                        />
                        <FormControlLabel
                            sx={{ mt: 1 }}
                            control={
                                <Switch
                                    checked={values.filter_by_position}
                                    onChange={() => setValues({ ...values, filter_by_position: !values.filter_by_position })}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            }
                            label="Filter by Position"
                        />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d', marginLeft: '16px' }}>Sponsor URL</Typography>
                    <TextField
                        value={values.sponsor_url}
                        onChange={handleChange('sponsor_url')}
                        label=""
                        inputProps={{ 'aria-label': 'Without label' }}
                        variant="outlined"
                        placeholder="Sponsor URL"
                        sx={{ borderRadius: '10px', height: '48px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                    />
                    <FormControlLabel
                        sx={{ mt: 1 }}
                        control={<Switch checked={values.show_sponsor} onChange={() => setValues({ ...values, show_sponsor: !values.show_sponsor })} inputProps={{ 'aria-label': 'controlled' }} />}
                        label="Show Sponsor"
                    />
                </Box>
                <SaveButton onClick={saveChanges} sx={{ width: '300px', fontSize: '16px' }}>
                    Save changes
                </SaveButton>
                {loading && <LoadingProgress />}
            </DialogContent>
        </Dialog>
    );
};

export default TeamEditDialog;
