import { Chip, CircularProgress, Divider, Stack, Typography, chipProps } from "@mui/material";
import { useTranslation } from "react-i18next";

const CardStatus = ({
    active,
    noDivider,
    loading,
    labelProps,
    color = "info",
    variant = "filled",
}) => {
    const { t } = useTranslation();
    return (
        <>
            <Stack direction="row" justifyContent="space-between">
                <Typography {...labelProps} variant="h5">
                    {t("common.status")}:
                </Typography>
                {loading ? (
                    <CircularProgress color="info" size={33} />
                ) : (
                    <Chip
                        label={active ? t("common.active") : t("common.inactive")}
                        variant={variant}
                        color={active ? color : "default"}
                        sx={{ width: 90, fontSize: 21 }}
                    />
                )}
            </Stack>
            {!noDivider && <Divider />}
        </>
    );
};

export default CardStatus;
