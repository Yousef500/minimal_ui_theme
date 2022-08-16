import {
    KeyboardDoubleArrowLeftRounded,
    KeyboardDoubleArrowRightRounded
} from "@mui/icons-material";
import {
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Chip,
    CircularProgress,
    Container,
    Fab,
    Grid,
    Tooltip,
    Typography
} from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Center from "src/components/khadamat/general/Center";
import DetailView from "src/components/khadamat/general/DetailView";
import FormatDate from "src/components/khadamat/general/FormatDate";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { setDeadPageNo } from "src/redux/slices/deadSlice"; 
import deadService from "src/config/axios/deadServices";
import i18n from "src/locales/i18n";

const cardStyles = {
    width: "100%",
    mb: 10,
    borderRadius: 10,
    background: `linear-gradient(
                    30deg,
                    hsl(160deg 19% 94%) 0%,
                    hsl(161deg 23% 94%) 13%,
                    hsl(163deg 26% 94%) 19%,
                    hsl(164deg 30% 94%) 23%,
                    hsl(166deg 34% 94%) 27%,
                    hsl(167deg 38% 94%) 31%,
                    hsl(168deg 42% 93%) 34%,
                    hsl(169deg 46% 93%) 38%,
                    hsl(171deg 49% 93%) 41%,
                    hsl(172deg 53% 93%) 44%,
                    hsl(173deg 56% 93%) 47%,
                    hsl(174deg 60% 93%) 50%,
                    hsl(175deg 58% 93%) 53%,
                    hsl(175deg 55% 94%) 56%,
                    hsl(176deg 52% 94%) 59%,
                    hsl(176deg 49% 94%) 62%,
                    hsl(177deg 45% 95%) 66%,
                    hsl(177deg 41% 95%) 69%,
                    hsl(178deg 37% 95%) 73%,
                    hsl(178deg 32% 96%) 77%,
                    hsl(179deg 26% 96%) 81%,
                    hsl(179deg 19% 96%) 87%,
                    hsl(180deg 11% 96%) 100%
                )`,
};

const DeadDetails = () => {
    const { id } = useParams();
    const page = useLocation().search.split("page=")[1];
    const [person, setPerson] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        if (person && person.Id !== id) {
            (async () => {
                try {
                    dispatch(setDeadPageNo(1));
                    const { data } = await deadService.searchDead({ id });
                    setPerson(data.PagedList[0]);
                    setLoading(false);
                } catch (err) {
                    console.log({ err });
                    toast.error(t("common.error.unknown"));
                    setLoading(false);
                }
            })();
        }
    }, [id]);

    return loading ? (
        <Center my={20}>
            <CircularProgress size={100} colo="info" />
        </Center>
    ) : (
        <Container sx={{ position: "relative" }}>
            <Card elevation={10} sx={cardStyles}>
                <CardHeader
                    titleTypographyProps={{
                        variant: "h1",
                        align: "center",
                        gutterBottom: true,
                    }}
                    title={i18n.language === "en" ? person.NameSl : person.NameFl}
                    action={
                        <Tooltip title={t("common.return")}>
                            <Fab
                                onClick={() => {
                                    dispatch(setDeadPageNo(Number(page)));
                                    navigate("/dead/management");
                                }}
                                color="info"
                                sx={{
                                    fontSize: 20,
                                }}
                            >
                                {i18n.language === "en" ? (
                                    <KeyboardDoubleArrowRightRounded />
                                ) : (
                                    <KeyboardDoubleArrowLeftRounded />
                                )}
                            </Fab>
                        </Tooltip>
                    }
                />
                <CardContent sx={{ mb: 0, pb: 0 }}>
                    <Grid
                        container
                        my={5}
                        spacing={3}
                        alignItems="center"
                        justifyContent={"center"}
                    >
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <DetailView
                                title={`${t("common.age")}:`}
                                data={`${person.AgeYears} ${t("common.years")} / 
                                ${person.AgeMonths} ${t("common.months")} / 
                                ${person.AgeDays} ${t("common.days")}`}
                            />
                            <DetailView
                                title={`${t("common.nat")}:`}
                                data={person.NationalityName}
                            />
                            <DetailView
                                title={`${t("common.type")}:`}
                                data={person.GenderTypeName}
                            />
                            <DetailView
                                title={`${t("ekram.dead.deathDate")}:`}
                                data={<FormatDate date={person.DateOfDeath} />}
                            />
                            <DetailView
                                title={`${t("ekram.dead.deathTime")}:`}
                                data={person.DeathTime}
                            />
                            <DetailView
                                title={`${t("ekram.dead.deathReason")}:`}
                                data={person.DeathReason}
                            />
                            <DetailView
                                title={`${t("common.deleted")}:`}
                                data={person.IsDeleted ? t("common.yes") : t("common.no")}
                            />
                            <DetailView
                                title={`${t("common.citizen")}:`}
                                data={
                                    <Chip
                                        label={person.IsCitizen ? t("common.yes") : t("common.no")}
                                        color={"success"}
                                        disabled={!person.IsCitizen}
                                        sx={{ width: 60, fontSize: 21 }}
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={0} md={0} lg={1} />
                        <Grid item xs={12} sm={12} md={6} lg={5}>
                            <DetailView
                                title={`${t("ekram.cemeteries.name")}:`}
                                data={person.CemeteryName}
                            />
                            <DetailView
                                title={`${t("ekram.cemeteries.address")}:`}
                                data={person.CemeteryAddress}
                            />
                            <DetailView
                                title={`${t("ekram.dead.square")}:`}
                                data={person.SquareNumber}
                            />
                            <DetailView title={`${t("ekram.dead.row")}:`} data={person.RowNumber} />
                            <DetailView
                                title={`${t("ekram.dead.column")}:`}
                                data={person.ColumnNumber}
                            />
                            <DetailView
                                title={`${t("ekram.dead.regNo")}:`}
                                data={person.RegistrationNumber}
                            />
                            <DetailView
                                title={`${t("common.active")}:`}
                                data={
                                    <Chip
                                        label={person.IsActive ? t("common.yes") : t("common.no")}
                                        color={"info"}
                                        disabled={!person.IsActive}
                                        sx={{
                                            width: 60,
                                            color: "#FFFFFF",
                                            fontSize: 21,
                                        }}
                                    />
                                }
                            />
                            <DetailView title={`${t("common.id")}:`} data={person.NationalNumber} />
                        </Grid>
                        <Grid item xs={12} mt={5}>
                            <Typography variant="h4" align="center">
                                {t("ekram.cemeteries.location")}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardMedia component="div" sx={{ mb: 5, mt: 0 }}>
                    <GoogleMap
                        zoom={10}
                        center={{
                            lat: person.CemeteryLocationLat,
                            lng: person.CemeteryLocationLong,
                        }}
                        mapContainerStyle={{
                            width: "100%",
                            height: 500,
                            borderRadius: 20,
                        }}
                    >
                        <Marker
                            position={{
                                lat: person.CemeteryLocationLat,
                                lng: person.CemeteryLocationLong,
                            }}
                        />
                    </GoogleMap>
                </CardMedia>
            </Card>
        </Container>
    );
};

export default DeadDetails;
