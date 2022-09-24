import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import ExportIcon from '../../../../assets/Export.svg';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentCutIcon from '@mui/icons-material/ContentCut';

import CoachTeamTagTable from './teamTagTable';
import { editCreateCommand, toSecond } from '../../components/utilities';
import GameService from '../../../../services/game.service';
import EditFolderTreeView from '../treeview';

const EditTagTable = ({ loading, tagList, setIdx, selected, sort, name, update }) => {
    const [teamTagList, setTeamTagList] = useState([]);
    const [checkArray, setCheckArray] = useState([]);
    const [eventName, setEventName] = useState('');
    const [controlEdit, setControlEdit] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleRender = () => {
        let newList = [];
        const temp = checkArray.length === 0 ? teamTagList : teamTagList.filter((item) => checkArray.includes(item.id) === true);

        temp.map((tag) => {
            let last = newList.at(-1);

            if (last && toSecond(last?.end_time ?? 0) >= toSecond(tag.start_time) && toSecond(last?.start_time ?? 0) <= toSecond(tag.start_time)) {
                last.end_time = last.end_time > tag.end_time ? last.end_time : tag.end_time;
            } else {
                newList.push({ ...tag });
            }
        });

        editCreateCommand(newList, name);
    };

    const handleDelete = () => {
        if (checkArray.length === 0) {
            window.alert('Please select clips to delete');

            return;
        }

        const deleteList = teamTagList.filter((item) => checkArray.includes(item.id) === true);
        const newList = teamTagList.filter((item) => checkArray.includes(item.id) === false);

        setTeamTagList(newList);
        update(newList);
        deleteList.map(async (item) => await GameService.deleteEditClip(item.id));
    };

    const handleCopy = async () => {
        setEventName('copy');

        if (checkArray.length === 0) {
            window.alert('Please select clips to copy to other edit');

            return;
        }

        if (controlEdit === null) {
            setDialogOpen(true);

            return;
        }

        let newList = teamTagList.filter((item) => checkArray.includes(item.id) === true).map((item) => item.id);

        await GameService.copyEditClips(newList.join(','), controlEdit.id);
        setControlEdit(null);
        setEventName('');

        return;
    };

    const handleMove = async () => {
        setEventName('move');

        if (checkArray.length === 0) {
            window.alert('Please select clips to move to other edit');

            return;
        }

        if (controlEdit === null) {
            window.alert('Please select edit');
            setDialogOpen(true);

            return;
        }

        if (controlEdit.type !== 'edit') {
            window.alert('You selected folder. Please select edit correctly.');
            setDialogOpen(true);

            return;
        }

        const moveList = teamTagList.filter((item) => checkArray.includes(item.id) === true).map((item) => item.id);
        const newList = teamTagList.filter((item) => checkArray.includes(item.id) === false);

        setTeamTagList(newList);
        update(newList);
        await GameService.moveEditClips(moveList.join(','), controlEdit.id);
        setControlEdit(null);
        setEventName('');
    };

    const handleSave = () => {
        if (controlEdit === null) {
            window.alert("You didn't select any edit. Please select.");

            return;
        }

        setDialogOpen(false);
        eventName === 'copy' ? handleCopy() : handleMove();
    };

    const handleClose = () => {
        setControlEdit(null);
        setDialogOpen(false);
    };

    useEffect(() => {
        setTeamTagList(tagList);
    }, [tagList]);

    console.log(checkArray);

    return (
        <Box sx={{ width: '500px', height: '100%', padding: '16px 8px', borderLeft: '1px solid #E8E8E8', textAlign: 'center' }}>
            {loading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {!loading && (
                <>
                    {teamTagList.length === 0 && (
                        <Box sx={{ width: '100%', height: '5vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>No Tags</Typography>
                        </Box>
                    )}
                    {teamTagList.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                            <Button variant="contained" sx={{ width: '110px', background: '#C5EAC6', '&:hover': { background: '#0A7304' } }} onClick={handleRender}>
                                <img src={ExportIcon} />
                                Render
                            </Button>
                            <Button variant="contained" sx={{ width: '110px', background: '#C5EAC6', '&:hover': { background: '#0A7304' } }} onClick={handleMove}>
                                <ContentCutIcon />
                                Move
                            </Button>
                            <Button variant="contained" sx={{ width: '110px', background: '#C5EAC6', '&:hover': { background: '#0A7304' } }} onClick={handleCopy}>
                                <ContentCopyIcon />
                                Copy
                            </Button>
                            <Button variant="contained" sx={{ width: '110px', background: '#C5EAC6', '&:hover': { background: '#0A7304' } }} onClick={handleDelete}>
                                <DeleteIcon />
                                Delete
                            </Button>
                        </Box>
                    )}
                    {tagList.length > 0 && teamTagList.length > 0 && (
                        <CoachTeamTagTable tagList={teamTagList} setIndex={setIdx} selectIdx={selected} handleSort={sort} updateTable={update} setChecks={setCheckArray} />
                    )}
                    <Dialog open={dialogOpen} onClose={() => handleClose()} scroll="paper">
                        <DialogTitle>
                            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1a1b1d' }}>Select Edit</Typography>
                        </DialogTitle>
                        <DialogContent dividers={true} style={{ display: 'flex' }}>
                            <EditFolderTreeView setEdit={setControlEdit} isMain={false} entireHeight="400px" treeHeight="100%" />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleClose()}>Cancel</Button>
                            <Button variant="outlined" onClick={() => handleSave()}>
                                {eventName === 'copy' ? 'Copy' : 'Move'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Box>
    );
};

export default EditTagTable;
