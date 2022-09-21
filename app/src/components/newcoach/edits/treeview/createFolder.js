import React, { useState } from 'react';
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

import GameService from '../../../../services/game.service';
import { stableSort, getComparator } from '../../components/utilities';
import { getTreeViewData } from '.';

const EditCreateUserFolderEdit = ({ open, onClose, updateList, isFolder, node }) => {
    const [folderName, setFolderName] = useState('');

    const handleCreateFolder = async () => {
        let bigSort = 0;
        const type = isFolder ? 'Folder' : 'Edit';

        await GameService.getBiggestSortNumber(type, node?.id ?? null).then((res) => {
            bigSort = res['biggest_order_num'] === null ? 0 : res['biggest_order_num'];
        });

        if (isFolder) await GameService.createUserFolder({ name: folderName, parent_id: node !== null && node.type === 'folder' ? node.id : null, order: bigSort + 1 });
        else await GameService.createUserEdit({ name: folderName, parent_id: node !== null && node.type === 'folder' ? node.id : null, order: bigSort + 1 });

        await GameService.getAllFolders().then((res) => {
            const ascArray = stableSort(res, getComparator('asc', 'id'));

            onClose();
            updateList(getTreeViewData(ascArray));
        });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 500, color: '#1a1b1d' }}>Create New {isFolder ? 'Folder' : 'Edit'}</Typography>
            </DialogTitle>
            <DialogContent dividers={true}>
                <TextField
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleCreateFolder();
                        }
                    }}
                    label=""
                    autoFocus
                    inputProps={{ 'aria-label': 'Without label' }}
                    placeholder="New Folder Name"
                    variant="outlined"
                    sx={{ borderRadius: '10px', height: '48px', width: '300px', '& legend': { display: 'none' }, '& fieldset': { top: 0 } }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="outlined" onClick={() => handleCreateFolder()}>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCreateUserFolderEdit;