import { DeleteOutlineRounded, EditOutlined } from '@mui/icons-material';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Link,
    Stack,
} from '@mui/material';
//
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';

import cemeteriesService from 'src/config/axios/cemeteriesService';
import i18n from 'src/locales/i18n';
import { setCemeteries } from 'src/redux/slices/cemeteriesSlice';

import CardData from '../general/CardData';
import CardStatus from '../general/CardStatus';
import DeleteDialog from '../general/DeleteDialog';
import CemeteryDropdown from './CemeteryDropdown';

const CemeteryCard = ({ cemetery }) => {
    const { page } = useSelector((state) => state.cemeteries);
    const [deleteDialogState, setDeleteDialogState] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleDialogClose = () => {
        setDeleteDialogState(false);
    };

    const handleDeleteCemetery = async () => {
        setDeleting(true);
        try {
            const { data: deleteRes } = await cemeteriesService.deleteCemetery(cemetery.Id);
            const { data: newCemeteries } = await cemeteriesService.searchCemeteries();
            dispatch(setCemeteries(newCemeteries));
            setDeleting(false);
            handleDialogClose();
            toast.success(t('common.success.delete'));
        } catch (err) {
            console.log({ err });
            toast.error(t('common.error.unknown'));
            setDeleting(false);
        }
    };

    return (
        <>
            <Card
                sx={{
                    backgroundColor: 'success.lighter',
                    color: 'black',
                    py: 2,
                }}
            >
                <CardHeader
                    titleTypographyProps={{
                        align: 'center',
                        variant: 'h4',
                        gutterBottom: true,
                    }}
                    title={
                        <Link
                            component={RouterLink}
                            to={`/dead/cemeteries/${cemetery.Id}?page=${page}`}
                            color={'success.darker'}
                        >
                            {i18n.language === 'en' ? cemetery.NameSl : cemetery.NameFl}
                        </Link>
                    }
                    action={<CemeteryDropdown shapePath={cemetery.shapePath} id={cemetery.Id} />}
                />
                <Divider />
                <CardContent>
                    <Stack direction="column" spacing={2}>
                        <CardData label={`${t('common.address')}`} data={cemetery.Address} />
                        <CardStatus active={cemetery.IsActive} variant="outlined" />
                        <CardData label={`${t('common.lat')}`} data={cemetery.LocationLat} />
                        <CardData label={`${t('common.long')}`} data={cemetery.LocationLong} />
                    </Stack>
                </CardContent>
                <CardActions>
                    <Stack direction="row" justifyContent="center" width={'100%'} spacing={3}>
                        <Button
                            startIcon={<EditOutlined />}
                            variant="contained"
                            color="success"
                            sx={{ fontSize: 18 }}
                            component={RouterLink}
                            to={`/dead/cemeteries/edit/${cemetery.Id}?page=${page}`}
                        >
                            {t('common.edit')}
                        </Button>

                        <Button
                            startIcon={<DeleteOutlineRounded />}
                            variant="contained"
                            color="error"
                            sx={{ fontSize: 18 }}
                            onClick={() => setDeleteDialogState(true)}
                        >
                            {t('common.delete')}
                        </Button>
                    </Stack>
                </CardActions>
            </Card>

            {deleteDialogState ? (
                <DeleteDialog
                    t={t}
                    open={deleteDialogState}
                    onClose={handleDialogClose}
                    title={t('common.deleteConfirm', {
                        data: i18n.language === 'en' ? cemetery.NameSl : cemetery.NameFl,
                    })}
                    handleDelete={handleDeleteCemetery}
                    deleting={deleting}
                />
            ) : (
                ''
            )}
        </>
    );
};

export default CemeteryCard;
