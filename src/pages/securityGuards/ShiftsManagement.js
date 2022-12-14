import { DomainAddRounded, SearchOffRounded } from '@mui/icons-material';
import { Button, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material';
import Center from 'src/components/khadamat/general/Center';
import ShiftsAccordion from 'src/components/khadamat/securityGuards/ShiftsAccordion';
import ShiftsManagementDay from 'src/components/khadamat/securityGuards/ShiftsManagementDay';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ShiftsManagement = () => {
    const { t } = useTranslation();
    const { shifts, loadingShifts } = useSelector((state) => state.shifts);
    return (
        <Container maxWidth={'xl'}>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent={'space-between'}
                        alignItems="center"
                    >
                        <Typography variant="h2" gutterBottom>
                            {t('securityGuards.shifts.title')}
                        </Typography>
                        <Button
                            component={Link}
                            to="/securityGuards/shifts/add"
                            variant="contained"
                            color="info"
                            size="large"
                            startIcon={<DomainAddRounded />}
                            sx={{ fontSize: 22 }}
                        >
                            {t('securityGuards.shifts.add')}
                        </Button>
                    </Stack>
                </Grid>
                <Grid item xs={10}>
                    <ShiftsManagementDay t={t} />
                </Grid>
                {loadingShifts ? (
                    <Grid item xs={12}>
                        <Center my={15}>
                            <CircularProgress size={150} color="info" />
                        </Center>
                    </Grid>
                ) : shifts ? (
                    shifts.GuardSitesList?.map((site) => (
                        <Grid item xs={12} md={6} key={site.SGsGuardSiteId}>
                            <ShiftsAccordion site={site} t={t} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Stack
                            direction="row"
                            spacing={5}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <SearchOffRounded />
                            <Typography variant="h3">{t('common.notFound')}</Typography>
                        </Stack>
                    </Grid>
                )}
                <Grid item xs={12} />
            </Grid>
        </Container>
    );
};

export default ShiftsManagement;
