import { CancelOutlined, SaveOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    Grid,
    Stack,
    Button,
} from '@mui/material';
import Center from 'src/components/khadamat/general/Center';
import InputField from 'src/components/khadamat/general/InputField';

import { toast } from 'react-toastify';
import nationalitiesService from 'src/config/axios/nationalitiesService';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const EditNationality = () => {
    const [saving, setSaving] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const { id } = useParams();
    // const page = Number(useLocation().search.split("page=")[1]);
    const navigate = useNavigate();
    // const dispatch = useDispatch();
    const { t } = useTranslation();
    const {
        register,
        formState: { errors, isDirty, isValid },
        handleSubmit,
        reset,
    } = useForm({
        mode: 'onTouched',
    });

    useEffect(() => {
        (async () => {
            try {
                // dispatch(setNatsPageNo(1));
                const { data: nats } = await nationalitiesService.searchNats({ id });
                const nat = nats.PagedList.find((nati) => nati.Id === id);
                reset(nat);
                setLoadingData(false);
            } catch (err) {
                console.log({ err });
                setLoadingData(false);
                toast.error(t('common.error.unknown'));
            }
        })();
    }, [id]);

    const goBack = () => {
        // if (page > 1) {
        //     dispatch(setNatsPageNo(page));
        // }
        navigate('/users/nationalities');
    };

    const handleEditNat = async (data) => {
        if (isDirty) {
            setSaving(true);
            try {
                const { data: addNatRes } = await nationalitiesService.editNat({
                    id: data.Id,
                    nameFl: data.NameFl,
                    nameSl: data.NameSl,
                });
                console.log({ addNatRes });
                setSaving(false);
                toast.success(t('common.success.add'));
                goBack();
            } catch (err) {
                console.log({ err });
                toast.error(t('common.error.unknown'));
                setSaving(false);
            }
        }
    };

    return (
        <Container maxWidth={'xl'}>
            <Card component="form" sx={{ borderRadius: 0 }} onSubmit={handleSubmit(handleEditNat)}>
                <CardHeader
                    title={t('accounts.nationalities.edit')}
                    titleTypographyProps={{
                        align: 'center',
                        variant: 'h2',
                        gutterBottom: true,
                    }}
                />
                {loadingData ? (
                    <Center my={20}>
                        <CircularProgress size={100} />
                    </Center>
                ) : (
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <InputField
                                    fullWidth
                                    label={t('common.arName')}
                                    {...register('NameFl', { required: true })}
                                    error={!!errors.NameFl}
                                    helperText={errors.NameFl?.message}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InputField
                                    fullWidth
                                    label={t('common.enName')}
                                    {...register('NameSl', { required: true })}
                                    error={!!errors.NameSl}
                                    helperText={errors.NameSl?.message}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                )}

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
                            startIcon={<SaveOutlined />}
                            loadingPosition="start"
                            disabled={!isDirty || !isValid}
                            sx={{ fontSize: 18, borderRadius: 0 }}
                        >
                            {t('common.save')}
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

export default EditNationality;
