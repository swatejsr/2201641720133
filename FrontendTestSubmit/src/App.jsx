import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { recordLog } from './utils/logger';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import UrlShortener from "./pages/ShortenerPage.jsx";
import LinkStats from "./pages/StatisticsPage.jsx";
import LinkRedirect from "./pages/RedirectPage.jsx";

export default function MainApp() {
  React.useEffect(() => {
    recordLog("frontend", "info", "app", "App initialized.");
  }, []);

  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Link Shortener
          </Typography>
          <Button color="inherit" component={Link} to="/">Shorten</Button>
          <Button color="inherit" component={Link} to="/stats">Stats</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} disableGutters sx={{ mt: 4, px: 2 }}>
        <Routes>
          <Route path="/" element={<UrlShortener />} />
          <Route path="/stats" element={<LinkStats />} />
          <Route path="/:shortcode" element={<LinkRedirect />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}