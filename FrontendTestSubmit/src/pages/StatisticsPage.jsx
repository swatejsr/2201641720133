import React, { useState, useEffect } from 'react';
import { recordLog } from '../utils/logger';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function LinkStats() {
  const [links, setLinks] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    let arr = [];
    try {
      arr = JSON.parse(localStorage.getItem('shortenedLinks')) || [];
    } catch {}
    setLinks(arr);
    recordLog("frontend", "info", "stats", "Stats loaded.");
  }, []);

  function toggleRow(code) {
    setExpanded(prev => ({ ...prev, [code]: !prev[code] }));
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Link Statistics
      </Typography>
      {links.length === 0 ? (
        <Typography variant="body1">No links available.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Short Link</TableCell>
                <TableCell align="right">Original</TableCell>
                <TableCell align="right">Clicks</TableCell>
                <TableCell align="right">Created</TableCell>
                <TableCell align="right">Expires</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {links.map(link => (
                <React.Fragment key={link.code}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        aria-label="expand"
                        size="small"
                        onClick={() => toggleRow(link.code)}
                      >
                        {expanded[link.code] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <a href={`/${link.code}`} target="_blank" rel="noopener noreferrer">
                        {`${window.location.origin}/${link.code}`}
                      </a>
                    </TableCell>
                    <TableCell align="right" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {link.url}
                    </TableCell>
                    <TableCell align="right">{link.visits.length}</TableCell>
                    <TableCell align="right">{new Date(link.created).toLocaleString()}</TableCell>
                    <TableCell align="right">{new Date(link.expires).toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={expanded[link.code]} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Visit Details
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Time</TableCell>
                                <TableCell>Referrer</TableCell>
                                <TableCell>Location</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {link.visits.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={3}>No visits yet.</TableCell>
                                </TableRow>
                              ) : (
                                link.visits.map((v, i) => (
                                  <TableRow key={i}>
                                    <TableCell>{new Date(v.time).toLocaleString()}</TableCell>
                                    <TableCell>{v.ref || 'Direct'}</TableCell>
                                    <TableCell>{v.location || 'Unknown'}</TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}