import { Autocomplete, CircularProgress, InputAdornment } from "@mui/material";
import shiftsService from "config/axios/shiftsService";
import shiftTimesService from "config/axios/shiftTimesService";
import i18n from "config/i18n";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLoadingShifts, setShifts } from "redux/slices/shiftsSlice";
import InputField from "../general/InputField";

const ShiftsManagementDay = ({ t }) => {
    const [loading, setLoading] = useState(true);
    const [workingDays, setWorkingDays] = useState([]);
    const { control, reset } = useForm();
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            try {
                dispatch(setLoadingShifts(true));
                const { data } = await shiftTimesService.getWorkingDays();
                const days = data.map((day) => ({
                    id: day.Id,
                    label: i18n.language === "ar" ? day.NameFl : day.NameSl,
                }));
                const defaultDay = days.find((day) => ["Saturday", "السبت"].includes(day.label));
                setWorkingDays(days);
                reset({
                    day: defaultDay,
                });
                setLoading(false);
                const { data: shifts } = await shiftsService.getShiftsByDay(defaultDay.id);
                dispatch(setShifts(shifts));
            } catch (err) {
                console.log({ err });
                setLoading(false);
                dispatch(setShifts([]));
                toast.error(t("common.error.unknown"));
            }
        })();
    }, []);

    const handleDayChange = async (onChange, day) => {
        if (day) {
            dispatch(setLoadingShifts(true));
            onChange(day);
            try {
                const { data: shifts } = await shiftsService.getShiftsByDay(day.id);
                dispatch(setShifts(shifts));
            } catch (err) {
                console.log({ err });
                dispatch(setLoadingShifts(false));
                toast.error(t("common.error.unknown"));
            }
        }
    };

    return (
        <Controller
            control={control}
            name="day"
            render={({ field }) => (
                <Autocomplete
                    {...field}
                    value={field.value || null}
                    onChange={(e, val) => handleDayChange(field.onChange, val)}
                    options={workingDays}
                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                    renderInput={(params) => (
                        <InputField
                            {...params}
                            label={t("securityGuards.shifts.day")}
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
                        />
                    )}
                />
            )}
        />
    );
};

export default ShiftsManagementDay;
