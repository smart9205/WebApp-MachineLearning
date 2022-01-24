import React, { useState, useEffect, useContext } from 'react';
import { Col, Container, ProgressBar, Row, Tab, Table, Tabs } from 'react-bootstrap'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { makeStyles } from '@mui/styles';
import TagVideo from './TagVideo';
import GameService from "../../services/game.service";
import SkillTab from './Tabs/SkillTab';
import StatisticTab from './Tabs/StatisticTab';
import { PlayerContext } from './index'
import useScreenOrientation from 'react-hook-screen-orientation'

const useStyles = makeStyles(() => ({
    paper: { minWidth: "98%", backgroundColor: "transparent" },
    landPaper: { minWidth: "80%", maxHeight: "100%", backgroundColor: "transparent" }
}));
export default function GameDetailTab() {
    const classes = useStyles();
    const { context } = useContext(PlayerContext)

    const screenOrientation = useScreenOrientation()
    const isLandscape = screenOrientation.split('-')[0] === "landscape"

    const playerId = context.player.id
    const game = context.game

    const [open, setOpen] = useState(false);
    const [tagList, setTagList] = useState([])
    const [playTags, setPlayTags] = useState([])


    useEffect(() => {
        GameService.getAllPlayerTagsByPlayer(playerId, game?.game_id).then((res) => {
            setTagList(res)
        })
    }, [playerId, game])

    return (
        <>
            <Dialog
                classes={{ paper: isLandscape ? classes.landPaper : classes.paper }}
                open={open}
                onClose={e => setOpen(false)}
            >
                <DialogContent sx={{ p: 0, }}>
                    <TagVideo tagList={playTags} url={game?.video_url} />
                </DialogContent>
            </Dialog>
            <div className='skillsTab'>
                <Tabs defaultActiveKey="skill" id="uncontrolled-tab-example" className="mt-1 mb-3">
                    <Tab eventKey="skill" title="SKILLS">
                        <SkillTab tagList={tagList} playTags={tags => { setPlayTags(tags); setOpen(true) }} />
                    </Tab>
                    <Tab eventKey="statistic" title="STATISTICS" className='tableBorder'>
                        <StatisticTab tagList={tagList} playTags={tags => { setPlayTags(tags); setOpen(true) }} />
                    </Tab>
                </Tabs>
            </div>
        </>
    );
}
