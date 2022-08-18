import { SearchRounded } from '@mui/icons-material';
import { IconButton, InputBase, Paper, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setDead, setDeadFilterBy, setDeadLoading } from 'src/redux/slices/deadSlice';
import deadService from 'src/config/axios/deadServices';

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
                borderRadius: 5,
                px: 3,
                backgroundColor: 'info.lighter',
                color: 'black',
            }}
            elevation={10}
        >
            <Stack
                component={'form'}
                onSubmit={handleSubmit(handleSearch)}
                height={60}
                direction="row"
                justifyContent="space-between"
                width="100%"
                spacing={3}
            >
                <InputBase
                    {...register('filterBy')}
                    fullWidth
                    placeholder={t('accounts.users.search')}
                    size={'large'}
                />
                <IconButton color="info" type="submit">
                    <SearchRounded />
                </IconButton>
            </Stack>
        </Paper>
    );
};

export default DeadSearch;
