import { Container, Fade, Grid, Typography } from "@mui/material";
import MDButton from "components/MDButton";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const SecurityGuardsDashboard = () => {
    const { t } = useTranslation();
    return (
        <Container>
            <Grid container spacing={3} m="auto" alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <Typography align="center" variant="h1" gutterBottom>
                        {t("securityGuards.title")}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Fade in timeout={500}>
                        <MDButton
                            component={Link}
                            to="/securityGuards/locations"
                            size="large"
                            variant="contained"
                            color="info"
                            sx={{ fontSize: 25 }}
                        >
                            {t("securityGuards.locations.title")}
                        </MDButton>
                    </Fade>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Fade in timeout={500}>
                        <MDButton
                            component={Link}
                            to="/securityGuards/shifts"
                            size="large"
                            variant="contained"
                            color="info"
                            sx={{ fontSize: 25 }}
                        >
                            {t("securityGuards.shifts.title")}
                        </MDButton>
                    </Fade>
                </Grid>
            </Grid>
        </Container>
    );
};

export default SecurityGuardsDashboard;
