import { Autocomplete, CircularProgress, InputAdornment } from "@mui/material";
import shiftTimesService from "config/axios/shiftTimesService";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import InputField from "../general/InputField";

const ShiftTimeAutoComplete = ({ t, control, defaultShift = null, setValue = null }) => {
    const [loading, setLoading] = useState(true);
    const [shifts, setShifts] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await shiftTimesService.getAll();
                setShifts(data);
                if (defaultShift) {
                    setValue("shiftTime", {
                        Key: defaultShift.Id,
                        StringValue: `${defaultShift.ShiftTitle} || ${defaultShift.ShiftTimeFrom} - ${defaultShift.ShiftTimeTo}`,
                    });
                }
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
            name="shiftTime"
            rules={{
                required: true,
            }}
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    fullWidth
                    value={field.value || null}
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

export default ShiftTimeAutoComplete;
