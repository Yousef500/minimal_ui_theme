import { Autocomplete, CircularProgress } from "@mui/material";
import usersService from "src/config/axios/usersService";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import InputField from "../general/InputField";

const RolesAutoComplete = ({ control, label }) => {
    const [securityRoles, setSecurityRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await usersService.getAllUsersRoles();
                setSecurityRoles(data);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        })();
    }, []);

    return (
        <Controller
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    value={field.value || []}
                    multiple
                    disableCloseOnSelect
                    options={securityRoles}
                    getOptionLabel={(option) => option.StringValue}
                    onChange={(e, val) => field.onChange(val)}
                    isOptionEqualToValue={(opt, val) => opt.Key === val.Key}
                    renderInput={(params) => (
                        <InputField
                            label={label}
                            {...params}
                            error={!!error}
                            helperText={error?.message}
                            InputProps={{
                                ...params.InputProps,
                                style: {
                                    padding: 10,
                                },
                                endAdornment: loading ? (
                                    <CircularProgress color="inherit" size={20} />
                                ) : null,
                            }}
                        />
                    )}
                />
            )}
            control={control}
            name="roles"
            rules={{ required: true }}
        />
    );
};

export default RolesAutoComplete;
