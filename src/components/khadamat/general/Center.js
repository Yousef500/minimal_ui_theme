import {Grid} from '@mui/material'

const Center = ({ children, ...otherProps }) => (
    <Grid container spacing={0} alignItems={'center'} justifyContent={'center'} {...otherProps}>
        {children}
    </Grid>
);

export default Center;
