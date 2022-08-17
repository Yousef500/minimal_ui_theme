import { CancelOutlined, CheckRounded, SaveRounded, UploadFileRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
    Checkbox,
    CircularProgress,
    Container,
    Divider,
    FormControlLabel,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
    Button,
} from '@mui/material';
import shortUUID from 'short-uuid';
import { blue } from '@mui/material/colors';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { GoogleMap, Marker, Polygon } from '@react-google-maps/api';
import CemeteryInput from 'src/components/khadamat/ekram/CemeteryInput';
import DaysInput from 'src/components/khadamat/ekram/DaysInput';
import GenderInput from 'src/components/khadamat/ekram/GenderInput';
import MonthsInput from 'src/components/khadamat/ekram/MonthsInput';
import NationalityInput from 'src/components/khadamat/ekram/NationalityInput';
import Center from 'src/components/khadamat/general/Center';
import InputField from 'src/components/khadamat/general/InputField';

import deadService from 'src/config/axios/deadServices';
import filesService from 'src/config/axios/filesService';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetDeadFilters, setDeadPageNo } from 'src/redux/slices/deadSlice';

const EditDead = () => {
    const { id } = useParams();
    const page = useLocation().search.split('page=')[1];
    const [loadingData, setLoadingData] = useState(true);
    const [uploaded, setUploaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [file, setFile] = useState();
    const [center, setCenter] = useState({ lat: 24.774265, lng: 46.738586 });
    const [paths, setPaths] = useState([]);
    const [markerCoords, setMarkerCoords] = useState(null);
    const [graveError, setGraveError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch,
        setValue,
        clearErrors,
        getValues,
    } = useForm({
        mode: 'onTouched',
    });

    const watchedGender = watch('gender');
    const child =
        watchedGender?.StringValue === 'طفل- بنت' || watchedGender?.StringValue === 'طفل -ولد';

    useEffect(() => {
        (async () => {
            try {
                dispatch(setDeadPageNo(1));
                dispatch(resetDeadFilters());
                const { data: searchResults } = await deadService.searchDead({ id });
                const defaults = searchResults.PagedList[0];
                reset({
                    ...defaults,
                    DeathTime: dayjs(defaults.DeathTime, 'HH:mm:ss'),
                    months: { label: `${defaults.AgeMonths}`, value: defaults.AgeMonths },
                    days: { label: `${defaults.AgeDays}`, value: defaults.AgeDays },
                    gender: {
                        Key: defaults.HDsLookupGenderTypeId,
                        StringValue: defaults.GenderTypeName,
                    },
                    nationality: {
                        Key: defaults.GTsLookupNationaltyId,
                        StringValue: defaults.NationalityName,
                    },
                    cemetery: {
                        Key: defaults.HDsLookupCemeteryId,
                        StringValue: defaults.CemeteryName,
                    },
                });

                setMarkerCoords({ lat: defaults.LocationLat, lng: defaults.LocationLong });
                setCenter({ lat: defaults.LocationLat, lng: defaults.LocationLong });

                setLoadingData(false);
            } catch (err) {
                console.log({ err });
                setLoadingData(false);
            }
        })();
    }, [id]);

    const handleGoBack = () => {
        dispatch(setDeadPageNo(Number(page)));
        navigate('/dead/management');
    };

    const handleFileChange = (e) => {
        if (e.target.files?.length) {
            setUploaded(false);
            setFile(e.target.files);
            setUploaded(true);
        } else {
            setFile(null);
            setUploaded(false);
        }
    };

    const handlePolyClick = (e) => {
        setMarkerCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        setGraveError('');
    };

    const handleEditDead = async (data) => {
        if (markerCoords) {
            setSaving(true);
            try {
                const fileName = shortUUID.generate();
                if (file?.length) {
                    const formData = new FormData();
                    formData.append('files', file[0], `${fileName}.pdf`);
                    const { data: fileData } = await filesService.upload({
                        files: [...formData.values()],
                        Module: 'HDs',
                        Folder: id,
                    });

                    const { data: updatedPerson } = await deadService.editDead({
                        id,
                        nameFl: data.NameFl,
                        nameSl: data.NameSl,
                        nationalNumber: data.NationalNumber,
                        isCitizen: data.IsCitizen,
                        ageDays: data.days.value,
                        ageMonths: data.months.value,
                        ageYears: data.AgeYears,
                        dateOfDeath: new Date(data.DateOfDeath).toISOString(),
                        deathTime: dayjs(data.DeathTime).format('HH:mm:ss'),
                        registrationNumber: data.RegistrationNumber,
                        columnNumber: data.ColumnNumber,
                        rowNumber: data.RowNumber,
                        squareNumber: data.SquareNumber,
                        deathReason: data.DeathReason,
                        filePath: `${fileName}.pdf`,
                        fileSize: fileData.ExtraData.UploadedFilesSize,
                        hDsLookupGenderTypeId: data.gender.Key,
                        gTsLookupNationaltyId: data.nationality.Key,
                        hDsLookupCemeteryId: data.cemetery.Key,
                        locationLong: markerCoords.lng,
                        locationLat: markerCoords.lat,
                    });

                    handleGoBack();

                    toast.info(t('common.success.edit'));
                }
            } catch (err) {
                console.log({ err });
                toast.error(err.response?.data?.Message ?? t('common.error.unknown'));
                setSaving(false);
            }
            setSaving(false);
        } else {
            setGraveError(t('ekram.dead.graveError'));
        }
    };

    return (
        <Container
            elevation={10}
            component={Paper}
            maxWidth={'xl'}
            sx={{ py: 5, mb: 5, mx: 'auto', borderRadius: 5 }}
        >
            {loadingData ? (
                <Center my={10}>
                    <CircularProgress size={100} color="info" />
                </Center>
            ) : (
                <Grid
                    container
                    spacing={3}
                    component="form"
                    onSubmit={handleSubmit(handleEditDead)}
                >
                    <Grid item xs={12}>
                        <Typography variant="h2" align="center" gutterBottom>
                            {t('ekram.dead.edit')}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h3" gutterBottom>
                            {t('common.personalData')}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InputField
                            fullWidth
                            {...register('NameFl')}
                            type="text"
                            label={`${t('common.arName')} *`}
                            error={!!errors.NameFl}
                            helperText={errors.NameFl?.message}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InputField
                            fullWidth
                            {...register('NameSl')}
                            type="text"
                            label={`${t('common.enName')} *`}
                            error={!!errors.NameSl}
                            helperText={errors.NameSl?.message}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <GenderInput
                            t={t}
                            control={control}
                            setValue={setValue}
                            clearErrors={clearErrors}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <NationalityInput t={t} control={control} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InputField
                            fullWidth
                            {...register('NationalNumber', {
                                pattern: {
                                    message: t('ekram.dead.idPattern'),
                                    value: /^1|2\d*/,
                                },
                                maxLength: {
                                    message: t('ekram.dead.idLen'),
                                    value: 10,
                                },
                                minLength: {
                                    message: t('ekram.dead.idLen'),
                                    value: 10,
                                },
                                required: true,
                            })}
                            type="number"
                            label={t('common.id')}
                            error={!!errors.NationalNumber}
                            helperText={errors.NationalNumber?.message}
                        />
                    </Grid>

                    <Grid item xs={6} sm={4} md={3} lg={2} xl={1.5}>
                        <FormControlLabel
                            label={
                                <Typography variant={'h5'} display="inline">
                                    {t('common.citizen')}
                                </Typography>
                            }
                            control={
                                <Controller
                                    render={({ field }) => (
                                        <Checkbox {...field} checked={field.value} />
                                    )}
                                    name="IsCitizen"
                                    control={control}
                                />
                            }
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InputField
                            fullWidth
                            {...register('RegistrationNumber')}
                            type="string"
                            label={t('ekram.dead.regNo')}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InputField
                            fullWidth
                            {...register('DeathReason', {
                                required: true,
                            })}
                            type="text"
                            label={t('ekram.dead.deathReason')}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            render={({ field, fieldState: { error } }) => (
                                // <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    {...field}
                                    disableFuture
                                    views={['year', 'month', 'day']}
                                    renderInput={(params) => (
                                        <TextField
                                            fullWidth
                                            {...params}
                                            label={t('ekram.dead.deathDate')}
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />
                                // </LocalizationProvider>
                            )}
                            control={control}
                            name="DateOfDeath"
                            rules={{ required: true }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            render={({ field, fieldState: { error } }) => (
                                // <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    {...field}
                                    ampm
                                    inputFormat="HH:mm:ss"
                                    mask="__:__:__"
                                    openTo="hours"
                                    views={['hours', 'minutes', 'seconds']}
                                    renderInput={(params) => (
                                        <TextField
                                            fullWidth
                                            {...params}
                                            label={t('ekram.dead.deathTime')}
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />
                                // </LocalizationProvider>
                            )}
                            control={control}
                            name="DeathTime"
                            rules={{ required: true }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Button
                            startIcon={uploaded ? <CheckRounded /> : <UploadFileRounded />}
                            variant="contained"
                            color={uploaded ? 'success' : 'secondary'}
                            component="label"
                            size="large"
                            sx={{ fontSize: 20 }}
                        >
                            {uploaded ? t('common.fileReady') : t('ekram.dead.deathCert')}
                            <input onChange={handleFileChange} hidden type="file" />
                        </Button>
                    </Grid>

                    {file?.length ? (
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5">{file[0].name}</Typography>
                        </Grid>
                    ) : (
                        ''
                    )}

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h5">{t('common.age')}</Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InputField
                            fullWidth
                            {...register('AgeYears', {
                                required: true,
                                validate: (value) => {
                                    if (child) {
                                        return value < 16 || t('common.childAgeErr');
                                    } else {
                                        return value > 15 || t('common.adultAgeErr');
                                    }
                                },
                            })}
                            type="number"
                            label={t('common.years')}
                            error={!!errors.AgeYears}
                            helperText={errors.AgeYears?.message}
                        />
                    </Grid>

                    {child ? (
                        <>
                            <Grid item xs={12} md={6}>
                                <MonthsInput t={t} control={control} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <DaysInput t={t} control={control} />
                            </Grid>
                        </>
                    ) : (
                        ''
                    )}

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h3" gutterBottom>
                            {t('ekram.dead.cemDetails')}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <CemeteryInput
                            setCenter={setCenter}
                            getValues={getValues}
                            setPaths={setPaths}
                            setMarkerCoords={setMarkerCoords}
                            t={t}
                            control={control}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InputField
                            fullWidth
                            {...register('SquareNumber')}
                            type="number"
                            label={t('ekram.dead.square')}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InputField
                            fullWidth
                            {...register('ColumnNumber')}
                            type="number"
                            label={t('ekram.dead.column')}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InputField
                            fullWidth
                            {...register('RowNumber')}
                            type="number"
                            label={t('ekram.dead.row')}
                        />
                    </Grid>

                    {center ? (
                        <Grid item xs={12}>
                            <Typography gutterBottom align="center">
                                {t('ekram.dead.graveLocation')}
                            </Typography>
                            <GoogleMap
                                center={center}
                                zoom={12}
                                mapContainerStyle={{ width: '100%', height: 500 }}
                            >
                                {paths.length ? (
                                    <Polygon
                                        options={{
                                            strokeColor: blue[300],
                                            fillColor: blue[300],
                                            fillOpacity: 0.1,
                                        }}
                                        paths={paths}
                                        onMouseUp={handlePolyClick}
                                    />
                                ) : (
                                    ''
                                )}
                                {markerCoords ? <Marker position={markerCoords} /> : ''}
                            </GoogleMap>
                        </Grid>
                    ) : (
                        ''
                    )}

                    {graveError ? (
                        <Grid item xs={12}>
                            <Typography color="error" align="center" gutterBottom>
                                {graveError}
                            </Typography>
                        </Grid>
                    ) : (
                        ''
                    )}

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    <Grid item xs={12}>
                        <Stack direction="row" spacing={5} justifyContent="space-between">
                            <LoadingButton
                                fullWidth
                                variant="contained"
                                color="success"
                                type="submit"
                                loading={saving}
                                startIcon={<SaveRounded />}
                                sx={{ fontSize: 18 }}
                                disabled={!isValid || !markerCoords}
                            >
                                {t('common.save')}
                            </LoadingButton>

                            <Button
                                fullWidth
                                variant="contained"
                                color="error"
                                sx={{ fontSize: 18 }}
                                startIcon={<CancelOutlined />}
                                onClick={handleGoBack}
                            >
                                {t('common.cancel')}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default EditDead;
