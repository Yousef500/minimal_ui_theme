import {
    BadgeRounded,
    Cancel,
    Check,
    EditRounded,
    MoreVertOutlined,
    RotateLeftRounded,
} from '@mui/icons-material';
import { CircularProgress, Dialog, Fade, IconButton, Menu } from '@mui/material';
import usersService from 'src/config/axios/usersService';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setUsers } from 'src/redux/slices/usersSlice';
import DropdownItem from '../general/DropdownItem';
import PasswordResetDialog from './PasswordResetDialog';

const UserCardDropdown = ({ user, loading, setUserLoading }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogStatus, setDialogStatus] = useState(false);
    const open = Boolean(anchorEl);
    const { page } = useSelector((state) => state.users);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const openMenu = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const handleDialogOpen = () => {
        closeMenu();
        setDialogStatus(true);
    };

    const navigateToEdit = () => {
        closeMenu();
        navigate(`/users/edit/${user.Id}?page=${page}`);
    };

    const setUsersStatus = async (status) => {
        setUserLoading(true);
        try {
            closeMenu();
            const { data } = await usersService.changeStatus({ userId: user.Id, status });
            const usersRes = await usersService.searchUsers();
            dispatch(setUsers(usersRes.data));
            toast.success(t('common.success.general'));
            setUserLoading(false);
        } catch (err) {
            console.log({ err });
            toast.error(err.response?.data?.Message ?? t('common.error.unknown'));
            setUserLoading(false);
        }
    };

    return (
        <>
            <IconButton onClick={openMenu}>
                <MoreVertOutlined />
            </IconButton>
            <Menu
                disableScrollLock
                sx={{
                    '& .MuiMenu-paper': {
                        padding: 2,
                    },
                }}
                open={open}
                onClose={closeMenu}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                TransitionComponent={Fade}
                TransitionProps={{ unmountOnExit: true }}
            >
                <DropdownItem
                    component={Link}
                    to={`/users/${user.Id}?page=${page}`}
                    label={t('common.details')}
                    icon={<BadgeRounded />}
                />
                <DropdownItem
                    label={t('common.edit')}
                    icon={<EditRounded />}
                    onClick={navigateToEdit}
                />
                <DropdownItem
                    label={t('accounts.users.resetPass')}
                    icon={<RotateLeftRounded />}
                    onClick={handleDialogOpen}
                />
                {loading ? (
                    <DropdownItem
                        label={t('common.loading')}
                        icon={<CircularProgress size={12} />}
                    />
                ) : user.IsActive ? (
                    <DropdownItem
                        label={t('common.deactivate')}
                        icon={<Cancel />}
                        onClick={() => setUsersStatus(false)}
                    />
                ) : (
                    <DropdownItem
                        label={t('common.activate')}
                        icon={<Check />}
                        onClick={() => setUsersStatus(true)}
                    />
                )}
            </Menu>
            {dialogStatus && (
                <Dialog fullWidth open={dialogStatus} onClose={() => setDialogStatus(false)}>
                    <PasswordResetDialog
                        username={user.Username}
                        setDialogStatus={setDialogStatus}
                    />
                </Dialog>
            )}
        </>
    );
};

export default UserCardDropdown;
