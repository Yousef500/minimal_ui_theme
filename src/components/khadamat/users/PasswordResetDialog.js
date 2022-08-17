import { CancelOutlined, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, DialogActions, DialogContent, DialogTitle, Stack, Button } from '@mui/material';
import usersService from 'src/config/axios/usersService';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Center from '../general/Center';
import InputField from '../general/InputField';

const PasswordResetDialog = ({ username, setDialogStatus }) => {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        mode: 'onTouched',
    });

    const watchPassword = watch('newPassword');

    const handlePasswordReset = async ({ newPassword }) => {
        setLoading(true);
        try {
            const { data } = await usersService.resetPassword({ username, newPassword });
            console.log({ data });
            setDialogStatus(false);
            toast.success('تم تغيير كلمة المرور بنجاح');
        } catch (err) {
            console.log({ err });
            toast.error(err.response?.data?.Message ?? t('common.error.unknown'));
        }
        setLoading(false);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(handlePasswordReset)}>
            <DialogTitle>
                <Center>إعادة تعيين كلمة المرور</Center>
            </DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={2} justifyContent="center" pt={5}>
                    <InputField
                        fullWidth
                        label="اسم المستخدم"
                        value={username}
                        type="text"
                        disabled
                        focused
                    />
                    <InputField
                        fullWidth
                        label="كلمة المرور الجديدة"
                        type="password"
                        {...register('newPassword', { required: true })}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword?.message}
                    />
                    <InputField
                        fullWidth
                        label="تأكيد كلمة المرور الجديدة"
                        type="password"
                        {...register('confirmPassword', {
                            required: true,
                            validate: (val) =>
                                watchPassword === val || 'لا يتطابق مع كلمة المرور الجديدة',
                        })}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Stack direction="row" spacing={5} justifyContent="space-between" width={'100%'}>
                    <LoadingButton
                        fullWidth
                        loading={loading}
                        variant="contained"
                        color="success"
                        startIcon={<Save />}
                        type="submit"
                    >
                        حفظ
                    </LoadingButton>
                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        startIcon={<CancelOutlined />}
                        onClick={() => setDialogStatus(false)}
                    >
                        الغاء
                    </Button>
                </Stack>
            </DialogActions>
        </Box>
    );
};

export default PasswordResetDialog;
