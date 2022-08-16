import { SearchRounded } from "@mui/icons-material";
import { IconButton, InputBase, Paper, Stack } from "@mui/material";
import nationalitiesService from "src/config/axios/nationalitiesService";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setNationalities, setNatsFilterBy, setNatsLoading } from "src/redux/slices/nationalitiesSlice";

const NatSearch = ({ t }) => {
    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();

    const handleSearch = async ({ filterBy }) => {
        try {
            dispatch(setNatsLoading(true));
            dispatch(setNatsFilterBy(filterBy));
            const { data: filteredNats } = await nationalitiesService.searchNats();
            dispatch(setNationalities(filteredNats));
        } catch (err) {
            console.log({ err });
            dispatch(setNatsLoading(false));
        }
    };

    return (
        <Paper
            elevation={6}
            component="form"
            sx={{
                borderRadius: 7,
                py: 1,
                px: 2,
            }}
            onSubmit={handleSubmit(handleSearch)}
        >
            <Stack direction="row" justifyContent="space-between" width={"100%"}>
                <InputBase fullWidth placeholder={t("common.search")} {...register("filterBy")} />
                <IconButton color="success" type="submit">
                    <SearchRounded />
                </IconButton>
            </Stack>
        </Paper>
    );
};

export default NatSearch;
