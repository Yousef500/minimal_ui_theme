import { Container, Fade, Grid, Grow, Stack, Typography } from "@mui/material";
import MDButton from "components/MDButton";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const DeadDashboard = () => {
    const { t } = useTranslation();
    return (
        <Container>
            <Grid container spacing={3} m="auto" alignItems="center" justifyContent={"center"}>
                <Grid item xs={12}>
                    <Typography variant="h1" gutterBottom align="center">
                        {t("ekram.dead.title")}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Fade in timeout={500}>
                        <MDButton
                            variant="gradient"
                            color="info"
                            component={Link}
                            to="/dead/management"
                            sx={{ fontSize: 25 }}
                        >
                            {t("ekram.dead.hds")}
                        </MDButton>
                    </Fade>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Fade in timeout={500}>
                        <MDButton
                            component={Link}
                            to="/dead/cemeteries"
                            variant="gradient"
                            color="info"
                            sx={{ fontSize: 25 }}
                        >
                            {t("ekram.cemeteries.title")}
                        </MDButton>
                    </Fade>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DeadDashboard;
