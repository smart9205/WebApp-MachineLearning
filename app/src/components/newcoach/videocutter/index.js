import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import EditFolderTreeView from '../edits/treeview';
import VCVideoPlayer from './videoplayer';
import EditTagTable from '../edits/tagtable';
import GameService from '../../../services/game.service';

const VideoCutter = () => {
    const [curEdit, setCurEdit] = useState(null);
    const [editTagList, setEditTagList] = useState([]);
    const [tagLoading, setTagLoading] = useState(false);
    const [curTagIdx, setCurTagIdx] = useState(-1);
    const [refresh, setRefresh] = useState(false);

    const handleClickRow = (index) => {
        setCurTagIdx(index);
    };

    const handleSort = async (rows) => {
        await GameService.updateEditClipsSort(rows);
        await GameService.getEditClipsByUserEditId(curEdit.id).then((res) => {
            setEditTagList(res);
        });
    };

    useEffect(() => {
        setEditTagList([]);
        setCurTagIdx(-1);

        if (curEdit !== null && curEdit.type === 'edit') {
            setTagLoading(true);
            GameService.getEditClipsByUserEditId(curEdit.id).then((res) => {
                setEditTagList(res);
                setTagLoading(false);
                setCurTagIdx(0);
            });
        }
    }, [curEdit]);

    useEffect(() => {
        setEditTagList([]);

        if (curEdit !== null && curEdit.type === 'edit') {
            GameService.getEditClipsByUserEditId(curEdit.id).then((res) => {
                setEditTagList(res);
                setRefresh(false);
            });
        }
    }, [refresh]);

    return (
        <Box sx={{ width: '98%', margin: '0 auto' }}>
            <Box sx={{ padding: '24px 24px 48px 48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 700, color: '#1a1b1d' }}>Video Cutter</Typography>
            </Box>
            <Box sx={{ display: 'flex', maxHeight: '85vh', height: '85vh', background: 'white', overflowY: 'auto' }}>
                <div style={{ display: 'flex', padding: '12px 0' }}>
                    <EditFolderTreeView setEdit={setCurEdit} isMain={true} entireHeight="95%" treeHeight="90%" />
                    <EditTagTable
                        loading={tagLoading}
                        tagList={editTagList}
                        setIdx={handleClickRow}
                        selected={curTagIdx}
                        sort={handleSort}
                        name={curEdit?.name ?? ''}
                        update={setEditTagList}
                        showPlay={true}
                    />
                </div>
                <VCVideoPlayer saveEdit={curEdit} drawOpen={true} updateList={setRefresh} />
            </Box>
        </Box>
    );
};

export default VideoCutter;