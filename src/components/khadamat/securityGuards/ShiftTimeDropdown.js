import { CancelRounded, CheckRounded, DeleteRounded, EditRounded, MoreHoriz } from '@mui/icons-material';
import { Fade, IconButton, Popover } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import shiftTimesService from 'src/config/axios/shiftTimesService';
import { setShiftTimes } from 'src/redux/slices/shiftTimesSlice';
import DeleteDialog from '../general/DeleteDialog';
import DropdownItem from '../general/DropdownItem';
import EditShiftTime from './EditShiftTime';

const ShiftTimeDropdown = ({ t, shift }) => {
    const [anchorEl, setAnchorEl] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const menuOpen = Boolean(anchorEl);
    const dispatch = useDispatch();

    const onEditClick = () => {
        setAnchorEl(null);
        setEditDialogOpen(true);
    };

    const showDeleteDialog = () => {
        setAnchorEl(null);
        setDeleteDialogOpen(true);
    };

    const handleDeleteShift = async () => {
        try {
            setDeleting(true);
            await shiftTimesService.deleteShiftTime(shift.Id);
            const { data: sTimes } = await shiftTimesService.searchShiftTimes();
            dispatch(setShiftTimes(sTimes));
            setDeleting(false);
            setDeleteDialogOpen(false);
            toast.success(t('common.success.delete'));
        } catch (err) {
            console.log({ err });
            setDeleting(false);
            toast.error(t('common.error.unknown'));
        }
    };

    return (
        <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreHoriz />
            </IconButton>
            <Popover
                disableScrollLock
                open={menuOpen}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                TransitionComponent={Fade}
                sx={{
                    '& .MuiPaper-root': {
                        padding: 1,
                        borderRadius: 1,
                        '& .MuiMenuItem-root': {
                            borderRadius: 1,
                        },
                    },
                }}
            >
                <DropdownItem label={t('common.edit')} icon={<EditRounded />} onClick={onEditClick} />
                <DropdownItem label={t('common.delete')} icon={<DeleteRounded />} onClick={showDeleteDialog} />
                {/* {shift.IsActive ? (
                    <DropdownItem label={t('common.deactivate')} icon={<CancelRounded />} onClick={onEditClick} />
                ) : (
                    <DropdownItem label={t('common.activate')} icon={<CheckRounded />} onClick={onEditClick} />
                )} */}
            </Popover>

            {deleteDialogOpen && (
                <DeleteDialog
                    t={t}
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    title={t('common.deleteConfirm', { data: shift.ShiftTitle })}
                    deleting={deleting}
                    handleDelete={handleDeleteShift}
                />
            )}

            {editDialogOpen && (
                <EditShiftTime t={t} open={editDialogOpen} onClose={() => setEditDialogOpen(false)} id={shift.Id} />
            )}
        </>
    );
};

export default ShiftTimeDropdown;
