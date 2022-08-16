import { Autocomplete, CircularProgress, InputAdornment } from "@mui/material";
import shiftTimesService from "config/axios/shiftTimesService";
import i18n from "config/i18n";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import InputField from "../general/InputField";

const WorkingDaysInput = ({ t, control, defaultDay = null, setValue = null, ...dayProps }) => {
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await shiftTimesService.getWorkingDays();
                const namedDays = data.map((day) => ({
                    id: day.Id,
                    name: i18n.language === "ar" ? day.NameFl : day.NameSl,
                }));
                setDays(namedDays);
                if (defaultDay) {
                    const day = namedDays.find((d) => d.id === defaultDay);
                    setValue("day", day);
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
            name="day"
            rules={{
                required: true,
            }}
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    fullWidth
                    {...field}
                    value={field.value || null}
                    onChange={(e, val) => field.onChange(val)}
                    options={days}
                    getOptionLabel={(opt) => opt.name}
                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                    renderInput={(params) => (
                        <InputField
                            {...params}
                            label={t("common.day")}
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
                    {...dayProps}
                />
            )}
        />
    );
};

export default WorkingDaysInput;
