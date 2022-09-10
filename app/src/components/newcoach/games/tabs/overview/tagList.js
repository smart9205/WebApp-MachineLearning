import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

import GameTagListItem from './tagListItem';

const GameTagList = ({ isLoading, expand, tagList, curTagListIdx, isAction, checkArr, onChecked, onVideo }) => {
    return tagList.length > 0 ? (
        <Box sx={{ overflowY: 'auto', maxHeight: expand ? '15vh' : '50vh', minHeight: '15vh' }}>
            <Box sx={{ margin: '0 4px 8px 0', width: 'calc(100% - 4px)' }}>
                {tagList.map((tag, index) => (
                    <GameTagListItem
                        key={index}
                        item={tag}
                        isSelected={curTagListIdx === index}
                        displayAction={isAction}
                        idx={index}
                        isChecked={checkArr[index]}
                        onChecked={onChecked}
                        onShowVideo={onVideo}
                    />
                ))}
            </Box>
        </Box>
    ) : (
        <Box sx={{ overflowY: 'auto', maxHeight: expand ? '15vh' : '50vh', minHeight: expand ? '15vh' : '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isLoading && (
                <div style={{ width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            {tagList.length === 0 && !isLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '80%' }}>
                    <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: '20px', fontWeight: 700, color: '#1a1b1d' }}>No Data to Display</Typography>
                </Box>
            )}
        </Box>
    );
};

export default GameTagList;