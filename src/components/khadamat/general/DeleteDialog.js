import { CancelOutlined, DeleteOutlineRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Dialog, DialogActions, DialogTitle, Stack, Typography } from "@mui/material";
import MDButton from "components/MDButton";

const DeleteDialog = ({
    t,
    open,
    onClose,
    title,
    deleting,
    handleDelete,
    deleteText = "",
    deleteIcon = null,
}) => {
    return (
        <Dialog open={open} onClose={onClose} TransitionProps={{ unmountOnExit: true }} fullWidth>
            <DialogTitle>
                <Typography variant="inherit" align="center" gutterBottom>
                    {title}
                </Typography>
            </DialogTitle>
            <DialogActions>
                <Stack direction="row" spacing={5} justifyContent="center" width={"100%"}>
                    <LoadingButton
                        loading={deleting}
                        variant="contained"
                        color="inherit"
                        loadingPosition="start"
                        startIcon={deleteIcon || <DeleteOutlineRounded />}
                        onClick={handleDelete}
                    >
                        {deleteText || t("common.delete")}
                    </LoadingButton>

                    <MDButton
                        variant="gradient"
                        color="info"
                        onClick={onClose}
                        startIcon={<CancelOutlined />}
                    >
                        {t("common.cancel")}
                    </MDButton>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
