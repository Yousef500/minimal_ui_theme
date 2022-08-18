import {
    AddLocationAltRounded,
    Delete,
    FilterAltOffRounded,
    FilterAltRounded,
    SearchOffRounded,
} from '@mui/icons-material';
import {
    Button,
    Chip,
    CircularProgress,
    Container,
    Fab,
    Grid,
    Pagination,
    Stack,
    Typography,
} from '@mui/material';
import Center from 'src/components/khadamat/general/Center';
import LocationsFilter from 'src/components/khadamat/securityGuards/LocationsFilter';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import LocationCard from 'src/components/khadamat/securityGuards/LocationCard';
import locationsService from 'src/config/axios/locationsService';
import useLocales from 'src/hooks/useLocales';
import {
    deleteLocationFilter,
    resetLocationsFilters,
    setLoadingLocations,
    setLocations,
    setLocationsPageNo,
} from 'src/redux/slices/locationsSlice';

const LocationsManagement = () => {
    const [filterOpen, setFilterOpen] = useState(false);
    const {
        translate: t,
        currentLang: { value: lang },
    } = useLocales();
    const dispatch = useDispatch();
    const { locations, loadingLocations, page, pageCount, filters } = useSelector(
        (state) => state.locations
    );

    useEffect(() => {
        (async () => {
            try {
                const { data } = await locationsService.searchLocations();
                console.log(data);
                dispatch(setLocations(data));
            } catch (err) {
                console.error({ err });
                toast.error(t('common.error.unknown'));
            }
        })();
    }, []);

    const handlePageChange = async (e, newPage) => {
        if (page !== newPage) {
            try {
                dispatch(setLoadingLocations(true));
                dispatch(setLocationsPageNo(newPage));
                const { data } = await locationsService.searchLocations();
                dispatch(setLocations(data));
            } catch (err) {
                console.error({ err });
                dispatch(setLoadingLocations(false));
            }
        }
    };

    const handleResetFilters = async () => {
        const filters = document.getElementById('locFilters').children?.length;
        if (filters) {
            try {
                dispatch(setLoadingLocations(true));
                dispatch(resetLocationsFilters());
                const { data } = await locationsService.searchLocations();
                dispatch(setLocations(data));
            } catch (err) {
                console.log({ err });
                dispatch(setLoadingLocations(false));
            }
        }
    };

    const handleDeleteFilter = async (key) => {
        try {
            dispatch(setLoadingLocations(true));
            dispatch(deleteLocationFilter(key));
            const { data } = await locationsService.searchLocations();
            dispatch(setLocations(data));
        } catch (err) {
            console.log({ err });
            dispatch(setLoadingLocations(false));
        }
    };

    return (
        <Container maxWidth={'xl'}>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="h2" gutterBottom>
                            {t('securityGuards.locations.title')}
                        </Typography>
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            startIcon={<AddLocationAltRounded />}
                            sx={{ fontSize: 22 }}
                            component={RouterLink}
                            to="/securityGuards/locations/add"
                        >
                            {t('securityGuards.locations.add')}
                        </Button>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent={'space-between'}>
                        <Fab
                            variant="extended"
                            color="info"
                            sx={{ fontSize: 22 }}
                            onClick={() => setFilterOpen(true)}
                        >
                            <Stack direction="row" spacing={1} alignItems="center">
                                <FilterAltRounded />
                                <Typography variant="inherit">{t('common.filter')}</Typography>
                            </Stack>
                        </Fab>

                        <Fab
                            variant="extended"
                            color="secondary"
                            sx={{ fontSize: 22, height: 60 }}
                            onClick={handleResetFilters}
                        >
                            <Stack direction="row" spacing={1} alignItems="center">
                                <FilterAltOffRounded />
                                <Typography variant="inherit">
                                    {t('common.deleteFilters')}
                                </Typography>
                            </Stack>
                        </Fab>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Stack id="locFilters" direction={'row'} spacing={3} sx={{ flexWrap: 'wrap' }}>
                        {Object.keys(filters).map((key) =>
                            filters[key] ? (
                                <Chip
                                    variant="outlined"
                                    color="info"
                                    label={`${t(`common.${key}`)}: ${filters[key]}`}
                                    sx={{ fontSize: 21 }}
                                    onDelete={() => handleDeleteFilter(key)}
                                    deleteIcon={<Delete />}
                                />
                            ) : (
                                ''
                            )
                        )}
                    </Stack>
                </Grid>
                {loadingLocations ? (
                    <Grid item xs={12}>
                        <Center>
                            <CircularProgress size={150} color="info" />
                        </Center>
                    </Grid>
                ) : locations?.length ? (
                    locations.map((loc) => (
                        <Grid item xs={12} md={6} lg={4} key={loc.Id}>
                            <LocationCard t={t} location={loc} lang={lang} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Stack
                            direction="row"
                            spacing={5}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <SearchOffRounded />
                            <Typography variant="h3">{t('common.notFound')}</Typography>
                        </Stack>
                    </Grid>
                )}

                <Grid item xs={12} mb={5}>
                    <Center>
                        <Pagination
                            color="info"
                            shape={'rounded'}
                            page={page}
                            count={pageCount}
                            size="large"
                            onChange={handlePageChange}
                            showFirstButton
                            showLastButton
                        />
                    </Center>
                </Grid>
            </Grid>
            {filterOpen && (
                <LocationsFilter t={t} onClose={() => setFilterOpen(false)} open={filterOpen} />
            )}
        </Container>
    );
};

export default LocationsManagement;
