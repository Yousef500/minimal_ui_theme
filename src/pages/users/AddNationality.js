import { AddCardSharp, CancelOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Container,
    Grid,
    Stack,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import InputField from 'src/components/khadamat/general/InputField';
import nationalitiesService from 'src/config/axios/nationalitiesService';

const AddNationality = () => {
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm({
        mode: 'onTouched',
    });

    const goBack = () => {
        navigate('/users/nationalities');
    };

    const handleAddNat = async (data) => {
        setSaving(true);
        try {
            const { data: addNatRes } = await nationalitiesService.addNat(data);
            console.log({ addNatRes });
            setSaving(false);
            toast.success(t('common.success.add'));
            goBack();
        } catch (err) {
            console.log({ err });
            toast.error(t('common.error.unknown'));
            setSaving(false);
        }
    };

    return (
        <Container>
            <Card component="form" sx={{ borderRadius: 0 }} onSubmit={handleSubmit(handleAddNat)}>
                <CardHeader
                    title={t('accounts.nationalities.add')}
                    titleTypographyProps={{
                        align: 'center',
                        variant: 'h2',
                        gutterBottom: true,
                    }}
                />

                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <InputField
                                fullWidth
                                label={t('common.arName')}
                                {...register('nameFl', { required: true })}
                                error={!!errors.nameFl}
                                helperText={errors.nameFl?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InputField
                                fullWidth
                                label={t('common.enName')}
                                {...register('nameSl', { required: true })}
                                error={!!errors.nameSl}
                                helperText={errors.nameSl?.message}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Stack
                        direction="row"
                        spacing={3}
                        justifyContent={'center'}
                        width={'100%'}
                        m={2}
                    >
                        <LoadingButton
                            fullWidth
                            type="submit"
                            loading={saving}
                            variant="contained"
                            color="success"
                            startIcon={<AddCardSharp />}
                            loadingPosition="start"
                            disabled={!isValid}
                            sx={{ fontSize: 18, borderRadius: 0 }}
                        >
                            {t('common.add')}
                        </LoadingButton>

                        <Button
                            fullWidth
                            onClick={goBack}
                            variant="contained"
                            color="error"
                            startIcon={<CancelOutlined />}
                            sx={{ fontSize: 18, borderRadius: 0 }}
                        >
                            {t('common.cancel')}
                        </Button>
                    </Stack>
                </CardActions>
            </Card>
        </Container>
    );
};

export default AddNationality;
