import { EditOutlined, PictureAsPdfOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Stack,
    Button,
    Link,
} from '@mui/material';
import usersService from 'src/config/axios/usersService';
import i18n from 'src/locales/i18n';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';

import CardData from '../general/CardData';
import CardStatus from '../general/CardStatus';
import UserCardDropdown from './UserCardDropdown';

const UserCard = ({ user }) => {
    const [loading, setLoading] = useState(false);
    const { page } = useSelector((state) => state.users);
    const { t } = useTranslation();

    const handleExtractUser = async () => {
        let userData = user;
        try {
            if (user.ManagerId) {
                setLoading(true);
                const { data: managerRes } = await usersService.searchUsers({ id: user.ManagerId });
                const manager = managerRes.PagedList[0];
                userData = {
                    ...userData,
                    managerName: i18n.language === 'ar' ? manager.NameFl : manager.NameSl,
                };
            }

            const publicUrl = process.env.PUBLIC_URL;
            const stringifiedUser = JSON.stringify(userData);
            const link =
                i18n.language === 'ar'
                    ? `${publicUrl}/static/html/user-report-ar.html?user=${stringifiedUser}&lang=${i18n.language}`
                    : `${publicUrl}/static/html/user-report-en.html?user=${stringifiedUser}&lang=${i18n.language}`;

            const aTag = document.createElement('a');
            aTag.setAttribute('href', link);
            aTag.setAttribute('target', '_blank');
            setLoading(false);
            document.body.appendChild(aTag);
            aTag.click();
            document.body.removeChild(aTag);
        } catch (err) {
            console.log({ err });
            setLoading(false);
            toast.error(t('common.error.unknown'));
        }
    };

    return (
        <Card
            sx={{
                height: 'max-content',
                overflowY: 'auto',
                backgroundColor: 'primary.lighter',
                color: 'black',
                pb: 2,
            }}
        >
            <CardHeader
                titleTypographyProps={{
                    variant: 'h4',
                    align: 'center',
                    gutterBottom: true,
                }}
                title={
                    <Link
                        component={RouterLink}
                        to={`/users/${user.Id}?page=${page}`}
                        underline="hover"
                        color={user.IsActive ? 'primary.darker' : 'inherit'}
                    >
                        {i18n.language === 'ar' ? user.NameFl : user.NameSl}
                    </Link>
                }
                action={
                    <UserCardDropdown user={user} setUserLoading={setLoading} loading={loading} />
                }
            />
            <Divider />
            <CardContent sx={{ overflowX: 'auto' }}>
                <Stack direction="column" spacing={2} justifyContent="center">
                    <CardData label={`${t('accounts.users.username')}:`} data={user.Username} />
                    <CardData label={`${t('common.phone')}:`} data={user.Mobile} />
                    <CardData label={`${t('common.id')}:`} data={user.NationalNumber} />
                    <CardData label={`${t('common.email')}:`} data={user.Email} />
                    <CardData label={`${t('accounts.users.jobNo')}:`} data={user.JobNumber} />
                    <CardStatus active={user.IsActive} loading={loading} />
                    <CardData
                        label={`${t('accounts.users.empType')}:`}
                        data={
                            user.IsCompany
                                ? t('accounts.users.company')
                                : t('accounts.users.official')
                        }
                    />
                    <CardData
                        label={`${t('accounts.users.job')}:`}
                        data={
                            i18n.language === 'ar'
                                ? user.SecurityUserJobNameFl
                                : user.SecurityUserJobNameFl
                        }
                    />
                </Stack>
            </CardContent>
            <CardActions>
                <Stack width={'100%'} justifyContent="center" spacing={3} direction="row">
                    <LoadingButton
                        loading={loading}
                        onClick={handleExtractUser}
                        variant="contained"
                        sx={{ fontSize: 18 }}
                        color="info"
                        startIcon={<PictureAsPdfOutlined />}
                        loadingPosition={'start'}
                    >
                        {t('common.extract')}
                    </LoadingButton>
                    <Button
                        component={RouterLink}
                        to={`/users/edit/${user.Id}`}
                        variant="contained"
                        sx={{ fontSize: 18 }}
                        color="success"
                        startIcon={<EditOutlined />}
                    >
                        {t('common.edit')}
                    </Button>
                </Stack>
            </CardActions>
        </Card>
    );
};

export default UserCard;
