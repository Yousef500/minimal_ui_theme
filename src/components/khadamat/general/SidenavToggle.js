import { MenuOpen, ViewSidebar } from "@mui/icons-material";
import { Fab, Grid, Tooltip } from "@mui/material";
import i18n from "config/i18n";
import { setDirection, setOpenSidenav, useMaterialUIController } from "context";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

const SidenavToggle = () => {
    const { t } = useTranslation();
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavOpen } = controller;

    const handleLanguageChange = () => {
        if (i18n.language === "en") {
            i18n.changeLanguage("ar");
            setDirection(dispatch, "rtl");
        } else {
            i18n.changeLanguage("en");
            setDirection(dispatch, "ltr");
        }
    };

    return (
        <>
            <Grid container>
                <Grid item xs={12} position="relative" height={"100px"}>
                    <Tooltip title={t("common.openMenu")}>
                        <Fab
                            color="secondary"
                            sx={{ position: "absolute", top: 16, left: 30, fontSize: 20 }}
                            onClick={() => setOpenSidenav(dispatch, !sidenavOpen)}
                            size="medium"
                        >
                            {i18n.language === "en" ? <ViewSidebar /> : <MenuOpen />}
                        </Fab>
                    </Tooltip>

                    <Tooltip title={t("common.otherLang")}>
                        <Fab
                            color="success"
                            variant={"extended"}
                            size="small"
                            sx={{ position: "absolute", top: 16, right: 30, fontSize: 20 }}
                            onClick={handleLanguageChange}
                        >
                            {t("common.otherLang")}
                        </Fab>
                    </Tooltip>
                </Grid>
            </Grid>
            <Outlet />
        </>
    );
};

export default SidenavToggle;
