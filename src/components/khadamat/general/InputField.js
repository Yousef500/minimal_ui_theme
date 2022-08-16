import styled from "@emotion/styled";
import { TextField } from "@mui/material";

const InputField = styled(TextField)(() => ({
    "& .MuiFormHelperText-root": {
        fontSize: 18,
    },
    "& .MuiInputLabel-root": {
        fontSize: 18,
        marginBottom: 100,
    },
    "& .MuiOutlinedInput-root": {
        padding: 5,
    },
}));

export default InputField;
