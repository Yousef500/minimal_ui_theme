import { FileCopyOutlined } from "@mui/icons-material";
import { Autocomplete, CircularProgress, fabClasses, InputAdornment } from "@mui/material";
import permissionsService from "config/axios/permissionsService";
import { Controller } from "react-hook-form";
import InputField from "../general/InputField";

const PageInput = ({
    pages,
    loading,
    t,
    control,
    getValues,
    setPermissionsLoading,
    setAddedPermissions,
    setPermissionsToAdd,
    resetPermissions,
}) => {
    const handleChange = async (field, val) => {
        try {
            const subRole = getValues("subRole");
            const mainRole = getValues("mainRole");
            resetPermissions();
            let permissions = [];
            if (subRole?.Key) {
                setPermissionsLoading(true);
                field.onChange(val);
                const { data } = await permissionsService.getPermissions({
                    pageId: val.Key,
                    roleId: subRole.Key,
                });

                permissions = data;

                console.log({ data });
            } else if (mainRole?.Key) {
                setPermissionsLoading(true);
                field.onChange(val);
                const { data } = await permissionsService.getPermissions({
                    pageId: val.Key,
                    roleId: mainRole.Key,
                });

                permissions = data;
            }
            const addedPermissions = permissions.filter((perm) => perm.ExtraData);
            const permissionsToAdd = permissions.filter((perm) => !perm.ExtraData);
            setPermissionsToAdd(permissionsToAdd);
            setAddedPermissions(addedPermissions);
            setPermissionsLoading(false);
        } catch (err) {
            console.log({ err });
            resetPermissions();
            setPermissionsLoading(false);
        }
    };

    return (
        <Controller
            control={control}
            name="page"
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    value={field.value || null}
                    onChange={(e, val) => handleChange(field, val)}
                    options={pages}
                    getOptionLabel={(opt) => opt.StringValue}
                    isOptionEqualToValue={(opt, val) => opt.Key === val.Key}
                    renderInput={(params) => (
                        <InputField
                            {...params}
                            label={t("accounts.permissions.page")}
                            type="text"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: loading ? (
                                    <InputAdornment position="end">
                                        <CircularProgress size={18} color="info" />
                                    </InputAdornment>
                                ) : (
                                    params.InputProps.endAdornment
                                ),
                            }}
                            error={!!error}
                            helperText={error?.message}
                        />
                    )}
                />
            )}
        />
    );
};

export default PageInput;
