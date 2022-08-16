import { Autocomplete, CircularProgress, InputAdornment } from "@mui/material";
import cemeteriesService from "config/axios/cemeteriesService";
import decodeShapePath from "config/decodeShapePath";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setAllCemeteries } from "redux/slices/cemeteriesSlice";
import InputField from "../general/InputField";

const CemeteryInput = ({ control, t, setCenter, setPaths, setMarkerCoords, getValues }) => {
    const [loading, setLoading] = useState(true);
    const { allCemeteries } = useSelector((state) => state.cemeteries);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            try {
                const { data: cemeteriesRes } = await cemeteriesService.getAll();
                dispatch(setAllCemeteries(cemeteriesRes));
                const defaultCem = getValues("cemetery");

                if (defaultCem?.Key) {
                    const shape = cemeteriesRes.find(
                        (cem) => cem.Key === defaultCem.Key
                    )?.ExtraData;
                    const decodedShape = decodeShapePath(shape);
                    setPaths(decodedShape);
                }

                setLoading(false);
            } catch (err) {
                console.log({ err });
                toast.error(t("common.error.unknown"));
                setLoading(false);
            }
        })();
    }, []);

    const handleCemeteryChange = (val, field) => {
        field.onChange(val);
        setMarkerCoords(null);
        const decodedPaths = decodeShapePath(val.ExtraData);
        setCenter({ lat: decodedPaths[0]?.lat, lng: decodedPaths[0]?.lng });
        setPaths(decodedPaths);
    };

    return (
        <Controller
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    value={field.value || null}
                    onChange={(e, val) => handleCemeteryChange(val, field)}
                    options={allCemeteries}
                    getOptionLabel={(opt) => opt.StringValue}
                    isOptionEqualToValue={(opt, val) => opt.Key === val.Key}
                    renderInput={(params) => (
                        <InputField
                            {...params}
                            label={t("ekram.cemeteries.name")}
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
            name="cemetery"
            rules={{ required: true }}
        />
    );
};

export default CemeteryInput;
