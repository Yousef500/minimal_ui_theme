import styled from '@emotion/styled';
import {
  ArchiveOutlined,
  ArchiveRounded,
  ContentPasteRounded,
  EditRounded,
  LocationOn,
  MoreVert,
  RemoveCircleOutlineRounded,
  UnarchiveOutlined,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Fade,
  IconButton,
  Menu,
  Stack,
  Typography,
} from '@mui/material';
import Button from 'src/theme/overrides/Button';
import i18n from 'src/locales/i18n';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setDead } from 'src/redux/slices/deadSlice';
import deadService from 'src/config/axios/deadServices';
import DeleteDialog from '../general/DeleteDialog';
import DropdownItem from '../general/DropdownItem';
import MapsDialog from './MapsDialog';

const DeadPopOverMenu = styled(Menu)(() => ({
  '& .MuiMenu-paper': {
    backgroundImage: `
        linear-gradient(
            45deg,
            hsl(208deg 84% 59%) 0%,
            hsl(208deg 85% 58%) 5%,
            hsl(208deg 85% 58%) 10%,
            hsl(208deg 86% 58%) 14%,
            hsl(208deg 86% 58%) 19%,
            hsl(208deg 87% 58%) 24%,
            hsl(208deg 88% 58%) 29%,
            hsl(208deg 88% 58%) 33%,
            hsl(208deg 89% 57%) 38%,
            hsl(208deg 89% 57%) 43%,
            hsl(208deg 90% 57%) 48%,
            hsl(208deg 90% 57%) 52%,
            hsl(208deg 91% 57%) 57%,
            hsl(208deg 91% 57%) 62%,
            hsl(208deg 92% 56%) 67%,
            hsl(208deg 93% 56%) 71%,
            hsl(208deg 93% 56%) 76%,
            hsl(208deg 94% 56%) 81%,
            hsl(208deg 94% 56%) 86%,
            hsl(208deg 95% 56%) 90%,
            hsl(208deg 95% 55%) 95%,
            hsl(208deg 96% 55%) 100%
        )
`,
  },
  '& .MuiMenuItem-root': {
    '&:hover': {
      background: '#E1F3F8',
      color: 'black',
    },
    color: '#ECF8F5',
  },
}));

const DeadDropdown = ({ lat, lng, person, page }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mapsOpen, setMapsOpen] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const menuOpen = Boolean(anchorEl);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e) => {
    setAnchorEl(null);
  };

  const handleMapsDialogOpen = () => {
    handleMenuClose();
    setMapsOpen(true);
  };

  const handleRecordStatus = async (status) => {
    setChangingStatus(true);
    try {
      const { data: archRes } = await deadService.changeSatus(person.Id, status);
      const { data: newDead } = await deadService.searchDead();
      dispatch(setDead(newDead));
      setChangingStatus(false);
      status ? handleMenuClose() : setDeleteConfirmOpen(false);
      toast.success(t('common.success.general'));
    } catch (err) {
      console.log({ err });
      toast.error(t('common.error.unknown'));
      setChangingStatus(false);
    }
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <MoreVert />
      </IconButton>
      <DeadPopOverMenu
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
      >
        <DropdownItem label={t('common.location')} icon={<LocationOn />} onClick={handleMapsDialogOpen} />
        <DropdownItem
          component={Link}
          to={`/dead/${person.Id}?page=${page}`}
          label={t('common.details')}
          icon={<ContentPasteRounded />}
        />
        <DropdownItem
          component={Link}
          to={`/dead/edit/${person.Id}?page=${page}`}
          label={t('common.edit')}
          icon={<EditRounded />}
        />

        {changingStatus ? (
          <DropdownItem label={t('common.loading')} icon={<CircularProgress size={10} />} />
        ) : person.IsActive ? (
          <DropdownItem
            label={t('common.archive')}
            icon={<ArchiveOutlined />}
            onClick={() => {
              handleMenuClose();
              setDeleteConfirmOpen(true);
            }}
          />
        ) : (
          <DropdownItem
            label={t('common.restore')}
            icon={<UnarchiveOutlined />}
            onClick={() => handleRecordStatus(true)}
          />
        )}
      </DeadPopOverMenu>
      {mapsOpen ? (
        <MapsDialog
          open={mapsOpen}
          title={t('ekram.dead.graveLocation')}
          onClose={() => setMapsOpen(false)}
          center={{ lat, lng }}
          markerCoords={{ lat, lng }}
        />
      ) : (
        ''
      )}

      {deleteConfirmOpen ? (
        <DeleteDialog
          t={t}
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          title={t('common.archiveConfirm', {
            data: i18n.language === 'ar' ? person.NameFl : person.NameSl,
          })}
          handleDelete={() => handleRecordStatus(false)}
          deleting={changingStatus}
          deleteText={t('common.archive')}
          deleteIcon={<ArchiveRounded />}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default DeadDropdown;
