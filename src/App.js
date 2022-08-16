// routes
import { CircularProgress } from '@mui/material';
import { Suspense } from 'react';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import { ChartStyle } from './components/chart';
import Center from './components/khadamat/general/Center';
import NotistackProvider from './components/NotistackProvider';
import { ProgressBarStyle } from './components/ProgressBar';
import ScrollToTop from './components/ScrollToTop';
import ThemeSettings from './components/settings';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <Suspense
      fallback={
        <Center my={20}>
          <CircularProgress size={200} color="success" />
        </Center>
      }
    >
      <MotionLazyContainer>
        <ThemeProvider>
          <ThemeSettings>
            <NotistackProvider>
              <ProgressBarStyle />
              <ChartStyle />
              {/* <ScrollToTop /> */}
              <Router />
            </NotistackProvider>
          </ThemeSettings>
        </ThemeProvider>
      </MotionLazyContainer>
    </Suspense>
  );
}
