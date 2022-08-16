import { Autocomplete, CircularProgress, InputAdornment } from "@mui/material";
import permissionsService from "config/axios/permissionsService";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import InputField from "../general/InputField";

const ModuleInput = ({ t, setPages, setLoadingPages, control, setValue, resetPermissions }) => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data: mods } = await permissionsService.getModules();
                setModules(mods);
                setLoading(false);
            } catch (err) {
                console.log({ err });
                setLoading(false);
            }
        })();
    }, []);

    const handleChange = async (field, val) => {
        field.onChange(val);
        setValue("page", null);
        resetPermissions();
        if (val?.Key) {
            setLoadingPages(true);
            try {
                const { data: pages } = await permissionsService.getPages(val.Key);
                setPages(pages);
                setLoadingPages(false);
            } catch (err) {
                console.log({ err });
                setPages([]);
                setLoadingPages(false);
            }
        } else {
            setValue("page", null);
            setPages([]);
        }
    };

    return (
        <Controller
            control={control}
            name="module"
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    value={field.value || null}
                    onChange={(e, val) => handleChange(field, val)}
                    options={modules}
                    getOptionLabel={(opt) => opt.StringValue}
                    isOptionEqualToValue={(opt, val) => opt.Key === val.Key}
                    renderInput={(params) => (
                        <InputField
                            {...params}
                            label={t("accounts.permissions.department")}
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

export default ModuleInput;
