import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteDeadFilter, setDead, setDeadLoading } from 'src/redux/slices/deadSlice';
import deadService from 'src/config/axios/deadServices';
import FilterChip from '../general/FilterChip';

const DeadActiveFilters = ({ handleFiltersReset, reset, resetField }) => {
    const dispatch = useDispatch();
    const { filters } = useSelector((state) => state.dead);
    const { t } = useTranslation();

    const handleDeleteFilter = async (filter) => {
        const activeFilters = document.getElementById('active-filters').children.length;
        if (activeFilters === 1) {
            reset();
            handleFiltersReset();
        } else {
            try {
                dispatch(setDeadLoading(true));
                dispatch(deleteDeadFilter(filter));
                resetField(filter);
                const { data: deadData } = await deadService.searchDead();
                dispatch(setDead(deadData));
            } catch (err) {
                dispatch(setDeadLoading(false));
                console.log({ err });
                toast.error(t('common.error.unknown'));
            }
        }
    };

    return (
        <Stack
            id="active-filters"
            direction="row"
            spacing={2}
            mt={1}
            justifyContent={'flex-start'}
            overflow={'auto'}
            sx={{ flexWrap: 'wrap' }}
        >
            <FilterChip
                label={`${t('common.name')}: ${filters.name}`}
                name="name"
                onDelete={handleDeleteFilter}
                filter={filters.name}
            />
            <FilterChip
                label={`${t('common.nat')}: ${filters.nationality}`}
                name="nationality"
                onDelete={handleDeleteFilter}
                filter={filters.nationality}
            />
            <FilterChip
                label={`${t('common.id')}: ${filters.nationalNumber}`}
                name="nationalNumber"
                onDelete={handleDeleteFilter}
                filter={filters.nationalNumber}
            />
            <FilterChip
                label={`${t('common.sortBy')}: ${filters.sortBy?.label}`}
                name="sortBy"
                onDelete={handleDeleteFilter}
                filter={filters.sortBy}
            />
            <FilterChip
                label={`${t('common.order')}: ${
                    filters.orderby === '0' ? t('common.asc') : t('common.desc')
                }`}
                name="orderby"
                onDelete={handleDeleteFilter}
                filter={filters.orderby}
            />
            <FilterChip
                label={`${t('ekram.dead.deathDate')}: ${filters.dateOfDeath?.split('T')[0]}`}
                name="dateOfDeath"
                onDelete={handleDeleteFilter}
                filter={filters.dateOfDeath}
            />
            <FilterChip
                label={`${t('ekram.dead.deathDateFrom')}: ${
                    filters.dateOfDeathFrom?.split('T')[0]
                }`}
                name="dateOfDeathFrom"
                onDelete={handleDeleteFilter}
                filter={filters.dateOfDeathFrom}
            />
            <FilterChip
                label={`${t('ekram.dead.deathDateTo')}: ${filters.dateOfDeathTO?.split('T')[0]}`}
                name="dateOfDeathTO"
                onDelete={handleDeleteFilter}
                filter={filters.dateOfDeathTO}
            />

            <FilterChip
                label={`${t('common.active')}: ${
                    filters.isActive ? t('common.yes') : t('common.no')
                }`}
                name="isActive"
                onDelete={handleDeleteFilter}
                filter={filters.isActive}
            />
        </Stack>
    );
};

export default DeadActiveFilters;
