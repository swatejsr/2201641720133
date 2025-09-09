import React, { useState } from 'react';
import { recordLog } from '../utils/logger';
import {
  Button,
  TextField,
  Paper,
  Typography,
  Box,
  IconButton,
  Grid,
  Alert
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const MAX_ENTRIES = 5;

function isValidWebUrl(input) {
  try {
    return Boolean(new URL(input));
  } catch {
    return false;
  }
}

function getStoredLinks() {
  try {
    return JSON.parse(localStorage.getItem('shortenedLinks')) || [];
  } catch {
    recordLog("frontend", "error", "storage", "Could not read links from localStorage");
    return [];
  }
}

function setStoredLinks(list) {
  try {
    localStorage.setItem('shortenedLinks', JSON.stringify(list));
  } catch {
    recordLog("frontend", "error", "storage", "Could not save links to localStorage");
  }
}

export default function UrlShortener() {
  const [forms, setForms] = useState(
    Array(MAX_ENTRIES).fill().map(() => ({
      url: '',
      duration: '',
      code: '',
      result: '',
      expires: null,
      feedback: ''
    }))
  );

  function updateField(idx, key, value) {
    setForms(prev => {
      const copy = [...prev];
      copy[idx][key] = value;
      return copy;
    });
  }

  function handleShorten(idx) {
    const entry = forms[idx];
    let feedback = '';
    if (!isValidWebUrl(entry.url)) {
      feedback = 'URL format is incorrect.';
      recordLog("frontend", "warn", "input", "Invalid URL format.");
      updateField(idx, 'feedback', feedback);
      return;
    }
    const mins = entry.duration ? parseInt(entry.duration) : 30;
    if (!Number.isFinite(mins) || mins <= 0) {
      feedback = 'Duration must be a positive number.';
      recordLog("frontend", "warn", "input", "Invalid duration.");
      updateField(idx, 'feedback', feedback);
      return;
    }
    let links = getStoredLinks();
    let code = entry.code.trim();
    if (code) {
      if (links.some(l => l.code === code)) {
        feedback = `Code "${code}" already exists.`;
        recordLog("frontend", "warn", "input", `Code collision: ${code}`);
        updateField(idx, 'feedback', feedback);
        return;
      }
    } else {
      do {
        code = Math.random().toString(36).slice(2, 8);
      } while (links.some(l => l.code === code));
    }
    const now = new Date();
    const expiry = new Date(now.getTime() + mins * 60000);
    const newLink = {
      url: entry.url,
      code,
      created: now.toISOString(),
      expires: expiry.toISOString(),
      visits: []
    };
    links.push(newLink);
    setStoredLinks(links);
    setForms(prev => {
      const copy = [...prev];
      copy[idx].result = `${window.location.origin}/${code}`;
      copy[idx].expires = expiry;
      copy[idx].feedback = '';
      return copy;
    });
    recordLog("frontend", "info", "shorten", `Shortened: ${code}`);
  }

  function copyResult(text) {
    navigator.clipboard.writeText(text);
    recordLog("frontend", "info", "ui", "Copied link.");
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Link Shortener
      </Typography>
      <Typography variant="body2" paragraph>
        You can shorten up to {MAX_ENTRIES} links at once.
      </Typography>
      {forms.map((form, idx) => (
        <Paper key={idx} elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Entry {idx + 1}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Web Address"
                value={form.url}
                onChange={e => updateField(idx, 'url', e.target.value)}
                placeholder="https://your-site.com"
                error={!!form.feedback}
                helperText={form.feedback}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={form.duration}
                onChange={e => updateField(idx, 'duration', e.target.value)}
                placeholder="Default: 30"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Custom Code"
                value={form.code}
                onChange={e => updateField(idx, 'code', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={() => handleShorten(idx)}>
                Shorten
              </Button>
            </Grid>
            {form.result && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="body2">
                    Link:&nbsp;
                    <a href={form.result} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                      {form.result}
                    </a>
                    <IconButton onClick={() => copyResult(form.result)}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Expires: {form.expires && new Date(form.expires).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
      ))}
    </Box>
  );
}