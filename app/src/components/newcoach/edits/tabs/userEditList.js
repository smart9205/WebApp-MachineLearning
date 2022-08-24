import React, { useEffect, useRef } from 'react'
import {
    Paper,
    IconButton,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Box,
    ListItem
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDrag, useDrop } from 'react-dnd'
import { useState } from 'react';

import Tree from './tree';




const UserEditList = ({
    editList, curEdit,
    handleUserEditDetail,
    setEditOpen,
    setEditName,
    setDeleteOpen, }) => {

    const [items, setItems] = useState(editList)

    const handleOnDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const newItems = [...items];
        const [removed] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, removed);
        setItems(newItems)
    }

    useEffect(() => {
        setItems(editList)
        console.log(editList)
    }, [editList])

    return (

        <Box>
            <Tree editList={editList} />

        </Box>
        // <DragDropContext onDragEnd={handleOnDragEnd}>
        //     <Droppable droppableId="droppable">
        //         {(provided, snapshot) => (
        //             <div
        //                 {...provided.droppableProps}
        //                 ref={provided.innerRef}
        //             >
        //                 {items && items.map((item, index) => (
        //                     <Draggable draggableId={String(index)} index={index}>
        //                         {(provided, snapshot) => (
        //                             <div
        //                                 ref={provided.innerRef}
        //                                 {...provided.draggableProps}
        //                                 {...provided.dragHandleProps}
        //                             >
        //                                 <p style={{ color: 'black' }} >{item.name}</p>
        //                             </div>
        //                         )}
        //                     </Draggable>
        //                 ))}
        //                 {provided.placeholder}
        //             </div>

        //         )}
        //     </Droppable>
        // </DragDropContext>

        // <TableContainer component={Paper}>
        // <Table aria-label="simple table">
        //         <TableBody>
        //             {editList.map((userEdit, idx) =>
        //                 <TableRow
        //                     key={idx}
        //                     hover
        //                     selected={curEdit === userEdit}
        //                     onClick={() => handleUserEditDetail(userEdit)}
        //                 >
        //                     <TableCell align="center">{userEdit.name}</TableCell>
        //                     <TableCell align="center" sx={{ width: 30 }}>
        //                         <IconButton
        //                             onClick={() => {
        //                                 setEditOpen(true)
        //                                 setEditName(userEdit.name)
        //                             }}
        //                             size="small"
        //                         >
        //                             <EditIcon />
        //                         </IconButton>
        //                     </TableCell>
        //                     <TableCell align="center" sx={{ width: 30 }}>
        //                         <IconButton
        //                             onClick={() => setDeleteOpen(true)}
        //                             size="small"
        //                         >
        //                             <DeleteIcon />
        //                         </IconButton>
        //                     </TableCell>
        //                 </TableRow>
        //             )}
        //         </TableBody>
        //     </Table>
        // </TableContainer>
    )
}

export default UserEditList