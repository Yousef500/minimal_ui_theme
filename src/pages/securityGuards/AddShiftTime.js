import { CancelRounded, SaveRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Card, CardActions, CardContent, CardHeader, Container, Grid, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import InputField from 'src/components/khadamat/general/InputField';
import shiftTimesService from 'src/config/axios/shiftTimesService';

const AddShiftTime = () => {
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        control,
    } = useForm({
        mode: 'onTouched',
    });

    const handleAddShiftTime = async (data) => {
        try {
            setSaving(true);
            await shiftTimesService.addShiftTime({
                ...data,
                shiftTimeFrom: dayjs(data.shiftTimeFrom).format('hh:mm:ss'),
                shiftTimeTo: dayjs(data.shiftTimeTo).format('hh:mm:ss'),
            });
            setSaving(false);
            toast.success(t('common.success.add'));
            navigate('/securityGuards/shiftTimes');
        } catch (err) {
            console.log({ err });
            setSaving(false);
            toast.error(err.response?.data?.Message || t('common.error.unknown'));
        }
    };

    return (
        <Container maxWidth="xl">
            <Card component={'form'} onSubmit={handleSubmit(handleAddShiftTime)}>
                <CardHeader
                    title={t('securityGuards.shiftTimes.add')}
                    titleTypographyProps={{ align: 'center', variant: 'h2', gutterBottom: true }}
                />
                <CardContent>
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
                                        val > getValues('shiftTimeFrom') || t('securityGuards.shiftTimes.timeErr'),
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
                </CardContent>
                <CardActions>
                    <LoadingButton
                        fullWidth
                        variant="contained"
                        loading={saving}
                        startIcon={<SaveRounded />}
                        loadingPosition="start"
                        type="submit"
                        sx={{ fontSize: 18 }}
                    >
                        {t('common.save')}
                    </LoadingButton>

                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<CancelRounded />}
                        sx={{ fontSize: 18 }}
                        onClick={() => navigate('/securityGuards/shiftTimes')}
                    >
                        {t('common.cancel')}
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
};

export default AddShiftTime;
