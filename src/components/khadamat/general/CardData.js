import { Divider, Stack, Typography } from "@mui/material";

const CardData = ({ label, data, labelProps, dataProps, noDivider }) => (
    <>
        <Stack direction="row" justifyContent="space-between" spacing={1} textOverflow={"ellipsis"}>
            <Typography {...labelProps} variant="h5">
                {label}
            </Typography>
            <Typography variant={"subtitle1"} {...dataProps}>
                {data}
            </Typography>
        </Stack>
        {!noDivider && <Divider sx={{ background: "black" }} />}
    </>
);

export default CardData;
