import { CloseRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Fade,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    InputAdornment,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import deadService from 'src/config/axios/deadServices';
import nationalitiesService from 'src/config/axios/nationalitiesService';
import i18n from 'src/locales/i18n';
import { setDead, setDeadFilters } from 'src/redux/slices/deadSlice';
import { setAllNats } from 'src/redux/slices/nationalitiesSlice';
import Center from '../general/Center';
import InputField from '../general/InputField';

const DeadFilterDialog = ({ open, onClose, register, handleSubmit, control }) => {
    const [loading, setLoading] = useState(false);
    const [natsLoading, setNatsLoading] = useState(true);
    const { allNats } = useSelector((state) => state.nationalities);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const sortOptions = [
        {
            label: t('common.name'),
            value: i18n.language === 'en' ? 'NameSl' : 'NameFl',
        },
        {
            label: t('common.id'),
            value: 'NationalNumber',
        },
        {
            label: t('common.nat'),
            value: 'NationalityName',
        },
        {
            label: t('ekram.dead.deathDate'),
            value: 'DateOfDeath',
        },
    ];

    useEffect(() => {
        (async () => {
            try {
                const { data: nationalities } = await nationalitiesService.getAll();
                dispatch(setAllNats(nationalities));
                setNatsLoading(false);
            } catch (err) {
                console.log({ err });
                toast.error(t('common.error.unknown'));
                setNatsLoading(false);
            }
        })();
    }, []);

    const handleFilterSubmit = async (data) => {
        setLoading(true);
        try {
            const dateOfDeathFrom = data.dateOfDeathFrom
                ? new Date(data.dateOfDeathFrom).toISOString()
                : null;

            const dateOfDeathTO = data.dateOfDeathTO
                ? new Date(data.dateOfDeathTO).toISOString()
                : null;

            const dateOfDeath = data.dateOfDeath ? new Date(data.dateOfDeath).toISOString() : null;

            dispatch(
                setDeadFilters({
                    ...data,
                    nationality: data.nationality?.StringValue,
                    dateOfDeath,
                    dateOfDeathFrom,
                    dateOfDeathTO,
                })
            );

            const { data: filteredDead } = await deadService.searchDead();

            dispatch(setDead(filteredDead));

            setLoading(false);
            onClose();
        } catch (err) {
            console.log({ err });
            toast.error(t('common.error.unknown'));
            setLoading(false);
        }
    };

    return (
        <Dialog fullScreen open={open} onClose={onClose} TransitionProps={{ unmountOnExit: true }}>
            <DialogTitle>
                <Center mb={2}>
                    <Fab
                        color="error"
                        onClick={onClose}
                        sx={{ fontSize: 20, ml: 'auto' }}
                        size={'small'}
                    >
                        <CloseRounded />
                    </Fab>
                    <Typography align="center" width={'100%'}>
                        {t('common.filter')}
                    </Typography>
                </Center>
            </DialogTitle>

            <DialogContent>
                <Box component="form" onSubmit={handleSubmit(handleFilterSubmit)}>
                    <Grid container spacing={3} justifyContent="center" mt={2}>
                        <Grid item xs={12} md={6}>
                            <InputField
                                fullWidth
                                {...register('name')}
                                type="text"
                                label={t('common.name')}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <InputField
                                fullWidth
                                {...register('nationalNumber')}
                                type="number"
                                label={t('common.id')}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                control={control}
                                name="nationality"
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        value={field.value || null}
                                        onChange={(e, val) => field.onChange(val)}
                                        options={allNats}
                                        getOptionLabel={(opt) => opt.StringValue}
                                        isOptionEqualToValue={(opt, val) => opt.Key === val.Key}
                                        renderInput={(params) => (
                                            <InputField
                                                {...params}
                                                fullWidth
                                                type="text"
                                                label={t('common.nat')}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: natsLoading ? (
                                                        <InputAdornment position="end">
                                                            <CircularProgress />
                                                        </InputAdornment>
                                                    ) : (
                                                        params.InputProps.endAdornment
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
                            <Controller
                                render={({ field }) => (
                                    <DatePicker
                                        color="info"
                                        disableFuture
                                        views={['year', 'month', 'day']}
                                        {...field}
                                        label={t('ekram.dead.deathDate')}
                                        renderInput={(params) => (
                                            <TextField fullWidth {...params} />
                                        )}
                                    />
                                )}
                                name="dateOfDeath"
                                control={control}
                            />
                            {/* </LocalizationProvider> */}
                        </Grid>

                        <Grid item xs={12} md={6}>
                            {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
                            <Controller
                                render={({ field }) => (
                                    <DatePicker
                                        color="info"
                                        disableFuture
                                        views={['year', 'month', 'day']}
                                        {...field}
                                        label={t('ekram.dead.deathDateFrom')}
                                        renderInput={(params) => (
                                            <TextField fullWidth {...params} />
                                        )}
                                    />
                                )}
                                name="dateOfDeathFrom"
                                control={control}
                            />
                            {/* </LocalizationProvider> */}
                        </Grid>

                        <Grid item xs={12} md={6}>
                            {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
                            <Controller
                                render={({ field }) => (
                                    <DatePicker
                                        color="info"
                                        disableFuture
                                        views={['year', 'month', 'day']}
                                        {...field}
                                        label={t('ekram.dead.deathDateTo')}
                                        renderInput={(params) => (
                                            <TextField fullWidth {...params} />
                                        )}
                                    />
                                )}
                                name="dateOfDeathTO"
                                control={control}
                            />
                            {/* </LocalizationProvider> */}
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        value={field.value || null}
                                        onChange={(e, val) => field.onChange(val)}
                                        options={sortOptions}
                                        isOptionEqualToValue={(opt, val) => opt.label === val.label}
                                        renderInput={(params) => (
                                            <InputField {...params} label={t('common.sortBy')} />
                                        )}
                                    />
                                )}
                                control={control}
                                name="sortBy"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl>
                                <FormLabel>{t('common.order')}</FormLabel>
                                <Controller
                                    defaultValue={''}
                                    render={({ field }) => (
                                        <RadioGroup row {...field}>
                                            <FormControlLabel
                                                label={t('common.asc')}
                                                value={0}
                                                control={<Radio />}
                                            />

                                            <FormControlLabel
                                                label={t('common.desc')}
                                                value={1}
                                                control={<Radio />}
                                            />
                                        </RadioGroup>
                                    )}
                                    name="orderby"
                                    control={control}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3} lg={1}>
                            <FormControlLabel
                                label={t('common.active')}
                                control={
                                    <Controller
                                        render={({ field }) => <Checkbox {...field} />}
                                        name="isActive"
                                        control={control}
                                    />
                                }
                            />
                        </Grid>
                    </Grid>
                    <Stack
                        direction="row"
                        width="100%"
                        spacing={5}
                        justifyContent={'space-between'}
                        mt={2}
                    >
                        <LoadingButton
                            fullWidth
                            loading={loading}
                            variant="contained"
                            color="success"
                            type={'submit'}
                        >
                            {t('common.filter')}
                        </LoadingButton>
                        <Button fullWidth color="error" variant="contained" onClick={onClose}>
                            {t('common.cancel')}
                        </Button>
                    </Stack>
                </Box>
            </DialogContent>
            {/* <DialogActions> */}
            {/* </DialogActions> */}
        </Dialog>
    );
};

export default DeadFilterDialog;
