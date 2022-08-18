import { Search } from '@mui/icons-material';
import { IconButton, InputBase, Paper, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import cemeteriesService from 'src/config/axios/cemeteriesService';
import {
    setCemeteries,
    setCemeteriesFilterBy,
    setCemeteriesLoading,
} from 'src/redux/slices/cemeteriesSlice';

const CemeterySearch = ({ t }) => {
    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();

    const handleSearch = async ({ filterBy }) => {
        try {
            dispatch(setCemeteriesLoading(true));
            dispatch(setCemeteriesFilterBy(filterBy));
            const { data: cems } = await cemeteriesService.searchCemeteries();
            dispatch(setCemeteries(cems));
        } catch (err) {
            console.log({ err });
            dispatch(setCemeteries({}));
            dispatch(setCemeteriesLoading(false));
        }
    };

    return (
        <Paper
            sx={{ borderRadius: 5, backgroundColor: 'success.lighter', color: 'black' }}
            elevation={7}
        >
            <Stack direction="row" component="form" onSubmit={handleSubmit(handleSearch)}>
                <InputBase
                    fullWidth
                    sx={{ ml: 1, flex: 1, p: 2 }}
                    placeholder={t('common.search')}
                    {...register('filterBy')}
                />
                <IconButton type="submit" color="success" sx={{ p: 2 }}>
                    <Search />
                </IconButton>
            </Stack>
        </Paper>
    );
};

export default CemeterySearch;
