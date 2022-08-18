import { PersonAddOutlined } from '@mui/icons-material';
import {
    Button,
    CircularProgress,
    Container,
    Grid,
    Pagination,
    Stack,
    Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Center from 'src/components/khadamat/general/Center';
import UserCard from 'src/components/khadamat/users/UserCard';
import UserSearch from 'src/components/khadamat/users/UserSearch';
import { setUsers, setUsersLoading, setUsersPageNo } from 'src/redux/slices/usersSlice';

import { useTranslation } from 'react-i18next';
import usersService from 'src/config/axios/usersService';

const UsersManagement = () => {
    const dispatch = useDispatch();
    const { users, pageCount, page, usersLoading } = useSelector((state) => state.users);
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            try {
                const { data } = await usersService.searchUsers();
                dispatch(setUsers(data));
            } catch (err) {
                console.log(err);
                dispatch(setUsersLoading(false));
            }
        })();
    }, []);

    const handlePageChange = async (e, newPage) => {
        if (page !== newPage) {
            dispatch(setUsersPageNo(newPage));
            try {
                const { data } = await usersService.searchUsers();
                dispatch(setUsers(data));
            } catch (err) {
                console.log(err);
                dispatch(setUsersLoading(false));
            }
        }
    };

    return (
        <Container maxWidth={'xl'} sx={{ mb: 10 }}>
            <Grid container spacing={3} justifyContent="center" alignItems={'center'}>
                <Grid item xs={12}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="h2" gutterBottom>
                            {t('accounts.users.title')}
                        </Typography>
                        <Button
                            component={Link}
                            to="/users/create"
                            size="large"
                            variant="contained"
                            color="success"
                            startIcon={<PersonAddOutlined />}
                            sx={{ fontSize: 20 }}
                        >
                            {t('accounts.users.add')}
                        </Button>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <UserSearch />
                </Grid>
                {usersLoading ? (
                    <Center my={20}>
                        <CircularProgress size={100} color="info" />
                    </Center>
                ) : (
                    users?.length &&
                    users?.map((user) => (
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={4} key={user.Id} pb={2}>
                            <UserCard user={user} />
                        </Grid>
                    ))
                )}
                <Center my={5}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        color="info"
                        shape="rounded"
                        size="large"
                        onChange={handlePageChange}
                        showFirstButton
                        showLastButton
                    />
                </Center>
            </Grid>
        </Container>
    );
};

export default UsersManagement;
