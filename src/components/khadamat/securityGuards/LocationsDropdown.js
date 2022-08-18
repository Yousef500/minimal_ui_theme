import {
    CancelOutlined,
    DeleteOutlineRounded,
    EditLocationAlt,
    LocationOnRounded,
    MoreVert,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
    Dialog,
    DialogActions,
    DialogTitle,
    IconButton,
    Menu,
    Stack,
    Typography,
} from '@mui/material';

import locationsService from 'src/config/axios/locationsService';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLocations } from 'src/redux/slices/locationsSlice';
import i18n from 'src/locales/i18n';
import MapsDialog from '../ekram/MapsDialog';
import DeleteDialog from '../general/DeleteDialog';
import DropdownItem from '../general/DropdownItem';

const LocationsDropdown = ({ t, location }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [mapOpen, setMapOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const dispatch = useDispatch();
    const { page } = useSelector((state) => state.locations);

    const handleLocationClick = () => {
        setAnchorEl(null);
        setMapOpen(true);
    };

    const handleDeleteClick = () => {
        setAnchorEl(null);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteConfirmOpen(false);
    };

    const handleDeleteLocation = async () => {
        setDeleting(true);
        try {
            const { data: deleteRes } = await locationsService.deleteLocation(location.Id);
            const { data: newLocations } = await locationsService.searchLocations();
            dispatch(setLocations(newLocations));
            setDeleting(false);
            handleDeleteDialogClose();
            toast.success(t('common.success.delete'));
        } catch (err) {
            console.log({ err });
            toast.error('common.error.unknown');
            setDeleting(false);
        }
    };

    return (
        <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVert />
            </IconButton>
            <Menu
                disableScrollLock
                open={menuOpen}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                sx={{
                    '& .MuiPaper-root': {
                        padding: 1,
                    },
                }}
            >
                <DropdownItem
                    label={t('common.location')}
                    icon={<LocationOnRounded />}
                    onClick={handleLocationClick}
                />
                <DropdownItem
                    label={t('common.edit')}
                    icon={<EditLocationAlt />}
                    component={Link}
                    to={`/securityGuards/locations/edit/${location.Id}?page=${page}`}
                />
                <DropdownItem
                    label={t('common.delete')}
                    icon={<DeleteOutlineRounded />}
                    onClick={handleDeleteClick}
                />
            </Menu>
            {mapOpen ? (
                <MapsDialog
                    open={mapOpen}
                    onClose={() => setMapOpen(false)}
                    center={{ lat: location.LocationLat, lng: location.LocationLong }}
                    markerCoords={{ lat: location.LocationLat, lng: location.LocationLong }}
                    title={t('common.location')}
                />
            ) : (
                ''
            )}

            {deleteConfirmOpen ? (
                <DeleteDialog
                    t={t}
                    open={deleteConfirmOpen}
                    onClose={handleDeleteDialogClose}
                    title={t('common.deleteConfirm', {
                        data: i18n.language === 'en' ? location.NameSl : location.NameFl,
                    })}
                    handleDelete={handleDeleteLocation}
                    deleting={deleting}
                />
            ) : (
                ''
            )}
        </>
    );
};

export default LocationsDropdown;
