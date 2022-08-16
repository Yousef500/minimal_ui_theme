import styled from '@emotion/styled';
import { IconButton } from '@mui/material';

export default styled((props) => {
  const { expand, ...children } = props;
  return <IconButton {...children} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shorter,
  }),
}));
