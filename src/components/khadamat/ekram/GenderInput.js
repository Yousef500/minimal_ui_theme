import { Autocomplete, CircularProgress, InputAdornment } from "@mui/material";
import gendersService from "config/axios/gendersService";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setAllGenders } from "redux/slices/gendersSlice";
import InputField from "../general/InputField";

const GenderInput = ({ control, setValue, clearErrors, t }) => {
    const [loading, setLoading] = useState(true);
    const { allGenders } = useSelector((state) => state.genders);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            try {
                const { data: gendersRes } = await gendersService.getAll();
                dispatch(setAllGenders(gendersRes));
                setLoading(false);
            } catch (err) {
                console.log({ err });
                toast.error(t("common.error.unknown"));
                setLoading(false);
            }
        })();
    }, []);

    return (
        <Controller
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    value={field.value || null}
                    onChange={(e, val) => {
                        ["AgeYears", "months", "days"].forEach((name) => {
                            setValue(name, null, { shouldDirty: false });
                            clearErrors(name);
                        });
                        field.onChange(val);
                    }}
                    options={allGenders}
                    getOptionLabel={(opt) => opt.StringValue}
                    isOptionEqualToValue={(opt, val) => opt.Key === val.Key}
                    renderInput={(params) => (
                        <InputField
                            {...params}
                            label={t("common.gender")}
                            error={!!error}
                            helperText={error?.message}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: loading ? (
                                    <InputAdornment position="end">
                                        <CircularProgress size={25} />
                                    </InputAdornment>
                                ) : (
                                    params.InputProps.endAdornment
                                ),
                            }}
                        />
                    )}
                />
            )}
            control={control}
            name="gender"
            rules={{ required: true }}
        />
    );
};

export default GenderInput;
