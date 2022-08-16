import { Autocomplete, CircularProgress, InputAdornment } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import shiftTimesService from "src/config/axios/shiftTimesService";
import InputField from "../general/InputField";

const ShiftsInput = ({ t, control }) => {
    const [loading, setLoading] = useState(true);
    const [shifts, setShifts] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await shiftTimesService.getAll();
                setShifts(data);
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
            name="shifts"
            rules={{
                required: true,
            }}
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    fullWidth
                    multiple
                    disableCloseOnSelect
                    value={field.value || []}
                    onChange={(e, val) => field.onChange(val)}
                    options={shifts}
                    getOptionLabel={(opt) => opt.StringValue}
                    isOptionEqualToValue={(opt, val) => opt.Key === val.Key}
                    renderInput={(params) => (
                        <InputField
                            {...params}
                            label={t("securityGuards.shifts.title")}
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

export default ShiftsInput;
