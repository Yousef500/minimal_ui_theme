import { CancelRounded, SaveRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import shiftTimesService from 'src/config/axios/shiftTimesService';
import { setShiftTimes } from 'src/redux/slices/shiftTimesSlice';
import Center from '../general/Center';
import InputField from '../general/InputField';

const EditShiftTime = ({ t, open, onClose, id }) => {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        control,
        getValues,
        reset,
    } = useForm({
        mode: "all"
    });

    useEffect(() => {
        (async () => {
            try {
                const { data } = await shiftTimesService.getShiftTime(id);
                reset({
                    id,
                    shiftTitle: data.ShiftTitle,
                    shiftTimeFrom: dayjs(`2019-01-01 ${data.ShiftTimeFrom}`),
                    shiftTimeTo: dayjs(`2019-01-01 ${data.ShiftTimeTo}`),
                });
                setLoading(false);
            } catch (err) {
                console.log({ err });
                setLoading(false);
                toast.error(t('common.error.unknown'));
            }
        })();
    }, [id]);

    const handleEditShift = async (data) => {
        console.log({
            ...data,
            shiftTimeFrom: dayjs(data.shiftTimeFrom).format('HH:mm:ss'),
            shiftTimeTo: dayjs(data.shiftTimeTo).format('HH:mm:ss'),
        });
        try {
            setSaving(true);
            await shiftTimesService.editShiftTime({
                ...data,
                shiftTimeFrom: dayjs(data.shiftTimeFrom).format('HH:mm:ss'),
                shiftTimeTo: dayjs(data.shiftTimeTo).format('HH:mm:ss'),
            });
            const { data: newShifts } = await shiftTimesService.searchShiftTimes();
            dispatch(setShiftTimes(newShifts));
            setSaving(false);
            toast.success(t('common.success.edit'));
            onClose();
        } catch (err) {
            console.log({ err });
            setSaving(false);
            toast.error(err.response?.data?.Message || t('common.error.unknown'));
        }
    };

    return (
        <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
            <DialogTitle>
                <Typography variant="inherit" align="center" gutterBottom>
                    {t('securityGuards.shiftTimes.edit')}
                </Typography>
            </DialogTitle>
            <Box
                display={'flex'}
                flexDirection="column"
                component="form"
                py={2}
                onSubmit={handleSubmit(handleEditShift)}
            >
                {loading ? (
                    <Center my={5}>
                        <CircularProgress size={50} color="info" />
                    </Center>
                ) : (
                    <>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <InputField
                                        fullWidth
                                        required
                                        label={t('common.name')}
                                        {...register('shiftTitle', { required: true })}
                                        error={!!errors.shiftTitle}
                                        helperText={errors.shiftTitle?.message}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="shiftTimeFrom"
                                        rules={{ required: true }}
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <TimePicker
                                                {...field}
                                                value={field.value || null}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        required
                                                        label={t('securityGuards.shiftTimes.from')}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        control={control}
                                        name="shiftTimeTo"
                                        rules={{
                                            required: true,
                                            validate: (val) =>
                                                val > getValues('shiftTimeFrom') ||
                                                t('securityGuards.shiftTimes.timeErr'),
                                        }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TimePicker
                                                {...field}
                                                value={field.value || null}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        required
                                                        label={t('securityGuards.shiftTimes.to')}
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>

                        <DialogActions>
                            <Stack
                                direction="row"
                                spacing={5}
                                alignItems="center"
                                justifyContent={'center'}
                                width="100%"
                                px={3}
                            >
                                <LoadingButton
                                    fullWidth
                                    variant="contained"
                                    color={'primary'}
                                    startIcon={<SaveRounded />}
                                    loading={saving}
                                    loadingPosition="start"
                                    type="submit"
                                    disabled={!isDirty}
                                >
                                    {t('common.save')}
                                </LoadingButton>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color={'error'}
                                    startIcon={<CancelRounded />}
                                    onClick={onClose}
                                >
                                    {t('common.cancel')}
                                </Button>
                            </Stack>
                        </DialogActions>
                    </>
                )}
            </Box>
        </Dialog>
    );
};

export default EditShiftTime;
