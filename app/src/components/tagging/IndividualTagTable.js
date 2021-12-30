import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import TCellTimeEdit from './TCellTimeEdit';
import TCellSelectEdit from './TCellSelectEdit';
import GameService from '../../services/game.service';
import "./CSS/table.css";

export default function StickyHeadTable({ 
  rows, 
  actions, 
  actionTypes, 
  actionResults,
  offenseTeamId,
  offenseTeam,
  defenseTeam,
  updateTagList,
}) {
  console.log("Player Tag", rows)  

  const update = (data) => {
    GameService.updatePlayerTag(data).then(res => {
      console.log("UPdated Player tag", res)
      updateTagList()
    })
  }
  
  return (
    <Box sx={{ width: '100%', p: 1 }}>
      <Paper sx={{ width: '100%', overflow: 'hidden', p: 0.5 }}>
        <h5 style={{textAlign: 'center'}}>Player Tag</h5>
        <TableContainer style={{ height: "30vh" }}>
          <Table stickyHeader aria-label="sticky table" size={'small'}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Action</TableCell>
                <TableCell align="center">Action Type</TableCell>
                <TableCell align="center">Action Result</TableCell>
                <TableCell align="center">Player</TableCell>
                <TableCell align="center">Start Time</TableCell>
                <TableCell align="center">End Time</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TCellSelectEdit 
                        rows={actions} 
                        value={{id: row.action_id, name:row.action_name}} 
                        update={v => update({...row, action_id: v})}
                      />
                      <TCellSelectEdit 
                        rows={actionTypes} 
                        value={{id: row.action_type_id, name:row.action_type_name}}
                        update={v => update({...row, action_type_id: v})} 
                      />
                      <TCellSelectEdit 
                        rows={actionResults} 
                        value={{id: row.action_result_id, name:row.action_result_name}} 
                        update={v => update({...row, action_result_id: v})}
                      />
                      <TCellSelectEdit 
                        rows={row.team_id === offenseTeamId ? offenseTeam : defenseTeam} 
                        value={{id: row.player_id, name: `${row.player_fname} ${row.player_lname}`}} 
                        update={v => update({...row, player_id: v})}
                      />
                      <TCellTimeEdit type="TimePicker" value={row.start_time} />
                      <TCellTimeEdit type="TimePicker" value={row.end_time} />
                      <TableCell align="center" sx={{p:0 , m:0}}>
                          <IconButton size="small" onClick={() => {}}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
