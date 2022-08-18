import { encode } from '@googlemaps/polyline-codec';
import { CancelOutlined, SaveOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import { GoogleMap, Polygon } from '@react-google-maps/api';
import Center from 'src/components/khadamat/general/Center';
import InputField from 'src/components/khadamat/general/InputField';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import cemeteriesService from 'src/config/axios/cemeteriesService';
import decodeShapePath from 'src/config/decodeShapePath';
import { setCemeteriesPageNo } from 'src/redux/slices/cemeteriesSlice';

const EditCemetery = () => {
    const [loadingDefaults, setLoadingDefaults] = useState(true);
    const [paths, setPaths] = useState([]);
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const [saving, setSaving] = useState(false);
    const [mapError, setMapError] = useState(null);
    const polygonRef = useRef(null);
    const listeners = useRef([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const page = useLocation().search.split('page=')[1];
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        setValue,
    } = useForm();

    const options = {
        strokeColor: '#55DE7C',
        fillColor: '#55DE7C',
        fillOpacity: 0.1,
        editable: true,
        draggable: true,
    };

    useEffect(() => {
        (async () => {
            try {
                dispatch(setCemeteriesPageNo(1));
                const { data: cemData } = await cemeteriesService.searchCemeteries({ id });
                const cem = cemData.PagedList[0];
                setPaths(decodeShapePath(cem.shapePath));
                reset({
                    nameFl: cem.NameFl,
                    nameSl: cem.NameSl,
                    address: cem.Address,
                    locationLat: cem.LocationLat,
                    locationLong: cem.LocationLong,
                });
                setLoadingDefaults(false);
            } catch (err) {
                console.log({ err });
                toast.error(t('common.error.unknown'));
                setLoadingDefaults(false);
            }
        })();
    }, [id]);

    const onEdit = useCallback(() => {
        if (polygonRef.current) {
            const newPaths = polygonRef.current
                .getPath()
                .getArray()
                .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));

            setPaths(newPaths);

            // setValue("locationLat", newPaths[0].lat);
            // setValue("locationLong", newPaths[0].lng);
        }
    }, [setPaths]);

    const onLoad = useCallback(
        (polygon) => {
            polygonRef.current = polygon;
            const path = polygon.getPath();
            listeners.current.push(
                path.addListener('set_at', onEdit),
                path.addListener('insert_at', onEdit),
                path.addListener('remove_at', onEdit)
            );
        },
        [onEdit]
    );

    const onMapLoad = useCallback(() => {
        setCenter({ lat: paths[0].lat, lng: paths[0].lng });
    }, [paths]);

    const handleMapClick = (e) => {
        if (paths.length < 4) {
            setPaths([...paths, { lat: e.latLng.lat(), lng: e.latLng.lng() }]);
        }
        if (paths.length === 3) {
            setMapError('');
        }
    };

    const onUnmount = () => {
        listeners.current.forEach((list) => list.remove());
        polygonRef.current = null;
    };

    const handleGoBack = () => {
        if (Number(page) > 1) {
            dispatch(setCemeteriesPageNo(Number(page)));
        }
        navigate('/dead/cemeteries');
    };

    const handleEditCemetery = async (data) => {
        if (paths.length > 3) {
            try {
                setSaving(true);
                const { data: editRes } = await cemeteriesService.editCemetery({
                    id,
                    ...data,
                    locationLat: paths[0].lat,
                    locationLong: paths[0].lng,
                    shapePath: encode(paths, 5),
                });

                console.log({
                    id,
                    ...data,
                    locationLat: paths[0].lat,
                    locationLong: paths[0].lng,
                    shapePath: encode(paths, 5),
                });

                console.log({ editRes });
                toast.success(t('common.success.edit'));
                setSaving(false);
                handleGoBack();
            } catch (err) {
                console.log({ err });
                toast.error(t('common.error.unknown'));
                setSaving(false);
            }
        } else {
            setMapError(t('ekram.cemeteries.locationErr'));
        }
    };

    return (
        <Container maxWidth={'xl'}>
            {loadingDefaults ? (
                <Center my={10}>
                    <CircularProgress size={100} color="success" />
                </Center>
            ) : (
                <Card
                    sx={{ py: 5, borderRadius: 5 }}
                    component="form"
                    onSubmit={handleSubmit(handleEditCemetery)}
                >
                    <CardHeader
                        title={t('ekram.cemeteries.edit')}
                        titleTypographyProps={{
                            variant: 'h2',
                            gutterBottom: true,
                            align: 'center',
                        }}
                    />
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <InputField
                                    fullWidth
                                    label={t('common.arName')}
                                    {...register('nameFl', { required: true })}
                                    type="text"
                                    error={!!errors.NameFl}
                                    helperText={errors.nameFl?.Message}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <InputField
                                    fullWidth
                                    label={t('common.enName')}
                                    {...register('nameSl', { required: true })}
                                    type="text"
                                    error={!!errors.nameSl}
                                    helperText={errors.nameSl?.Message}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <InputField
                                    fullWidth
                                    label={t('ekram.cemeteries.address')}
                                    {...register('address', { required: true })}
                                    type="text"
                                    error={!!errors.address}
                                    helperText={errors.address?.Message}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h4" gutterBottom>
                                    {t('ekram.cemeteries.location')}
                                </Typography>
                            </Grid>

                            {/* <Grid item xs={12} md={6}>
                                <InputField
                                    fullWidth
                                    label="خط العرض"
                                    {...register("locationLat", { required: true })}
                                    type="text"
                                    error={!!errors.locationLat}
                                    helperText={errors.locationLat?.Message}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <InputField
                                    fullWidth
                                    label="خط الطول"
                                    {...register("locationLong", { required: true })}
                                    type="text"
                                    error={!!errors.locationLong}
                                    helperText={errors.locationLong?.Message}
                                />
                            </Grid> */}
                        </Grid>
                    </CardContent>
                    <CardMedia component="div">
                        <GoogleMap
                            onLoad={onMapLoad}
                            mapContainerStyle={{
                                height: 600,
                                width: '100%',
                            }}
                            center={center}
                            zoom={10}
                            onClick={handleMapClick}
                        >
                            {paths.length ? (
                                <Polygon
                                    paths={paths}
                                    options={options}
                                    onLoad={onLoad}
                                    onDragEnd={onEdit}
                                    onMouseUp={onEdit}
                                    onUnmount={onUnmount}
                                    onRightClick={() => setPaths([])}
                                />
                            ) : (
                                ''
                            )}
                        </GoogleMap>
                    </CardMedia>
                    {mapError ? (
                        <Typography color={'error'} align="center">
                            {mapError}
                        </Typography>
                    ) : (
                        ''
                    )}
                    <CardActions>
                        <Stack
                            width={'100%'}
                            direction="row"
                            spacing={3}
                            justifyContent="space-between"
                            mt={2}
                        >
                            <LoadingButton
                                fullWidth
                                loading={saving}
                                variant="contained"
                                color="success"
                                startIcon={<SaveOutlined />}
                                loadingPosition="start"
                                type="submit"
                                disabled={!isValid || paths?.length < 4}
                            >
                                {t('common.save')}
                            </LoadingButton>
                            <Button
                                fullWidth
                                variant="contained"
                                color="error"
                                startIcon={<CancelOutlined />}
                                onClick={handleGoBack}
                            >
                                {t('common.cancel')}
                            </Button>
                        </Stack>
                    </CardActions>
                </Card>
            )}
        </Container>
    );
};

export default EditCemetery;
