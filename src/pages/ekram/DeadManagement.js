import {
    FilterAltOffRounded,
    FilterAltRounded,
    PlaylistAddOutlined,
    SearchOffRounded,
} from '@mui/icons-material';
import {
    Button,
    CircularProgress,
    Container,
    Fab,
    Grid,
    Pagination,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import DeadActiveFilters from 'src/components/khadamat/ekram/DeadActiveFilters';
import DeadCard from 'src/components/khadamat/ekram/DeadCard';
import DeadFilterDialog from 'src/components/khadamat/ekram/DeadFilterDialog';
import DeadSearch from 'src/components/khadamat/ekram/DeadSearch';
import Center from 'src/components/khadamat/general/Center';
import ExtractButton from 'src/components/khadamat/general/ExtractButton';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import deadService from 'src/config/axios/deadServices';
import {
    resetDeadFilters,
    setDead,
    setDeadLoading,
    setDeadPageNo,
} from 'src/redux/slices/deadSlice';
import { useForm } from 'react-hook-form';

const DeadManagement = () => {
    const [filterOpen, setFilterOpen] = useState(false);
    const dispatch = useDispatch();
    const { dead, deadLoading, pageCount, page } = useSelector((state) => state.dead);
    const { t } = useTranslation();
    const { register, handleSubmit, control, reset, resetField } = useForm({
        defaultValues: {
            orderby: 0,
            ...null
        },
    });

    useEffect(() => {
        (async () => {
            try {
                const { data: deadData } = await deadService.searchDead();
                dispatch(setDead(deadData));
            } catch (err) {
                console.log({ err });
                dispatch(setDeadLoading(false));
            }
        })();
    }, []);

    const handlePageChange = async (e, newPage) => {
        if (page !== newPage) {
            dispatch(setDeadPageNo(newPage));
            try {
                const { data: pagedData } = await deadService.searchDead();
                dispatch(setDead(pagedData));
            } catch (err) {
                console.log({ err });
                dispatch(setDeadLoading(false));
            }
        }
    };

    const handleFilterOpen = () => {
        setFilterOpen(true);
    };

    const handleFiltersReset = async () => {
        const activeFilters = document.getElementById('active-filters').children.length;
        if (activeFilters !== 0) {
            try {
                reset();
                dispatch(setDeadLoading(true));
                dispatch(resetDeadFilters());
                const { data: deadData } = await deadService.searchDead();
                dispatch(setDead(deadData));
            } catch (err) {
                console.log({ err });
                dispatch(setDeadLoading(false));
                toast.error(t('common.error.unknown'));
            }
        }
    };

    const formatDeadDataAR = () => {
        return dead.map((person) => ({
            '?????????? ????????????????': person.NameFl,
            '?????????? ??????????????????????': person.NameSl,
            '?????? ????????????': person.NationalNumber,
            '?????? ??????????': person.RegistrationNumber,
            ??????????: person.GenderTypeName,
            ??????????????: person.NationalityName,
            '?????????? ??????????': person.AgeYears,
            '?????????? ????????': person.AgeMonths,
            '?????????? ????????': person.AgeDays,
            ??????????: `${person.AgeYears} ?????? / ${person.AgeMonths} ???????? / ${person.AgeDays} ????????`,
            '?????????? ????????????': person.DateOfDeath.split('T')[0],
            '?????? ????????????': person.DeathTime,
            '?????? ????????????': person.DeathReason,
            '?????????? ??????????????': person.CemeteryAddress,
            '?????? ??????????????': person.CemeteryName,
            '?????? ????????': person.RowNumber,
            '?????? ????????????': person.ColumnNumber,
            '?????? ????????????': person.SquareNumber,
            ????????: person.IsActive ? '??????' : '????',
            ????????: person.IsCitizen ? '??????' : '????',
            ??????????: person.IsDeleted ? '??????' : '????',
        }));
    };

    return (
        <>
            <Container maxWidth={'xl'}>
                <Grid container spacing={3} justifyContent="center" alignItems="center" mb={5}>
                    <Grid item xs={12}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography gutterBottom variant="h1">
                                {t('ekram.dead.title')}
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ fontSize: 25 }}
                                startIcon={<PlaylistAddOutlined />}
                                component={Link}
                                to={'/dead/add'}
                                size="large"
                            >
                                {t('ekram.dead.add')}
                            </Button>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} position="relative" my={5}>
                        <Tooltip title={t('common.filter')}>
                            <Fab
                                variant="extended"
                                sx={{ fontSize: 25, position: 'absolute', left: 16, top: 3 }}
                                color="info"
                                onClick={handleFilterOpen}
                            >
                                <FilterAltRounded />
                                {t('common.filter')}
                            </Fab>
                        </Tooltip>
                    </Grid>

                    <Grid item xs={6} position="relative" my={5}>
                        <Tooltip title={t('common.deleteFilters')}>
                            <Fab
                                variant="extended"
                                sx={{
                                    fontSize: 22,
                                    position: 'absolute',
                                    right: 16,
                                    top: 3,
                                    height: 60,
                                }}
                                color="secondary"
                                onClick={handleFiltersReset}
                            >
                                <FilterAltOffRounded />
                                {t('common.deleteFilters')}
                            </Fab>
                        </Tooltip>
                    </Grid>

                    <Grid item xs={12}>
                        <DeadActiveFilters handleFiltersReset={handleFiltersReset} reset={reset} resetField={resetField} />
                    </Grid>

                    <Grid item xs={12}>
                        <DeadSearch t={t} />
                    </Grid>

                    {dead?.length ? (
                        <Grid item xs={12}>
                            <ExtractButton t={t} getData={() => formatDeadDataAR()} module="HDs" />
                        </Grid>
                    ) : (
                        ''
                    )}

                    {deadLoading ? (
                        <Center my={20}>
                            <CircularProgress size={100} color="info" />
                        </Center>
                    ) : dead.length ? (
                        dead.map((person) => (
                            <Grid item xs={10} sm={10} md={6} lg={4} key={person.Id}>
                                <DeadCard person={person} />
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="h3" align="center">
                                <SearchOffRounded sx={{ mr: 5 }} />
                                {t('common.notFound')}
                            </Typography>
                        </Grid>
                    )}
                    <Grid item xs={12} mt={3} mb={6}>
                        <Center>
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
                </Grid>
            </Container>
            {/* {filterOpen && ( */}
            <Grid item xs={12}>
                <DeadFilterDialog
                    open={filterOpen}
                    onClose={() => setFilterOpen(false)}
                    register={register}
                    handleSubmit={handleSubmit}
                    control={control}
                    reset={reset}
                />
            </Grid>
            {/* )} */}
        </>
    );
};

export default DeadManagement;
