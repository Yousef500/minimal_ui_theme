import { AddCardRounded, SearchOffRounded } from '@mui/icons-material';
import {
    Button,
    CircularProgress,
    Container,
    Grid,
    Pagination,
    Stack,
    Typography,
} from '@mui/material';
import Center from 'src/components/khadamat/general/Center';
import NatCard from 'src/components/khadamat/users/NatCard';
import NatSearch from 'src/components/khadamat/users/NatSearch';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import nationalitiesService from 'src/config/axios/nationalitiesService';
import {
    setNationalities,
    setNatsLoading,
    setNatsPageNo,
} from 'src/redux/slices/nationalitiesSlice';

const Nationalities = () => {
    const dispatch = useDispatch();
    const { nationalities, page, pageCount, natsLoading } = useSelector(
        (state) => state.nationalities
    );
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            try {
                const { data: natsRes } = await nationalitiesService.searchNats();
                console.log(natsRes);
                dispatch(setNationalities(natsRes));
            } catch (err) {
                console.log({ err });
                dispatch(setNatsLoading(false));
                toast.error(t('common.error.unknown'));
            }
        })();
    }, []);

    const handlePageChange = async (e, newPage) => {
        if (newPage !== page) {
            dispatch(setNatsLoading(true));
            try {
                dispatch(setNatsPageNo(newPage));
                const { data: pagedNats } = await nationalitiesService.searchNats();
                dispatch(setNationalities(pagedNats));
            } catch (err) {
                console.log({ err });
                dispatch(setNatsLoading(false));
            }
        }
    };

    return (
        <Container>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography gutterBottom variant="h1">
                            {t('accounts.nationalities.title')}
                        </Typography>
                        <Button
                            variant="outlined"
                            color="info"
                            size="large"
                            startIcon={<AddCardRounded />}
                            sx={{ fontSize: 20, borderRadius: 0 }}
                            component={Link}
                            to="/users/nationalities/add"
                        >
                            {t('accounts.nationalities.add')}
                        </Button>
                    </Stack>
                </Grid>

                <Grid item xs={12}>
                    <NatSearch t={t} />
                </Grid>

                {natsLoading ? (
                    <Grid item xs={12} my={10}>
                        <Center>
                            <CircularProgress size={100} color="info" />
                        </Center>
                    </Grid>
                ) : nationalities?.length ? (
                    nationalities.map((nat) => (
                        <Grid item xs={12} md={6} lg={4} xl={3} key={nat.Id}>
                            <NatCard nat={nat} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Stack direction=" row" justifyContent="center" spacing={5}>
                            <Typography variant="h3">{t('common.notFound')}</Typography>
                            <SearchOffRounded />
                        </Stack>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Center>
                        <Pagination
                            page={page}
                            onChange={handlePageChange}
                            count={pageCount}
                            shape={'rounded'}
                            color="info"
                            size="large"
                            showFirstButton
                            showLastButton
                        />
                    </Center>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Nationalities;
