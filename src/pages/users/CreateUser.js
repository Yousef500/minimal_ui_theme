import { LoadingButton } from '@mui/lab';
import {
    Button,
    Checkbox,
    Container,
    Divider,
    FormControlLabel,
    Grid,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import InputField from 'src/components/khadamat/general/InputField';
import JobsAutoComplete from 'src/components/khadamat/users/JobsAutoComplete';
import ManagerAutoComplete from 'src/components/khadamat/users/ManagerAutoComplete';
import RolesAutoComplete from 'src/components/khadamat/users/RolesAutoComplete';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import usersService from 'src/config/axios/usersService';

const CreateUser = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        control,
        setValue,
    } = useForm({
        mode: 'onTouched',
    });

    const watchIsCompany = watch('isCompany');
    const watchJob = watch('job');

    const handleCreateUser = async (data) => {
        setLoading(true);
        try {
            const { confirmPassword, roles, job, manager, ...userData } = data;
            const securityRolesList = roles.map((role) => role.Key);
            console.log({
                ...userData,
                securityRolesList,
                securityUserJobId: job.Key,
                managerId: managers.length ? manager.Key : '',
                companyName: userData.isCompany ? userData.companyName : '',
            });
            const addUserRes = await usersService.addUser({
                ...userData,
                securityRolesList,
                securityUserJobId: job.Key,
                managerId: managers.length ? manager.Key : '',
                companyName: userData.isCompany ? userData.companyName : '',
            });

            navigate('/users/management');
            toast.success(t('common.success.add'));
        } catch (err) {
            console.log({ err });
            toast.error(err.response.data.Message ?? t('common.error.unknown'));
        }
        setLoading(false);
    };

    return (
        <Container
            component={Paper}
            elevation={10}
            maxWidth="xl"
            sx={{ py: 10, mb: 5, mx: 'auto', borderRadius: 10 }}
        >
            <Grid
                container
                spacing={{ xs: 1, sm: 2, lg: 3 }}
                m="auto"
                component="form"
                onSubmit={handleSubmit(handleCreateUser)}
            >
                <Grid item xs={12}>
                    <Typography variant="h1" gutterBottom align="center">
                        {t('accounts.users.add')}
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h3" gutterBottom>
                        {t('common.personalData')}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <InputField
                        fullWidth
                        label={`${t('common.arName')} *`}
                        type="text"
                        {...register('nameFl', {
                            required: true,
                        })}
                        error={!!errors.nameFl}
                        helperText={errors.nameFl?.message}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <InputField
                        fullWidth
                        label={`${t('common.enName')} *`}
                        type="text"
                        {...register('nameSl')}
                        error={!!errors.nameSl}
                        helperText={errors.nameSl?.message}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <InputField
                        fullWidth
                        label={`${t('common.phone')} *`}
                        type="number"
                        {...register('mobile', {
                            required: true,
                            maxLength: {
                                value: 12,
                                message: t('accounts.users.phoneLen'),
                            },
                            minLength: {
                                value: 12,
                                message: t('accounts.users.phoneLen'),
                            },
                        })}
                        error={!!errors.mobile}
                        helperText={errors.mobile?.message}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <InputField
                        fullWidth
                        label={`${t('common.id')} *`}
                        type="number"
                        {...register('nationalNumber', {
                            required: true,
                            maxLength: {
                                message: t('accounts.users.idLen'),
                                value: 10,
                            },
                            minLength: {
                                message: t('accounts.users.idLen'),
                                value: 10,
                            },
                            pattern: {
                                message: t('accounts.users.idPattern'),
                                value: /^1|^2\d*/,
                            },
                        })}
                        error={!!errors.nationalNumber}
                        helperText={errors.nationalNumber?.message}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <InputField
                        fullWidth
                        label={`${t('common.email')} *`}
                        type="email"
                        {...register('email', {
                            required: true,
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <InputField
                        fullWidth
                        label={t('accounts.users.jobNo')}
                        type="number"
                        {...register('jobNumber', {
                            maxLength: {
                                message: t('accounts.users.jobNoLen'),
                                value: 8,
                            },
                            minLength: {
                                message: t('accounts.users.jobNoLen'),
                                value: 8,
                            },
                        })}
                        error={!!errors.jobNumber}
                        helperText={errors.jobNumber?.message}
                    />
                </Grid>

                <Grid item xs={6}>
                    <JobsAutoComplete
                        control={control}
                        label={`${t('accounts.users.job')} *`}
                        setManagers={setManagers}
                        setValue={setValue}
                    />
                </Grid>

                <Grid item xs={6}>
                    <RolesAutoComplete label={`${t('accounts.users.role')} *`} control={control} />
                </Grid>

                <Grid item xs={6} display={!managers.length ? 'none' : ''}>
                    <ManagerAutoComplete
                        label={`${t('accounts.users.manager')} *`}
                        managers={managers}
                        control={control}
                    />
                </Grid>

                <Grid item xs={4} sm={2} md={2} lg={1}>
                    <FormControlLabel
                        label={
                            <Typography display={'inline'} variant="subtitle1">
                                {t('common.active')}
                            </Typography>
                        }
                        control={<Checkbox {...register('isActive')} />}
                    />
                </Grid>

                <Grid item xs={6} />

                <Grid item xs={4} sm={2} md={2}>
                    <FormControlLabel
                        label={
                            <Typography display="inline" variant="subtitle1">
                                {t('accounts.users.companyAcc')}
                            </Typography>
                        }
                        control={<Checkbox {...register('isCompany')} />}
                    />
                </Grid>

                <Grid item xs={6} display={!watchIsCompany && 'none'}>
                    <InputField
                        fullWidth
                        label={t('accounts.users.companyName')}
                        type="text"
                        {...register('companyName')}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h3">بيانات الحساب</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <InputField
                        fullWidth
                        label={`${t('accounts.users.username')}`}
                        type="text"
                        {...register('username', {
                            required: true,
                        })}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <InputField
                        fullWidth
                        label={`${t('accounts.users.password')}`}
                        type="password"
                        {...register('password', {
                            required: true,
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <InputField
                        fullWidth
                        label={`${t('accounts.users.passwordConfirm')}`}
                        type="password"
                        {...register('confirmPassword', {
                            required: true,
                            validate: (val) => {
                                return (
                                    val === watch('password') ||
                                    t('accounts.users.passwordConfirmErr')
                                );
                            },
                        })}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={12}>
                    <Stack direction="row" spacing={5} justifyContent="space-between">
                        <LoadingButton
                            loading={loading}
                            color="success"
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={!isValid}
                        >
                            {t('common.save')}
                        </LoadingButton>

                        <Button
                            component={Link}
                            to="/users/management"
                            variant="contained"
                            fullWidth
                            color="error"
                        >
                            {t('common.cancel')}
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CreateUser;
