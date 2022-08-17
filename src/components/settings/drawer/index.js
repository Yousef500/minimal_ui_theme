import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useState } from 'react';
// @mui
import { Backdrop, Divider, IconButton, Stack, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
// hooks
import { defaultSettings, NAVBAR } from 'src/config';
import { useTranslation } from 'react-i18next';
import useSettings from '../../../hooks/useSettings';
// utils
import cssStyles from '../../../utils/cssStyles';
// config
//
import { varFade } from '../../animate';
import Iconify from '../../Iconify';
import Scrollbar from '../../Scrollbar';
//
import SettingColorPresets from './SettingColorPresets';
import SettingContrast from './SettingContrast';
import SettingDirection from './SettingDirection';
import SettingFullscreen from './SettingFullscreen';
import SettingLayout from './SettingLayout';
import SettingMode from './SettingMode';
import SettingStretch from './SettingStretch';
import ToggleButton from './ToggleButton';

// ----------------------------------------------------------------------

const RootStyle = styled(m.div)(({ theme }) => ({
    ...cssStyles(theme).bgBlur({ color: theme.palette.background.paper, opacity: 0.92 }),
    top: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    position: 'fixed',
    overflow: 'hidden',
    width: NAVBAR.BASE_WIDTH,
    flexDirection: 'column',
    margin: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    zIndex: theme.zIndex.drawer + 3,
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    boxShadow: `-24px 12px 32px -4px ${alpha(
        theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.common.black,
        0.16
    )}`,
}));

// ----------------------------------------------------------------------

export default function SettingsDrawer() {
    const {
        themeMode,
        themeLayout,
        themeStretch,
        themeContrast,
        themeDirection,
        themeColorPresets,
        onResetSetting,
    } = useSettings();

    const { t } = useTranslation();

    const [open, setOpen] = useState(false);

    const notDefault =
        themeMode !== defaultSettings.themeMode ||
        themeLayout !== defaultSettings.themeLayout ||
        themeStretch !== defaultSettings.themeStretch ||
        themeContrast !== defaultSettings.themeContrast ||
        themeDirection !== defaultSettings.themeDirection ||
        themeColorPresets !== defaultSettings.themeColorPresets;

    const varSidebar =
        themeDirection !== 'rtl'
            ? varFade({
                  distance: NAVBAR.BASE_WIDTH,
                  durationIn: 0.32,
                  durationOut: 0.32,
              }).inRight
            : varFade({
                  distance: NAVBAR.BASE_WIDTH,
                  durationIn: 0.32,
                  durationOut: 0.32,
              }).inLeft;

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [open]);

    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Backdrop
                open={open}
                onClick={handleClose}
                sx={{ background: 'transparent', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            />

            {!open && (
                <ToggleButton open={open} notDefault={notDefault} onToggle={handleToggle} t={t} />
            )}

            <AnimatePresence>
                {open && (
                    <RootStyle {...varSidebar}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ py: 2, pr: 1, pl: 2.5 }}
                        >
                            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                                {t('common.settings')}
                            </Typography>

                            <IconButton onClick={onResetSetting}>
                                <Iconify icon={'ic:round-refresh'} width={20} height={20} />
                            </IconButton>

                            <IconButton onClick={handleClose}>
                                <Iconify icon={'eva:close-fill'} width={20} height={20} />
                            </IconButton>
                        </Stack>

                        <Divider sx={{ borderStyle: 'dashed' }} />

                        <Scrollbar sx={{ flexGrow: 1 }}>
                            <Stack spacing={3} sx={{ p: 3 }}>
                                <Stack spacing={1.5}>
                                    <Typography variant="subtitle2">{t('common.mode')}</Typography>
                                    <SettingMode />
                                </Stack>

                                <Stack spacing={1.5}>
                                    <Typography variant="subtitle2">
                                        {t('common.contrast')}
                                    </Typography>
                                    <SettingContrast />
                                </Stack>

                                <Stack spacing={1.5}>
                                    <Typography variant="subtitle2">
                                        {t('common.direction')}
                                    </Typography>
                                    <SettingDirection />
                                </Stack>

                                <Stack spacing={1.5}>
                                    <Typography variant="subtitle2">
                                        {t('common.layout')}
                                    </Typography>
                                    <SettingLayout />
                                </Stack>

                                <Stack spacing={1.5}>
                                    <Typography variant="subtitle2">
                                        {t('common.presets')}
                                    </Typography>
                                    <SettingColorPresets />
                                </Stack>

                                <Stack spacing={1.5}>
                                    <Typography variant="subtitle2">
                                        {t('common.stretch')}
                                    </Typography>
                                    <SettingStretch />
                                </Stack>

                                <SettingFullscreen t={t} />
                            </Stack>
                        </Scrollbar>
                    </RootStyle>
                )}
            </AnimatePresence>
        </>
    );
}
