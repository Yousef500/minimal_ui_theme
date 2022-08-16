import { LoadingButton } from "@mui/lab";
import {
    Checkbox,
    CircularProgress,
    Container,
    Divider,
    FormControlLabel,
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import Center from "components/khadamat/general/Center";
import InputField from "components/khadamat/general/InputField";
import JobsAutoComplete from "components/khadamat/users/JobsAutoComplete";
import ManagerAutoComplete from "components/khadamat/users/ManagerAutoComplete";
import RolesAutoComplete from "components/khadamat/users/RolesAutoComplete";
import MDButton from "components/MDButton";
import usersService from "config/axios/usersService";
import i18n from "config/i18n";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { setUsersFilterBy, setUsersPageNo } from "redux/slices/usersSlice";

const EditUser = () => {
    // const [defaults, setDefaults] = useState({});
    const { id } = useParams();
    const page = useLocation().search.split("page=")[1];
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [defaultsLoading, setDefaultsLoading] = useState(true);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        watch,
        control,
        setValue,
        reset,
        getValues,
    } = useForm({
        mode: "onTouched",
    });

    const watchIsCompany = watch("IsCompany");

    useEffect(() => {
        (async () => {
            try {
                dispatch(setUsersPageNo(1));
                dispatch(setUsersFilterBy(""));
                const { data } = await usersService.searchUsers({ id });
                const userData = data.PagedList[0];
                const { data: managerData } = await usersService.searchUsers({
                    id: userData.ManagerId,
                });
                // await getDefaultManager(userData.ManagerId);
                reset({
                    ...userData,
                    job: {
                        Key: userData.SecurityUserJobId,
                        StringValue: userData.SecurityUserJobName,
                    },
                    manager: {
                        Key: managerData.PagedList[0].Id,
                        StringValue:
                            i18n.language === "ar"
                                ? managerData.PagedList[0].NameFl
                                : managerData.PagedList[0].NameSl,
                    },
                    roles: userData.SecurityRoleList.map((role) => ({
                        Key: role.Id,
                        StringValue: role.Name,
                    })),
                });
                setDefaultsLoading(false);
            } catch (err) {
                console.log({ err });
                setDefaultsLoading(false);
            }
        })();
    }, []);

    const handleCancel = () => {
        if (Number(page) !== 1) {
            dispatch(setUsersPageNo(Number(page)));
        }
        // dispatch(setUsersLoading(false));
        navigate("/users/management");
    };

    const handleEditUser = async (data) => {
        setLoading(true);
        try {
            const { roles, job, manager, ...userData } = data;
            const securityRolesList = roles.map((role) => role.Key);

            const editUserRes = await usersService.editUser({
                id,
                nationalNumber: userData.NationalNumber,
                jobNumber: userData.JobNumber,
                email: userData.Email,
                mobile: userData.Mobile,
                nameFl: userData.NameFl,
                nameSl: userData.NameSl,
                isActive: userData.IsActive,
                companyName: userData.IsCompany ? userData.CompanyName : "",
                isCompany: userData.IsCompany,
                managerId: managers.length ? manager.Key : "",
                securityUserJobId: job.Key,
                securityRolesList,
            });

            // dispatch(setUsersLoading(true));
            // const { data: updatedUsers } = await usersService.searchUsers();
            // dispatch(setUsers(updatedUsers));
            setLoading(false);
            toast.success(t("common.success.edit"));
            handleCancel();
        } catch (err) {
            console.log({ err });
            toast.error(err.response.data.Message ?? t("common.error.unknown"));
            setLoading(false);
        }
    };

    return (
        <Container
            component={Paper}
            elevation={10}
            maxWidth="xl"
            sx={{ py: 10, mb: 5, mx: "auto", borderRadius: 10 }}
        >
            <Grid
                container
                spacing={{ xs: 1, sm: 2, lg: 3 }}
                m="auto"
                component="form"
                onSubmit={handleSubmit(handleEditUser)}
            >
                <Grid item xs={12}>
                    <Typography variant="h1" gutterBottom align="center">
                        {t("accounts.users.edit")}
                    </Typography>
                </Grid>

                {defaultsLoading ? (
                    <Center my={20}>
                        <CircularProgress size={100} />
                    </Center>
                ) : (
                    <>
                        <Grid item xs={12} sm={6}>
                            <InputField
                                fullWidth
                                label={`${t("common.arName")} *`}
                                type="text"
                                {...register("NameFl", {
                                    required: true,
                                })}
                                error={!!errors.NameFl}
                                helperText={errors.NameFl?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InputField
                                fullWidth
                                label={`${t("common.enName")} *`}
                                type="text"
                                {...register("NameSl")}
                                error={!!errors.NameSl}
                                helperText={errors.NameSl?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InputField
                                fullWidth
                                label={`${t("common.phone")} *`}
                                type="number"
                                {...register("Mobile", {
                                    required: true,
                                    maxLength: {
                                        value: 12,
                                        message: t("accounts.users.phoneLen"),
                                    },
                                    minLength: {
                                        value: 12,
                                        message: t("accounts.users.phoneLen"),
                                    },
                                })}
                                error={!!errors.Mobile}
                                helperText={errors.Mobile?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InputField
                                fullWidth
                                label={`${t("common.id")} *`}
                                type="number"
                                {...register("NationalNumber", {
                                    required: true,
                                    maxLength: {
                                        message: t("accounts.users.idLen"),
                                        value: 10,
                                    },
                                    minLength: {
                                        message: t("accounts.users.idLen"),
                                        value: 10,
                                    },
                                    pattern: {
                                        message: t("accounts.users.idPattern"),
                                        value: /^1|^2\d*/,
                                    },
                                })}
                                error={!!errors.NationalNumber}
                                helperText={errors.NationalNumber?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InputField
                                fullWidth
                                label={`${t("common.email")} *`}
                                type="email"
                                {...register("Email", {
                                    required: true,
                                })}
                                error={!!errors.Email}
                                helperText={errors.Email?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InputField
                                fullWidth
                                label={t("accounts.users.jobNo")}
                                type="number"
                                {...register("JobNumber", {
                                    maxLength: {
                                        message: t("accounts.users.jobNoLen"),
                                        value: 8,
                                    },
                                    minLength: {
                                        message: t("accounts.users.jobNoLen"),
                                        value: 8,
                                    },
                                })}
                                error={!!errors.JobNumber}
                                helperText={errors.JobNumber?.message}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <JobsAutoComplete
                                control={control}
                                label={`${t("accounts.users.job")} *`}
                                setManagers={setManagers}
                                job={getValues("job")}
                                setValue={setValue}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <RolesAutoComplete
                                label={`${t("accounts.users.role")} *`}
                                control={control}
                            />
                        </Grid>

                        <Grid item xs={6} display={!managers.length ? "none" : ""}>
                            <ManagerAutoComplete
                                label={`${t("accounts.users.manager")} *`}
                                managers={managers}
                                control={control}
                            />
                        </Grid>

                        <Grid item xs={4} sm={2} md={2} lg={1}>
                            <FormControlLabel
                                label={
                                    <Typography display={"inline"} variant="subtitle1">
                                        {t("common.active")}
                                    </Typography>
                                }
                                control={
                                    <Controller
                                        name="IsActive"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox {...field} checked={field.value} />
                                        )}
                                    />
                                }
                            />
                        </Grid>

                        <Grid item xs={6} />

                        <Grid item xs={4} sm={2} md={2}>
                            <FormControlLabel
                                label={
                                    <Typography display="inline" variant="subtitle1">
                                        {t("accounts.users.companyAcc")}
                                    </Typography>
                                }
                                control={
                                    <Controller
                                        name="IsCompany"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox {...field} checked={field.value} />
                                        )}
                                    />
                                }
                            />
                        </Grid>

                        <Grid item xs={6} display={!watchIsCompany && "none"}>
                            <InputField
                                fullWidth
                                label={t("accounts.users.companyName")}
                                type="text"
                                {...register("CompanyName", {
                                    required: getValues("IsCompany"),
                                })}
                                error={!!errors.CompanyName}
                                helperText={errors.CompanyName?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{ background: "black" }} />
                        </Grid>

                        <Grid item xs={12}>
                            <Stack direction="row" spacing={5} justifyContent="space-between">
                                <LoadingButton
                                    loading={loading}
                                    color="success"
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={!isValid || !isDirty}
                                >
                                    {t("common.save")}
                                </LoadingButton>

                                <MDButton
                                    fullWidth
                                    variant="gradient"
                                    color="error"
                                    onClick={handleCancel}
                                >
                                    {t("common.cancel")}
                                </MDButton>
                            </Stack>
                        </Grid>
                    </>
                )}
            </Grid>
        </Container>
    );
};

export default EditUser;
