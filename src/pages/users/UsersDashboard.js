import { Button, Container, Fade, Grid, Typography } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const UsersDashboard = () => {
    const { t } = useTranslation();
    return (
        <Container>
            <Grid container spacing={3} m="auto" alignItems="center" justifyContent={'center'}>
                <Grid item xs={12}>
                    <Typography variant="h1" gutterBottom align="center">
                        {t('accounts.title')}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Fade in timeout={500}>
                        <Button
                            variant="contained"
                            color="info"
                            component={Link}
                            to="/users/management"
                        >
                            <Typography variant="h4" color="#FFFFFF">
                                {t('accounts.users.title')}
                            </Typography>
                        </Button>
                    </Fade>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Fade in timeout={500}>
                        <Button
                            variant="contained"
                            color="info"
                            component={Link}
                            to="/users/permissions"
                        >
                            <Typography variant="h4" color="#FFFFFF">
                                {t('accounts.permissions.title')}
                            </Typography>
                        </Button>
                    </Fade>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Fade in timeout={500}>
                        <Button
                            variant="contained"
                            color="info"
                            component={Link}
                            to="/users/nationalities"
                        >
                            <Typography variant="h4" color="#FFFFFF">
                                {t('accounts.nationalities.title')}
                            </Typography>
                        </Button>
                    </Fade>
                </Grid>
            </Grid>
        </Container>
    );
};

export default UsersDashboard;
