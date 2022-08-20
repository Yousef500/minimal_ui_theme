import { MoreTimeRounded, SearchOffRounded } from '@mui/icons-material';
import { Button, CircularProgress, Container, Grid, Pagination, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Center from 'src/components/khadamat/general/Center';
import ShiftTimeCard from 'src/components/khadamat/securityGuards/ShiftTimeCard';
import shiftTimesService from 'src/config/axios/shiftTimesService';
import useLocales from 'src/hooks/useLocales';
import { setLoadingShiftTimes, setShiftTimes, setShiftTimesPageNo } from 'src/redux/slices/shiftTimesSlice';

const ShiftTimesManagement = () => {
    const {
        translate: t,
        currentLang: { value: lang },
    } = useLocales();
    const dispatch = useDispatch();

    const { page, shiftTimes, pageCount, loadingShiftTimes } = useSelector((state) => state.shiftTimes);

    useEffect(() => {
        (async () => {
            try {
                const { data: sTimes } = await shiftTimesService.searchShiftTimes();
                console.log(sTimes);
                dispatch(setShiftTimes(sTimes));
            } catch (err) {
                console.log({ err });
                dispatch(setShiftTimes([]));
            }
        })();
    }, []);

    const handlePageChange = async (e, newPage) => {
        if (newPage !== page) {
            try {
                dispatch(setLoadingShiftTimes(true));
                dispatch(setShiftTimesPageNo(newPage));
                const { data } = await shiftTimesService.searchShiftTimes();
                dispatch(setShiftTimes(data));
            } catch (err) {
                console.log({ err });
                dispatch(setShiftTimes([]));
                toast.error(t('common.error.unknown'));
            }
        }
    };

    return (
        <Container maxWidth={'xl'}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
                        <Typography variant="h2" gutterBottom>
                            {t('securityGuards.shiftTimes.title')}
                        </Typography>
                        <Button
                            size="large"
                            variant="contained"
                            color="primary"
                            sx={{ fontSize: 20 }}
                            startIcon={<MoreTimeRounded />}
                            component={Link}
                            to={'/securityGuards/shiftTimes/add'}
                        >
                            {t('securityGuards.shiftTimes.add')}
                        </Button>
                    </Stack>
                </Grid>
                {loadingShiftTimes ? (
                    <Center>
                        <CircularProgress size={100} color="info" />
                    </Center>
                ) : shiftTimes.length ? (
                    shiftTimes.map((shift) => (
                        <Grid key={shift.Id} item xs={12} sm={6} md={6} lg={4} xl={3}>
                            <ShiftTimeCard shift={shift} t={t} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Center>
                            <Stack direction="row" spacing={3}>
                                <SearchOffRounded />
                                <Typography variant="h4">{t('common.notFound')} </Typography>
                            </Stack>
                        </Center>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Center my={3}>
                        <Pagination
                            page={page}
                            count={pageCount}
                            size="large"
                            shape="rounded"
                            color="info"
                            onChange={handlePageChange}
                        />
                    </Center>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ShiftTimesManagement;
