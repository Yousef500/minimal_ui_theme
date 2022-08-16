import { DeleteOutlineRounded, EditOutlined } from "@mui/icons-material";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader, Divider,
    Stack
} from "@mui/material";
// 
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import cemeteriesService from "src/config/axios/cemeteriesService";
import i18n from "src/locales/i18n";
import { setCemeteries } from "src/redux/slices/cemeteriesSlice";

import CardData from "../general/CardData";
import CardStatus from "../general/CardStatus";
import DeleteDialog from "../general/DeleteDialog";
import CemeteryDropdown from "./CemeteryDropdown";

const cardStyle = {
    background: `
    linear-gradient(
        45deg,
        hsl(114deg 42% 95%) 0%,
        hsl(114deg 43% 95%) 13%,
        hsl(114deg 45% 95%) 19%,
        hsl(114deg 47% 95%) 24%,
        hsl(114deg 48% 95%) 28%,
        hsl(114deg 50% 95%) 32%,
        hsl(114deg 52% 95%) 35%,
        hsl(114deg 54% 95%) 39%,
        hsl(114deg 55% 96%) 42%,
        hsl(114deg 57% 96%) 45%,
        hsl(113deg 59% 96%) 48%,
        hsl(113deg 61% 96%) 52%,
        hsl(113deg 63% 96%) 55%,
        hsl(113deg 65% 96%) 58%,
        hsl(113deg 67% 96%) 61%,
        hsl(113deg 69% 96%) 65%,
        hsl(113deg 71% 96%) 68%,
        hsl(113deg 73% 96%) 72%,
        hsl(113deg 75% 96%) 76%,
        hsl(113deg 77% 96%) 81%,
        hsl(113deg 79% 96%) 87%,
        hsl(113deg 81% 96%) 100%
      )
      `,
    borderRadius: 5,
    py: 2,
};

const CemeteryCard = ({ cemetery }) => {
    const { page } = useSelector((state) => state.cemeteries);
    const [deleteDialogState, setDeleteDialogState] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleDialogClose = () => {
        setDeleteDialogState(false);
    };

    const handleDeleteCemetery = async () => {
        setDeleting(true);
        try {
            const { data: deleteRes } = await cemeteriesService.deleteCemetery(cemetery.Id);
            const { data: newCemeteries } = await cemeteriesService.searchCemeteries();
            dispatch(setCemeteries(newCemeteries));
            setDeleting(false);
            handleDialogClose();
            toast.success(t("common.success.delete"));
        } catch (err) {
            console.log({ err });
            toast.error(t("common.error.unknown"));
            setDeleting(false);
        }
    };

    return (
        <>
            <Card sx={cardStyle}>
                <CardHeader
                    titleTypographyProps={{
                        align: "center",
                        variant: "h4",
                        gutterBottom: true,
                        component: Link,
                        to: `/dead/cemeteries/${cemetery.Id}?page=${page}`,
                    }}
                    title={i18n.language === "en" ? cemetery.NameSl : cemetery.NameFl}
                    action={<CemeteryDropdown shapePath={cemetery.shapePath} id={cemetery.Id} />}
                />
                <Divider />
                <CardContent>
                    <CardData label={`${t("common.address")}`} data={cemetery.Address} />
                    <CardStatus active={cemetery.IsActive} variant="outlined" />
                    <CardData label={`${t("common.lat")}`} data={cemetery.LocationLat} />
                    <CardData label={`${t("common.long")}`} data={cemetery.LocationLong} />
                </CardContent>
                <CardActions>
                    <Stack direction="row" justifyContent="center" width={"100%"} spacing={3}>
                        <Button
                            startIcon={<EditOutlined />}
                            variant="contained"
                            color="success"
                            sx={{ fontSize: 18 }}
                            component={Link}
                            to={`/dead/cemeteries/edit/${cemetery.Id}?page=${page}`}
                        >
                            {t("common.edit")}
                        </Button>

                        <Button
                            startIcon={<DeleteOutlineRounded />}
                            variant="contained"
                            color="error"
                            sx={{ fontSize: 18 }}
                            onClick={() => setDeleteDialogState(true)}
                        >
                            {t("common.delete")}
                        </Button>
                    </Stack>
                </CardActions>
            </Card>

            {deleteDialogState ? (
                <DeleteDialog
                    t={t}
                    open={deleteDialogState}
                    onClose={handleDialogClose}
                    title={t("common.deleteConfirm", {
                        data: i18n.language === "en" ? cemetery.NameSl : cemetery.NameFl,
                    })}
                    handleDelete={handleDeleteCemetery}
                    deleting={deleting}
                />
            ) : (
                ""
            )}
        </>
    );
};

export default CemeteryCard;
