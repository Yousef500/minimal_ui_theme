import { Search } from '@mui/icons-material';
import { Divider, IconButton, InputBase, Paper, Stack } from '@mui/material';
import usersService from 'src/config/axios/usersService';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
    setUsers,
    setUsersFilterBy,
    setUsersLoading,
    setUsersPageNo,
} from 'src/redux/slices/usersSlice';

const UserSearch = () => {
    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleSearch = async ({ filterBy }) => {
        try {
            dispatch(setUsersLoading(true));
            dispatch(setUsersPageNo(1));
            dispatch(setUsersFilterBy(filterBy));
            const { data } = await usersService.searchUsers();
            dispatch(setUsers(data));
        } catch (err) {
            console.error(err);
            dispatch(setUsers([]));
        }
    };

    return (
        <Paper
            sx={{ borderRadius: 5, backgroundColor: 'primary.lighter', color: 'black' }}
            elevation={7}
        >
            <Stack
                component="form"
                onSubmit={handleSubmit(handleSearch)}
                direction="row"
                spacing={1}
            >
                <InputBase
                    fullWidth
                    sx={{ ml: 1, flex: 1, p: 2 }}
                    placeholder={t('accounts.users.search')}
                    {...register('filterBy')}
                />
                <IconButton type="submit" color="primary" sx={{ p: 2 }}>
                    <Search />
                </IconButton>
            </Stack>
        </Paper>
    );
};

export default UserSearch;
