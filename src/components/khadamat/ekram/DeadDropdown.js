import styled from '@emotion/styled';
import {
    ArchiveOutlined,
    ArchiveRounded,
    ContentPasteRounded,
    EditRounded,
    LocationOn,
    MoreVert,
    UnarchiveOutlined,
} from '@mui/icons-material';
import { CircularProgress, Fade, IconButton, Menu } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import deadService from 'src/config/axios/deadServices';
import i18n from 'src/locales/i18n';
import { setDead } from 'src/redux/slices/deadSlice';
import DeleteDialog from '../general/DeleteDialog';
import DropdownItem from '../general/DropdownItem';
import MapsDialog from './MapsDialog';

const DeadDropdown = ({ lat, lng, person, page }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mapsOpen, setMapsOpen] = useState(false);
    const [changingStatus, setChangingStatus] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const menuOpen = Boolean(anchorEl);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleMenuOpen = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleMenuClose = (e) => {
        setAnchorEl(null);
    };

    const handleMapsDialogOpen = () => {
        handleMenuClose();
        setMapsOpen(true);
    };

    const handleRecordStatus = async (status) => {
        setChangingStatus(true);
        try {
            const { data: archRes } = await deadService.changeSatus(person.Id, status);
            const { data: newDead } = await deadService.searchDead();
            dispatch(setDead(newDead));
            setChangingStatus(false);
            status ? handleMenuClose() : setDeleteConfirmOpen(false);
            toast.success(t('common.success.general'));
        } catch (err) {
            console.log({ err });
            toast.error(t('common.error.unknown'));
            setChangingStatus(false);
        }
    };

    return (
        <>
            <IconButton onClick={handleMenuOpen}>
                <MoreVert />
            </IconButton>
            <Menu
                disableScrollLock
                open={menuOpen}
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                TransitionComponent={Fade}
                sx={{
                    '& .MuiPaper-root': {
                        padding: 2,
                        borderRadius: 1,
                        backgroundColor: 'info.light',
                    },
                    '& .MuiMenuItem-root': {
                        color: 'black',
                        '&:hover': {
                            background: '#E1F3F8',
                        },
                        borderRadius: 1,
                    },
                }}
            >
                <DropdownItem
                    label={t('common.location')}
                    icon={<LocationOn />}
                    onClick={handleMapsDialogOpen}
                />
                <DropdownItem
                    onClick={handleMenuClose}
                    component={Link}
                    to={`/dead/${person.Id}?page=${page}`}
                    label={t('common.details')}
                    icon={<ContentPasteRounded />}
                />
                <DropdownItem
                    onClick={handleMenuClose}
                    component={Link}
                    to={`/dead/edit/${person.Id}?page=${page}`}
                    label={t('common.edit')}
                    icon={<EditRounded />}
                />

                {changingStatus ? (
                    <DropdownItem
                        label={t('common.loading')}
                        icon={<CircularProgress size={10} />}
                    />
                ) : person.IsActive ? (
                    <DropdownItem
                        label={t('common.archive')}
                        icon={<ArchiveOutlined />}
                        onClick={() => {
                            handleMenuClose();
                            setDeleteConfirmOpen(true);
                        }}
                    />
                ) : (
                    <DropdownItem
                        label={t('common.restore')}
                        icon={<UnarchiveOutlined />}
                        onClick={() => handleRecordStatus(true)}
                    />
                )}
            </Menu>
            {mapsOpen ? (
                <MapsDialog
                    open={mapsOpen}
                    title={t('ekram.dead.graveLocation')}
                    onClose={() => setMapsOpen(false)}
                    center={{ lat, lng }}
                    markerCoords={{ lat, lng }}
                />
            ) : (
                ''
            )}

            {deleteConfirmOpen ? (
                <DeleteDialog
                    t={t}
                    open={deleteConfirmOpen}
                    onClose={() => setDeleteConfirmOpen(false)}
                    title={t('common.archiveConfirm', {
                        data: i18n.language === 'ar' ? person.NameFl : person.NameSl,
                    })}
                    handleDelete={() => handleRecordStatus(false)}
                    deleting={changingStatus}
                    deleteText={t('common.archive')}
                    deleteIcon={<ArchiveRounded />}
                />
            ) : (
                ''
            )}
        </>
    );
};

export default DeadDropdown;
