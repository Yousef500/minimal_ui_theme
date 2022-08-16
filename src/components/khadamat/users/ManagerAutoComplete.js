import { Autocomplete } from "@mui/material";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import InputField from "../general/InputField";

const ManagerAutoComplete = ({ managers, control, label }) => {

    // useEffect(() => {
    //     setValue("manager", null);
    // }, [watchJob]);

    return (
        <Controller
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    value={field.value || null}
                    isOptionEqualToValue={(opt, val) => opt.Key === val.Key}
                    options={managers}
                    getOptionLabel={(option) => option.StringValue}
                    onChange={(e, val) => field.onChange(val)}
                    renderInput={(params) => (
                        <InputField
                            label={label}
                            {...params}
                            error={!!error}
                            helperText={error?.message}
                        />
                    )}
                />
            )}
            name="manager"
            control={control}
        />
    );
};

export default ManagerAutoComplete;
