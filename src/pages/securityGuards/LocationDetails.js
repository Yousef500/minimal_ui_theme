import {
    KeyboardDoubleArrowLeftRounded,
    KeyboardDoubleArrowRightRounded,
} from '@mui/icons-material';
import {
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    Fab,
    Grid,
    Tooltip,
    Typography,
} from '@mui/material';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Center from 'src/components/khadamat/general/Center';
import DetailView from 'src/components/khadamat/general/DetailView';
import DayAccordion from 'src/components/khadamat/securityGuards/DayAccordion';
import { getLocationAndShifts } from 'src/config/axios/locationsService';
import useLocales from 'src/hooks/useLocales';

const LocationDetails = () => {
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [markerCoords, setMarkerCoords] = useState(null);
    const [shifts, setShifts] = useState(null);
    const {
        currentLang: { value: lang },
        translate: t,
    } = useLocales();
    const { id } = useParams();

    useEffect(() => {
        (async () => {
            try {
                const [{ data: loc }, shiftsRes] = await getLocationAndShifts(id);
                setLocation(loc);

                if (shiftsRes) {
                    setShifts(shiftsRes.data[0]);
                }

                if (loc.LocationLat && loc.LocationLong) {
                    setMapCenter({ lat: loc.LocationLat, lng: loc.LocationLong });
                    setMarkerCoords({ lat: loc.LocationLat, lng: loc.LocationLong });
                } else {
                    setMapCenter({ lat: 24.7136, lng: 46.6753 });
                }

                setLoading(false);
            } catch (err) {
                console.log({ err });
                setLoading(false);
                toast.error(t('common.error.unknown'));
            }
        })();
    }, [id]);

    return (
        <Container maxWidth={'xl'}>
            <Card sx={{ backgroundColor: 'warning.lighter' }}>
                {loading ? (
                    <Center my={10}>
                        <CircularProgress size={100} color="primary" />
                    </Center>
                ) : (
                    location && (
                        <>
                            <CardHeader
                                title={lang === 'ar' ? location.NameFl : location.NameSl}
                                titleTypographyProps={{
                                    variant: 'h3',
                                    align: 'center',
                                    gutterBottom: true,
                                }}
                                action={
                                    <Tooltip title={t('common.return')}>
                                        <Fab color={'info'} component={Link} to={-1}>
                                            {lang === 'ar' ? (
                                                <KeyboardDoubleArrowLeftRounded />
                                            ) : (
                                                <KeyboardDoubleArrowRightRounded />
                                            )}
                                        </Fab>
                                    </Tooltip>
                                }
                            />
                            <CardContent>
                                <Grid container spacing={3} justifyContent="center">
                                    <Grid item xs={12} lg={6}>
                                        <DetailView
                                            title={`${t('common.description')}:`}
                                            data={location.Description}
                                        />
                                    </Grid>
                                    <Grid item xs={0} lg={3} />
                                    <Grid item xs={12}>
                                        {!markerCoords && (
                                            <Typography align="center" color="error">
                                                {t('common.noLocation')}
                                            </Typography>
                                        )}
                                        {mapCenter && (
                                            <GoogleMap
                                                zoom={10}
                                                center={mapCenter}
                                                mapContainerStyle={{
                                                    width: '100%',
                                                    height: 500,
                                                    borderRadius: 10,
                                                }}
                                            >
                                                {markerCoords && <Marker position={markerCoords} />}
                                            </GoogleMap>
                                        )}
                                    </Grid>
                                    {shifts ? (
                                        <>
                                            <Grid item xs={12}>
                                                <Typography
                                                    gutterBottom
                                                    variant="h4"
                                                    align="center"
                                                    color="warning.darker"
                                                >
                                                    {t('securityGuards.shifts.title')}
                                                </Typography>
                                            </Grid>
                                            {shifts.GTsLookupDayDTOs?.map((day) => (
                                                <Grid item xs={12} md={6} key={day.GTsLookupDayId}>
                                                    <DayAccordion day={day} t={t} />
                                                </Grid>
                                            ))}
                                        </>
                                    ) : (
                                        <Grid item xs={12}>
                                            <Typography
                                                gutterBottom
                                                variant="h4"
                                                align="center"
                                                color="warning.darker"
                                            >
                                                {t('securityGuards.locations.noShifts')}
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </CardContent>
                        </>
                    )
                )}
            </Card>
        </Container>
    );
};

export default LocationDetails;
