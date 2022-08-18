import { Button, Container, Fade, Grid, Typography } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const SecurityGuardsDashboard = () => {
    const { t } = useTranslation();
    return (
        <Container maxWidth={'xl'}>
            <Grid container spacing={3} m="auto" alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <Typography align="center" variant="h1" gutterBottom>
                        {t('securityGuards.title')}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Fade in timeout={500}>
                        <Button
                            component={Link}
                            to="/securityGuards/locations"
                            size="large"
                            variant="contained"
                            color="info"
                            sx={{ fontSize: 25, height: 'max-content' }}
                        >
                            {t('securityGuards.locations.title')}
                        </Button>
                    </Fade>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Fade in timeout={500}>
                        <Button
                            component={Link}
                            to="/securityGuards/shifts"
                            size="large"
                            variant="contained"
                            color="info"
                            sx={{ fontSize: 25 }}
                        >
                            {t('securityGuards.shifts.title')}
                        </Button>
                    </Fade>
                </Grid>
            </Grid>
        </Container>
    );
};

export default SecurityGuardsDashboard;
