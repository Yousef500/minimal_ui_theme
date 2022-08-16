import { Autocomplete, CircularProgress, InputAdornment } from "@mui/material";
import locationsService from "config/axios/locationsService";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import InputField from "../general/InputField";

const LocationInput = ({ t, control }) => {
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await locationsService.getAll();
                setLocations(data);
                setLoading(false);
            } catch (err) {
                console.log({ err });
                setLoading(false);
            }
        })();
    }, []);

    return (
        <Controller
            control={control}
            name="location"
            rules={{
                required: true,
            }}
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    fullWidth
                    {...field}
                    value={field.value || null}
                    onChange={(e, val) => field.onChange(val)}
                    options={locations}
                    renderOption={(props, opt) => (
                        <li {...props} key={opt.Key}>
                            {opt.StringValue}
                        </li>
                    )}
                    getOptionLabel={(opt) => opt.StringValue}
                    isOptionEqualToValue={(opt, val) => opt.Key === val.Key}
                    renderInput={(params) => (
                        <InputField
                            {...params}
                            label={t("common.location")}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: loading ? (
                                    <InputAdornment position="end">
                                        <CircularProgress size={15} color="info" />
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

export default LocationInput;
