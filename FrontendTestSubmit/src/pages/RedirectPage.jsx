import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { recordLog } from '../utils/logger';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function LinkRedirect() {
  const { shortcode } = useParams();

  useEffect(() => {
    recordLog("frontend", "info", "redirect", `Attempt: ${shortcode}`);
    let links = [];
    try {
      links = JSON.parse(localStorage.getItem('shortenedLinks')) || [];
    } catch {}
    const found = links.find(l => l.code === shortcode);
    if (found) {
      const now = Date.now();
      const expiry = new Date(found.expires).getTime();
      if (now > expiry) {
        recordLog("frontend", "error", "redirect", `Expired: ${shortcode}`);
        alert('This link has expired.');
        window.location.replace('/');
      } else {
        const visit = { time: new Date().toISOString(), ref: 'direct', location: 'unknown' };
        const updated = links.map(l =>
          l.code === shortcode ? { ...l, visits: [...l.visits, visit] } : l
        );
        localStorage.setItem('shortenedLinks', JSON.stringify(updated));
        recordLog("frontend", "info", "redirect", `Redirected: ${shortcode}`);
        window.location.replace(found.url);
      }
    } else {
      recordLog("frontend", "error", "redirect", `Not found: ${shortcode}`);
      alert('Link not found.');
      window.location.replace('/');
    }
  }, [shortcode]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Redirecting...
      </Typography>
    </Box>
  );
}