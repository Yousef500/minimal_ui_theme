import { Autocomplete, CircularProgress, InputAdornment } from "@mui/material";
import { Controller } from "react-hook-form";
import InputField from "../general/InputField";

const SubRoleInput = ({ subRoles, loading, t, control, setValue, resetPermissions }) => {
    return (
        <Controller
            control={control}
            name="subRole"
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    value={field.value || null}
                    onChange={(e, val) => {
                        setValue("page", null);
                        resetPermissions();
                        field.onChange(val);
                    }}
                    options={subRoles}
                    getOptionLabel={(opt) => opt.StringValue}
                    isOptionEqualToValue={(opt, val) => opt.Key === val.Key}
                    renderInput={(params) => (
                        <InputField
                            {...params}
                            label={t("accounts.permissions.subRole")}
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

export default SubRoleInput;
