import { Card, CardContent, CardHeader, Link, Stack, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import i18n from 'src/locales/i18n';
import CardData from '../general/CardData';
import DeadDropdown from './DeadDropdown';

const DeadCard = ({ person }) => {
    const { page } = useSelector((state) => state.dead);
    const { t } = useTranslation();
    const {
        NameFl,
        NameSl,
        NationalityName,
        CemeteryLocationLat: lat,
        CemeteryLocationLong: lng,
        AgeYears,
        AgeMonths,
        AgeDays,
        CemeteryName,
        CemeteryAddress,
        DateOfDeath,
        DeathTime,
        NationalNumber,
    } = person;

    return (
        <Card
            elevation={10}
            sx={{
                // height: { xs: 655, md: 580, lg: 605, xl: 550 },
                overflowY: 'auto',
                backgroundColor: 'info.lighter',
                color: 'black',
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
                        color={person.IsActive ? 'info.darker' : 'inherit'}
                        to={`/dead/${person.Id}?page=${page}`}
                        underline="hover"
                    >
                        {i18n.language === 'en' ? NameSl : NameFl}
                    </Link>
                }
                action={<DeadDropdown lat={lat} lng={lng} person={person} page={page} />}
            />
            <CardContent sx={{ mt: 2 }}>
                <Stack direction="column" spacing={2} justifyContent="center">
                    <CardData
                        label={`${t('common.age')}:`}
                        data={
                            <Tooltip
                                title={`${AgeYears} ${t('common.years')} / 
                            ${AgeMonths} ${t('common.months')} / 
                            ${AgeDays} ${t('common.days')}`}
                            >
                                <Typography>
                                    {AgeYears} {t('common.years')}
                                </Typography>
                            </Tooltip>
                        }
                    />
                    <CardData label={`${t('common.nat')}:`} data={NationalityName} />
                    <CardData label={`${t('ekram.cemeteries.name')}:`} data={CemeteryName} />
                    <CardData label={`${t('ekram.cemeteries.address')}:`} data={CemeteryAddress} />
                    <CardData
                        label={`${t('ekram.dead.deathDate')}:`}
                        data={DateOfDeath.split('T')[0]}
                    />
                    <CardData label={`${t('ekram.dead.deathTime')}:`} data={DeathTime} />
                    <CardData label={`${t('common.id')}:`} data={NationalNumber} noDivider />
                </Stack>
            </CardContent>
        </Card>
    );
};

export default DeadCard;
