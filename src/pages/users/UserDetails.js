import {
    KeyboardDoubleArrowLeftRounded,
    KeyboardDoubleArrowRightRounded,
    PictureAsPdfRounded,
} from "@mui/icons-material";
import {
    Card,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Container,
    Grid,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Stack,
    Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import Center from "src/components/khadamat/general/Center";
import DetailView from "src/components/khadamat/general/DetailView";
import usersService from "src/config/axios/usersService";
import i18n from "src/locales/i18n";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { resetUsersFilters, setUsersPageNo } from "src/redux/slices/usersSlice";

const UserDetails = () => {
    const { id } = useParams();
    const page = useLocation().search?.split("page=")[1];
    const [loadingData, setLoadingData] = useState(true);
    const [user, setUser] = useState({});
    const [manager, setManager] = useState(null);
    const [link, setLink] = useState("");
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.id !== id) {
            (async () => {
                try {
                    dispatch(setUsersPageNo(1));
                    dispatch(resetUsersFilters());
                    const { data } = await usersService.searchUsers({ id });
                    let userData = data.PagedList[0];
                    setUser(userData);

                    if (userData.ManagerId) {
                        const { data: managerRes } = await usersService.searchUsers({
                            id: userData.ManagerId,
                        });
                        setManager(managerRes.PagedList[0]);
                        userData = {
                            ...userData,
                            managerName:
                                i18n.language === "ar"
                                    ? managerRes.PagedList[0].NameFl
                                    : managerRes.PagedList[0].NameSl,
                        };
                    }
                    const stringifiedUser = JSON.stringify(userData);
                    const publicUrl = process.env.PUBLIC_URL;
                    const lin =
                        i18n.language === "ar"
                            ? `${publicUrl}/static/html/user-report-ar.html?user=${stringifiedUser}&lang=${i18n.language}`
                            : `${publicUrl}/static/html/user-report-en.html?user=${stringifiedUser}&lang=${i18n.language}`;

                    setLink(lin);
                    setLoadingData(false);
                } catch (err) {
                    console.log({ err });
                    setLoadingData(false);
                }
            })();
        }
    }, [id]);

    const handleGoBack = () => {
        if (Number(page) > 1) {
            dispatch(setUsersPageNo(Number(page)));
        }
        navigate(-1);
    };

    return (
        <Container>
            {loadingData ? (
                <Center my={15}>
                    <CircularProgress size={100} color="info" />
                </Center>
            ) : (
                <Card>
                    <CardHeader
                        titleTypographyProps={{
                            align: "center",
                            variant: "h2",
                        }}
                        title={i18n.language === "ar" ? user.NameFl : user.NameSl}
                        action={
                            <SpeedDial
                                ariaLabel="actions"
                                icon={<SpeedDialIcon sx={{ fontSize: 22 }} />}
                                direction={"down"}
                                FabProps={{
                                    color: "info",
                                }}
                            >
                                <SpeedDialAction
                                    FabProps={{
                                        component: "a",
                                        href: link,
                                        target: "_blank",
                                        sx: {
                                            fontSize: 20,
                                        },
                                    }}
                                    // onClick={handleDownload}
                                    icon={<PictureAsPdfRounded />}
                                    tooltipTitle={t("common.extract")}
                                />
                                <SpeedDialAction
                                    onClick={handleGoBack}
                                    FabProps={{
                                        sx: { fontSize: 20 },
                                    }}
                                    icon={
                                        i18n.language === "ar" ? (
                                            <KeyboardDoubleArrowLeftRounded />
                                        ) : (
                                            <KeyboardDoubleArrowRightRounded />
                                        )
                                    }
                                    tooltipTitle={t("common.return")}
                                />
                            </SpeedDial>
                        }
                    />
                    <CardContent sx={{ overflowX: "auto" }}>
                        <Grid
                            container
                            columnSpacing={5}
                            rowSpacing={3}
                            width={"100%"}
                            alignContent="center"
                            justifyContent="center"
                        >
                            <Grid item xs={12} lg={5}>
                                <DetailView
                                    title={t("accounts.users.username")}
                                    data={user.Username}
                                />
                                <DetailView title={t("common.id")} data={user.NationalNumber} />
                                <DetailView
                                    title={t("accounts.users.jobNo")}
                                    data={user.JobNumber}
                                />
                                <DetailView />

                                {manager ? (
                                    <DetailView
                                        title={t("accounts.users.manager")}
                                        data={
                                            i18n.language === "ar" ? manager.NameFl : manager.NameSl
                                        }
                                    />
                                ) : (
                                    ""
                                )}

                                <Stack direction="row" justifyContent={"space-between"} my={1}>
                                    <Typography variant={"h5"}>{t("common.active")}</Typography>
                                    {user.IsActive ? (
                                        <Chip
                                            label={t("common.yes")}
                                            color={"info"}
                                            variant={"filled"}
                                        />
                                    ) : (
                                        <Chip
                                            label={t("common.no")}
                                            color={"default"}
                                            variant={"filled"}
                                        />
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={12} lg={5}>
                                <DetailView title={t("common.email")} data={user.Email} />
                                <DetailView title={t("common.phone")} data={user.Mobile} />

                                <Stack direction="row" justifyContent={"space-between"} my={1}>
                                    <Typography variant={"h5"}>
                                        {t("accounts.users.companyAcc")}
                                    </Typography>
                                    {user.IsCompany ? (
                                        <Chip
                                            label={t("common.yes")}
                                            color={"success"}
                                            variant={"outlined"}
                                        />
                                    ) : (
                                        <Chip
                                            label={t("common.no")}
                                            color={"default"}
                                            variant={"outlined"}
                                        />
                                    )}
                                </Stack>
                                {user.IsCompany ? (
                                    <DetailView
                                        title={t("accounts.users.companyName")}
                                        data={user.CompanyName}
                                    />
                                ) : (
                                    ""
                                )}
                                <DetailView
                                    title={t("accounts.users.job")}
                                    data={
                                        i18n.language === "ar"
                                            ? user.SecurityUserJobNameFl
                                            : user.SecurityUserJobNameSl
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    align="center"
                                    color={blue[500]}
                                    variant="h4"
                                    gutterBottom
                                >
                                    {t("accounts.users.role")}
                                </Typography>
                            </Grid>
                            {user.SecurityRoleList.map((role) => (
                                <Grid item key={role.Id} xs={12} sm={6} md={4} lg={3}>
                                    <Typography align="center" variant="subtitle1" gutterBottom>
                                        {role.Name}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default UserDetails;
