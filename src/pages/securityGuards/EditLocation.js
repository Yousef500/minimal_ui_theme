import { CancelRounded, SaveRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    Grid,
    Typography,
} from '@mui/material';
import { GoogleMap, Marker } from '@react-google-maps/api';
import Center from 'src/components/khadamat/general/Center';
import InputField from 'src/components/khadamat/general/InputField';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLocationsPageNo } from 'src/redux/slices/locationsSlice';
import locationsService from 'src/config/axios/locationsService';

const EditLocation = () => {
    const { id } = useParams();
    const page = Number(useLocation().search.split('page=')[1]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mapCenter, setMapCenter] = useState(null);
    const [markerCoords, setMarkerCoords] = useState(null);
    const [mapError, setMapError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        reset,
    } = useForm({
        mode: 'onTouched',
    });

    const desLength = watch('description')?.length;
    const remainingLetters = 130 - desLength >= 0 ? 130 - desLength : 0;

    useEffect(() => {
        (async () => {
            try {
                console.log(id);
                const { data } = await locationsService.getLocation(id);
                reset({
                    id,
                    nameFl: data.NameFl,
                    nameSl: data.NameSl,
                    description: data.Description?.trim(),
                });
                if (data.LocationLat && data.LocationLong) {
                    setMarkerCoords({ lat: data.LocationLat, lng: data.LocationLong });
                    setMapCenter({
                        lat: data.LocationLat,
                        lng: data.LocationLong,
                    });
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

    const handleGoBack = () => {
        if (page > 1) {
            dispatch(setLocationsPageNo(page));
        }
        navigate('/securityGuards/locations');
    };

    const handleEditLocation = async (formData) => {
        if (Object.values(markerCoords)[0]) {
            setSaving(true);
            try {
                console.log({
                    ...formData,
                    id,
                    locationLat: markerCoords.lat,
                    locationLong: markerCoords.lng,
                });
                const { data: editRes } = await locationsService.editLocation({
                    ...formData,
                    locationLat: markerCoords.lat,
                    locationLong: markerCoords.lng,
                });
                console.log(editRes);
                setSaving(false);
                handleGoBack();
                toast.success(t('common.success.add'));
            } catch (err) {
                console.log({ err });
                toast.error(t('common.error.unknown'));
                setSaving(false);
            }
        } else {
            setMapError(t('securityGuards.locations.noLocationErr'));
        }
    };

    const handleMapClick = (e) => {
        setMarkerCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        if (mapError) setMapError('');
    };

    return (
        <Container maxWidth={'xl'}>
            <Card component="form" onSubmit={handleSubmit(handleEditLocation)}>
                <CardHeader
                    title={t('securityGuards.locations.edit')}
                    titleTypographyProps={{ variant: 'h3', align: 'center', gutterBottom: true }}
                />
                {loading ? (
                    <Center my={10}>
                        <CircularProgress size={200} color="info" />
                    </Center>
                ) : (
                    <>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <InputField
                                        fullWidth
                                        required
                                        {...register('nameFl', { required: true })}
                                        type={'text'}
                                        label={t('common.arName')}
                                        error={!!errors.nameFl}
                                        helperText={errors.nameFl?.message}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InputField
                                        fullWidth
                                        required
                                        {...register('nameSl', { required: true })}
                                        type={'text'}
                                        label={t('common.enName')}
                                        error={!!errors.nameSl}
                                        helperText={errors.nameSl?.message}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <InputField
                                        fullWidth
                                        required
                                        multiline
                                        rows={4}
                                        variant="filled"
                                        {...register('description', {
                                            maxLength: 130,
                                            required: true,
                                        })}
                                        type={'text'}
                                        label={t('common.description')}
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                    />
                                    <Typography
                                        align="right"
                                        color={'GrayText'}
                                        variant={'subtitle2'}
                                    >
                                        {remainingLetters}{' '}
                                        {t('securityGuards.locations.remainingLen')}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <GoogleMap
                                        center={mapCenter}
                                        zoom={9}
                                        mapContainerStyle={{
                                            height: 500,
                                            width: 'fit',
                                            borderRadius: 15,
                                        }}
                                        onClick={handleMapClick}
                                    >
                                        {markerCoords ? (
                                            <Marker
                                                draggable
                                                position={markerCoords}
                                                onDragEnd={handleMapClick}
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </GoogleMap>
                                </Grid>

                                <Grid item xs={12}>
                                    {mapError ? (
                                        <Typography
                                            variant="subtitle1"
                                            align="center"
                                            color={'error'}
                                        >
                                            {mapError}
                                        </Typography>
                                    ) : (
                                        ''
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <LoadingButton
                                fullWidth
                                loading={saving}
                                variant="contained"
                                color="success"
                                sx={{ fontSize: 20 }}
                                startIcon={<SaveRounded />}
                                loadingPosition="start"
                                type="submit"
                                disabled={!isValid || !markerCoords}
                            >
                                {t('common.save')}
                            </LoadingButton>

                            <Button
                                fullWidth
                                variant="contained"
                                color="error"
                                sx={{ fontSize: 20 }}
                                startIcon={<CancelRounded />}
                                onClick={handleGoBack}
                            >
                                {t('common.cancel')}
                            </Button>
                        </CardActions>
                    </>
                )}
            </Card>
        </Container>
    );
};

export default EditLocation;
