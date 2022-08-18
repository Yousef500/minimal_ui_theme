import { useState } from 'react';
// form
// @mui
import { Login } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Stack } from '@mui/material';
// routes
// hooks
import InputField from 'src/components/khadamat/general/InputField';
// components
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import usersService from 'src/config/axios/usersService';
import { setCurrentUser } from 'src/redux/slices/currentUserSlice';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function LoginForm({ t }) {
    // const { login } = useAuth();

    // const isMountedRef = useIsMountedRef();
    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm({
        mode: 'onChange',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const LoginSchema = Yup.object().shape({
    //     email: Yup.string()
    //         .email('Email must be a valid email address')
    //         .required('Email is required'),
    //     password: Yup.string().required('Password is required'),
    // });

    // const defaultValues = {
    //     email: 'demo@minimals.cc',
    //     password: 'demo1234',
    //     remember: true,
    // };

    // const methods = useForm({
    //     resolver: yupResolver(LoginSchema),
    //     defaultValues,
    // });

    // const {
    //     reset,
    //     setError,
    //     handleSubmit,
    //     formState: { errors, isSubmitting },
    // } = methods;

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // await login(data.email, data.password);
            console.log(data);
            const { data: user } = await usersService.login(data);
            dispatch(setCurrentUser(user));
            setLoading(false);
            navigate('/dead');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.Message || t('common.error.wrongCreds'));
            setLoading(false);

            // reset();

            // if (isMountedRef.current) {
            //     setError('afterSubmit', { ...error, message: error.message });
            // }
        }
    };

    return (
        // <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} direction="column" component="form" onSubmit={handleSubmit(onSubmit)}>
            {/* {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>} */}

            <InputField
                label={t('accounts.users.username')}
                {...register('username', { required: true })}
                error={!!errors.username}
                helperText={errors.username?.message}
            />

            <InputField
                label={t('accounts.users.password')}
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: true })}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                <Iconify
                                    icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                                />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                error={!!errors.password}
                helperText={errors.password?.message}
            />
            <LoadingButton
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                loading={loading}
                startIcon={<Login />}
                loadingPosition="start"
                disabled={!isValid}
            >
                {t('accounts.signIn')}
            </LoadingButton>

            {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
          Forgot password?
        </Link>
      </Stack> */}
        </Stack>

        // </FormProvider>
    );
}
