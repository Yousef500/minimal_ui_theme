import { Autocomplete, CircularProgress, InputAdornment } from "@mui/material";
import permissionsService from "config/axios/permissionsService";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import InputField from "../general/InputField";

const MainRoleInput = ({
    setValue,
    setSubRoles,
    setLoadingSubRoles,
    t,
    control,
    resetPermissions,
}) => {
    const [mainRoles, setMainRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data: mains } = await permissionsService.getMainRoles();
                setMainRoles(mains);
                setLoading(false);
            } catch (err) {
                console.log({ err });
                setLoading(false);
            }
        })();
    }, []);

    const handleChange = async (field, val) => {
        field.onChange(val);
        setValue("subRole", null);
        setValue("page", null);
        resetPermissions();
        if (val?.Key) {
            setLoadingSubRoles(true);
            try {
                const { data: subs } = await permissionsService.getSubRoles(val.Key);
                setSubRoles(subs);
                setLoadingSubRoles(false);
            } catch (err) {
                setSubRoles([]);
                setLoadingSubRoles(false);
            }
        } else {
            setValue("subRole", null);
            setSubRoles([]);
        }
    };

    return (
        <Controller
            control={control}
            name="mainRole"
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    value={field.value || null}
                    onChange={(e, val) => handleChange(field, val)}
                    options={mainRoles}
                    getOptionLabel={(opt) => opt.StringValue}
                    isOptionEqualToValue={(opt, val) => opt.Key === val.Key}
                    renderInput={(params) => (
                        <InputField
                            {...params}
                            label={t("accounts.permissions.mainRole")}
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

export default MainRoleInput;
