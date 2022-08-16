import { Autocomplete, CircularProgress, InputAdornment } from "@mui/material";
import nationalitiesService from "config/axios/nationalitiesService";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setAllNats } from "redux/slices/nationalitiesSlice";
import InputField from "../general/InputField";

const NationalityInput = ({ control, t }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { allNats } = useSelector((state) => state.nationalities);

    useEffect(() => {
        (async () => {
            try {
                const { data: natsRes } = await nationalitiesService.getAll();
                dispatch(setAllNats(natsRes));
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
                    onChange={(e, val) => field.onChange(val)}
                    options={allNats}
                    getOptionLabel={(opt) => opt.StringValue}
                    isOptionEqualToValue={(opt, val) => opt.Key === val.Key}
                    renderInput={(params) => (
                        <InputField
                            {...params}
                            label={t("common.nat")}
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
            name="nationality"
            rules={{ required: true }}
        />
    );
};

export default NationalityInput;
