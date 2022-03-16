import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import TableCell from '@mui/material/TableCell';
import DeleteConfirmDialog from "../../../../common/DeleteConfirmDialog";
import TableRow from '@mui/material/TableRow';

export const PlayerTagRow = ({ id, row, index, moveRow, onPlay, selected, onDelete }) => {
    const ref = useRef(null);
    const [deleteOpen, setDeleteOpen] = useState(false)

    const [{ handlerId }, drop] = useDrop({
        accept: "PlayerTagRow",
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            // Time to actually perform the action
            moveRow(dragIndex, hoverIndex);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });
    const [{ isDragging }, drag] = useDrag({
        type: "PlayerTagRow",
        item: () => {
            return { id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    drag(drop(ref));

    const handleDeleteClose = (result) => {
        setDeleteOpen(false)
        if (result)
            onDelete(row.id)
    }

    return (
        <TableRow
            hover
            ref={ref}
            data-handler-id={handlerId}
            role="checkbox"
            tabIndex={-1}
            selected={selected}
        >
            <DeleteConfirmDialog
                open={deleteOpen}
                handleDeleteClose={handleDeleteClose}
            />
            <TableCell align="center">{row.action_name}</TableCell>
            <TableCell align="center">{row.action_type_name}</TableCell>
            <TableCell align="center">{row.action_result_name}</TableCell>
            <TableCell align="center">{row?.player_fname}{' '}{row?.player_lname}</TableCell>
            <TableCell align="center">{row?.start_time}</TableCell>
            <TableCell align="center">{row?.end_time}</TableCell>
            <TableCell align="center" sx={{ p: 0, m: 0 }}>
                <IconButton size="small" onClick={(e) => onPlay()}>
                    <PlayCircleIcon />
                </IconButton>
            </TableCell>
            <TableCell align="center" sx={{ p: 0, m: 0 }}>
                <IconButton
                    onClick={() => setDeleteOpen(true)}
                    size="small"
                >
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};
