import { Card, CardContent, CardHeader, Link, Tooltip, Typography } from "@mui/material";
import i18n from "config/i18n";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import CardData from "../general/CardData";
import DeadDropdown from "./DeadDropdown";

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
                height: { xs: 655, md: 580, lg: 605, xl: 550 },
                overflowY: "auto",
                background: `
                    linear-gradient(
                        45deg,
                        hsl(180deg 6% 93%) 0%,
                        hsl(181deg 11% 93%) 11%,
                        hsl(182deg 18% 93%) 22%,
                        hsl(183deg 25% 94%) 33%,
                        hsl(184deg 33% 94%) 44%,
                        hsl(185deg 42% 94%) 56%,
                        hsl(186deg 52% 94%) 67%,
                        hsl(187deg 63% 95%) 78%,
                        hsl(187deg 76% 95%) 89%,
                        hsl(188deg 92% 95%) 100%
                      )`,
            }}
        >
            <CardHeader
                titleTypographyProps={{
                    variant: "h4",
                    align: "center",
                    // gutterBottom: true,
                }}
                title={
                    <Link
                        component={RouterLink}
                        to={`/dead/${person.Id}?page=${page}`}
                        underline="hover"
                    >
                        {i18n.language === "en" ? NameSl : NameFl}
                    </Link>
                }
                action={<DeadDropdown lat={lat} lng={lng} person={person} page={page} />}
            />
            <CardContent sx={{ mt: 2 }}>
                <CardData
                    label={`${t("common.age")}:`}
                    data={
                        <Tooltip
                            title={`${AgeYears} ${t("common.years")} / 
                            ${AgeMonths} ${t("common.months")} / 
                            ${AgeDays} ${t("common.days")}`}
                        >
                            <Typography>
                                {AgeYears} {t("common.years")}
                            </Typography>
                        </Tooltip>
                    }
                />
                <CardData label={`${t("common.nat")}:`} data={NationalityName} />
                <CardData label={`${t("ekram.cemeteries.name")}:`} data={CemeteryName} />
                <CardData label={`${t("ekram.cemeteries.address")}:`} data={CemeteryAddress} />
                <CardData
                    label={`${t("ekram.dead.deathDate")}:`}
                    data={DateOfDeath.split("T")[0]}
                />
                <CardData label={`${t("ekram.dead.deathTime")}:`} data={DeathTime} />
                <CardData label={`${t("common.id")}:`} data={NationalNumber} noDivider />
            </CardContent>
        </Card>
    );
};

export default DeadCard;
