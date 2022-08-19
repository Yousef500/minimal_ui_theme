import styled from '@emotion/styled';
import { Card, CardHeader, Chip } from '@mui/material';
import dayjs from 'dayjs';
import ShiftTimeDropdown from './ShiftTimeDropdown';

const Status = styled(Chip)((theme) => ({
    borderRadius: 5,
}));

const ShiftTimeCard = ({ shift, t }) => {
    return (
        <Card sx={{ backgroundColor: 'secondary.lighter' }}>
            <CardHeader
                sx={{ p: 2 }}
                titleTypographyProps={{
                    gutterBottom: true,
                    variant: 'h5',
                }}
                title={shift.ShiftTitle}
                avatar={
                    shift.IsActive ? (
                        <Status label={t('common.active')} color={'secondary'} />
                    ) : (
                        <Status label={t('common.inactive')} variant={"outlined"} sx={{ backgroundColor: 'secondary.lighter' }} />
                    )
                }
                subheader={t('securityGuards.shifts.shiftTime', {
                    from: dayjs(`2019-01-25 ${shift.ShiftTimeFrom}`).format('hh:mm a'),
                    to: dayjs(`2019-01-25 ${shift.ShiftTimeTo}`).format('hh:mm a'),
                })}
                action={<ShiftTimeDropdown t={t} shift={shift} />}
            />
        </Card>
    );
};

export default ShiftTimeCard;
