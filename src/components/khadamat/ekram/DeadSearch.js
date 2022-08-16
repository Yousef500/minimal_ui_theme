import { SearchRounded } from "@mui/icons-material";
import { IconButton, InputBase, Paper, Stack } from "@mui/material";
import deadService from "config/axios/deadServices";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setDead, setDeadFilterBy, setDeadLoading } from "redux/slices/deadSlice";

const DeadSearch = ({ t }) => {
    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();

    const handleSearch = async ({ filterBy }) => {
        try {
            dispatch(setDeadLoading(true));
            dispatch(setDeadFilterBy(filterBy));
            const { data: foundDead } = await deadService.searchDead();
            console.log({ foundDead });
            dispatch(setDead(foundDead));
        } catch (err) {
            console.log({ err });
            dispatch(setDeadLoading(false));
        }
    };

    return (
        <Paper
            sx={{
                borderRadius: 7,
                px: 3,
                background: `
                            linear-gradient(
                                45deg,
                                hsl(208deg 71% 92%) 0%,
                                hsl(208deg 72% 92%) 13%,
                                hsl(208deg 72% 92%) 19%,
                                hsl(208deg 72% 92%) 24%,
                                hsl(208deg 72% 92%) 28%,
                                hsl(208deg 72% 92%) 32%,
                                hsl(208deg 72% 92%) 35%,
                                hsl(208deg 72% 92%) 39%,
                                hsl(208deg 73% 93%) 42%,
                                hsl(208deg 73% 93%) 45%,
                                hsl(208deg 73% 93%) 48%,
                                hsl(208deg 73% 93%) 52%,
                                hsl(208deg 73% 93%) 55%,
                                hsl(208deg 73% 93%) 58%,
                                hsl(208deg 74% 93%) 61%,
                                hsl(208deg 74% 93%) 65%,
                                hsl(208deg 74% 93%) 68%,
                                hsl(208deg 74% 93%) 72%,
                                hsl(208deg 74% 93%) 76%,
                                hsl(208deg 75% 94%) 81%,
                                hsl(208deg 75% 94%) 87%,
                                hsl(207deg 75% 94%) 100%
                            )
        `,
            }}
            elevation={6}
        >
            <Stack
                component={"form"}
                onSubmit={handleSubmit(handleSearch)}
                height={60}
                direction="row"
                justifyContent="space-between"
                width="100%"
                spacing={3}
            >
                <InputBase
                    {...register("filterBy")}
                    fullWidth
                    placeholder={t("accounts.users.search")}
                    size={"large"}
                />
                <IconButton color="info" type="submit">
                    <SearchRounded />
                </IconButton>
            </Stack>
        </Paper>
    );
};

export default DeadSearch;
