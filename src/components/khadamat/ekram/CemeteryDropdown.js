import styled from '@emotion/styled';
import { ListAltOutlined, LocationOn, MoreVert } from '@mui/icons-material';
import { Fade, IconButton, Menu } from '@mui/material';
import decodeShapePath from 'src/config/decodeShapePath';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DropdownItem from '../general/DropdownItem';
import MapsDialog from './MapsDialog';

const CemeteryPopOver = styled(Menu)(() => ({}));

const CemeteryDropdown = ({ shapePath, id }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [mapDialogOpen, setMapDialogOpen] = useState(false);
    const [paths, setPaths] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { page } = useSelector((state) => state.cemeteries);

    const options = {
        strokeColor: '#55DE7C',
        fillColor: '#55DE7C',
        fillOpacity: 0.1,
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMapDialogOpen = () => {
        handleMenuClose();
        setPaths(decodeShapePath(shapePath));
        setMapDialogOpen(true);
    };

    return (
        <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVert />
            </IconButton>
            <Menu
                disableScrollLock
                open={menuOpen}
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                TransitionComponent={Fade}
                sx={{
                    '& .MuiPopover-paper': {
                        backgroundColor: 'success.light',
                        padding: 1,
                        borderRadius: 1,
                    },

                    '& .MuiMenuItem-root': {
                        color: 'black',
                        borderRadius: 1,
                        '&:hover': {
                            background: '#CDF3CE',
                        },
                    },
                }}
            >
                <DropdownItem
                    onClick={handleMapDialogOpen}
                    label={t('ekram.cemeteries.location')}
                    icon={<LocationOn />}
                />

                <DropdownItem
                    onClick={() => {
                        handleMenuClose();
                        navigate(`/dead/cemeteries/${id}?page=${page}`);
                    }}
                    label={t('common.details')}
                    icon={<ListAltOutlined />}
                />
            </Menu>
            {mapDialogOpen ? (
                <MapsDialog
                    open={mapDialogOpen}
                    onClose={() => setMapDialogOpen(false)}
                    center={{ lat: paths[0].lat, lng: paths[0].lng }}
                    title={t('ekram.cemeteries.location')}
                    paths={paths}
                    polyOptions={options}
                />
            ) : (
                ''
            )}
        </>
    );
};

export default CemeteryDropdown;
