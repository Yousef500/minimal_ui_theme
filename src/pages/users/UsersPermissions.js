import PermissionsCard from "src/components/khadamat/users/PermissionsCard";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Container, Grid, Stack } from "@mui/material";
import MainRoleInput from "src/components/khadamat/users/MainRoleInput";
import ModuleInput from "src/components/khadamat/users/ModuleInput";
import PageInput from "src/components/khadamat/users/PageInput";
import SubRoleInput from "src/components/khadamat/users/SubRoleInput";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { CancelRounded, Save, SaveRounded } from "@mui/icons-material";

import permissionsService from "src/config/axios/permissionsService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const UsersPermissions = () => {
    const [loadingSubRoles, setLoadingSubRoles] = useState(false);
    const [subRoles, setSubRoles] = useState([]);
    const [loadingPages, setLoadingPages] = useState(false);
    const [pages, setPages] = useState([]);
    const [permissionsLoading, setPermissionsLoading] = useState(false);
    const [permissionsToAddChecked, setPermissionsToAddChecked] = useState([]);
    const [addedPermissionsChecked, setAddedPermissionsChecked] = useState([]);
    const [permissionsToAdd, setPermissionsToAdd] = useState([]);
    const [addedPermissions, setAddedPermissions] = useState([]);
    const [saving, setSaving] = useState(false);

    const { t } = useTranslation();
    const {
        getValues,
        control,
        setValue,
        formState: { isDirty },
        handleSubmit,
    } = useForm();

    const handleTogglePermissionsToAdd = (val) => {
        const checked = permissionsToAddChecked.find((perm) => val.Key === perm.Key);
        let newChecked = [...permissionsToAddChecked];

        if (checked) {
            newChecked = newChecked.filter((perm) => perm.Key !== val.Key);
        } else {
            newChecked.push(val);
        }

        setPermissionsToAddChecked(newChecked);
    };

    const handleToggleAddedPermissions = (val) => {
        const checked = addedPermissionsChecked.find((perm) => val.Key === perm.Key);
        let newChecked = [...addedPermissionsChecked];

        if (checked) {
            newChecked = newChecked.filter((perm) => perm.Key !== val.Key);
        } else {
            newChecked.push(val);
        }

        setAddedPermissionsChecked(newChecked);
    };

    const handleAddPermissions = () => {
        const newAddedPermissions = [...addedPermissions, ...permissionsToAddChecked];
        setAddedPermissions(newAddedPermissions);
        setAddedPermissionsChecked([...addedPermissionsChecked, ...permissionsToAddChecked]);
        const newPermissionsToAdd = permissionsToAdd.filter((perm) => {
            const exists = permissionsToAddChecked.find((val) => perm.Key === val.Key);
            return !exists;
        });
        setPermissionsToAdd(newPermissionsToAdd);
        setPermissionsToAddChecked([]);
    };

    const handleRemovePermissions = () => {
        const newPermissionsToAdd = [...permissionsToAdd, ...addedPermissionsChecked];
        setPermissionsToAdd(newPermissionsToAdd);
        setPermissionsToAddChecked([...addedPermissionsChecked, ...permissionsToAddChecked]);
        const newAddedPermissions = addedPermissions.filter((perm) => {
            const exists = addedPermissionsChecked.find((val) => val.Key === perm.Key);
            return !exists;
        });
        setAddedPermissions(newAddedPermissions);
        setAddedPermissionsChecked([]);
    };

    const handleToggleAllPermissionsToAdd = () => {
        if (permissionsToAddChecked.length === permissionsToAdd.length) {
            setPermissionsToAddChecked([]);
        } else {
            setPermissionsToAddChecked([...permissionsToAdd]);
        }
    };

    const handleToggleAllAddedPermissions = () => {
        if (addedPermissionsChecked.length === addedPermissions.length) {
            setAddedPermissionsChecked([]);
        } else {
            setAddedPermissionsChecked([...addedPermissions]);
        }
    };

    const resetPermissions = () => {
        setPermissionsToAdd([]);
        setPermissionsToAddChecked([]);
        setAddedPermissions([]);
        setAddedPermissionsChecked([]);
    };

    const handleFormSubmit = async (data) => {
        if (isDirty) {
            setSaving(true);
            try {
                console.log({
                    roleId: data.subRole?.Key ? data.subRole.Key : data.mainRole?.Key,
                    pageId: data.page?.Key,
                    addedPageActionsIdsList: addedPermissions.map((perm) => perm.Key),
                });
                const { data: saveRes } = await permissionsService.addPermissions({
                    roleId: data.subRole?.Key ? data.subRole.Key : data.mainRole.Key,
                    pageId: data.page?.Key,
                    addedPageActionsIdsList: addedPermissions.map((perm) => perm.Key),
                });
                console.log({ saveRes });
                toast.success(t("common.success.general"));
                setSaving(false);
            } catch (err) {
                console.log({ err });
                toast.error(t("common.error.unknown"));
                setSaving(false);
            }
        }
    };

    return (
        <Container>
            <Grid
                container
                spacing={3}
                justifyContent="center"
                alignItems={"center"}
                mb={10}
                component="form"
                onSubmit={handleSubmit(handleFormSubmit)}
            >
                <Grid item xs={12} sm={6}>
                    <MainRoleInput
                        control={control}
                        t={t}
                        setValue={setValue}
                        setSubRoles={setSubRoles}
                        setLoadingSubRoles={setLoadingSubRoles}
                        resetPermissions={resetPermissions}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <SubRoleInput
                        control={control}
                        t={t}
                        subRoles={subRoles}
                        loading={loadingSubRoles}
                        setValue={setValue}
                        resetPermissions={resetPermissions}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <ModuleInput
                        control={control}
                        t={t}
                        setValue={setValue}
                        setLoadingPages={setLoadingPages}
                        setPages={setPages}
                        resetPermissions={resetPermissions}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <PageInput
                        control={control}
                        t={t}
                        pages={pages}
                        getValues={getValues}
                        loading={loadingPages}
                        setPermissionsLoading={setPermissionsLoading}
                        resetPermissions={resetPermissions}
                        setAddedPermissions={setAddedPermissions}
                        setPermissionsToAdd={setPermissionsToAdd}
                    />
                </Grid>

                {/* {subRoles.length ? "" : <Grid item xs={12} sm={6} />} */}

                <Grid item xs={12} md={6}>
                    <PermissionsCard
                        list={permissionsToAdd}
                        handleToggle={handleTogglePermissionsToAdd}
                        title={t("accounts.permissions.permissionsToAdd")}
                        checked={permissionsToAddChecked}
                        handleSubmit={handleAddPermissions}
                        actionLabel={t("common.add")}
                        actionColor="success"
                        toggleAll={handleToggleAllPermissionsToAdd}
                        t={t}
                        loading={permissionsLoading}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <PermissionsCard
                        list={addedPermissions}
                        handleToggle={handleToggleAddedPermissions}
                        title={t("accounts.permissions.addedPermissions")}
                        checked={addedPermissionsChecked}
                        handleSubmit={handleRemovePermissions}
                        actionLabel={t("common.delete")}
                        actionColor="error"
                        toggleAll={handleToggleAllAddedPermissions}
                        t={t}
                        loading={permissionsLoading}
                    />
                </Grid>

                <Grid item xs={6}>
                    <Stack
                        direction="row"
                        spacing={5}
                        alignItems="center"
                        justifyContent="flex-start"
                    >
                        <LoadingButton
                            loading={saving}
                            variant="contained"
                            color="inherit"
                            sx={{ fontSize: 20 }}
                            startIcon={<SaveRounded />}
                            loadingPosition="start"
                            onClick={handleSubmit}
                            type="submit"
                            disabled={!isDirty}
                        >
                            {t("common.save")}
                        </LoadingButton>
                        <Button
                            component={Link}
                            to="/users"
                            variant="contained"
                            startIcon={<CancelRounded />}
                            color="warning"
                            sx={{ fontSize: 20 }}
                        >
                            {t("common.cancel")}
                        </Button>
                    </Stack>
                </Grid>

                <Grid item xs={6} />
            </Grid>
        </Container>
    );
};

export default UsersPermissions;
