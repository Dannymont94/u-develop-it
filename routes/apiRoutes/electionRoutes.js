const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');
const { describe } = require('yargs');

router.get('/election', (req, res) => {

  const sql = `SELECT candidates.*, parties.name AS party_name, count(candidate_id) AS vote_total FROM election 
              LEFT JOIN candidates ON election.candidate_id = candidates.id 
              LEFT JOIN parties ON candidates.party_id = parties.id 
              GROUP BY candidate_id ORDER BY vote_total DESC`;
  const params = [];

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json({
      message: 'success',
      data: rows
    });
  });
});

router.post('/election', ({ body }, res) => {
  const errors = inputCheck(body, 'voter_id', 'candidate_id');
  if (errors) {
    return res.status(400).json({ error: errors });
  }
  const sql = `INSERT INTO election (voter_id, candidate_id) VALUES (?,?)`;
  const params = [body.voter_id, body.candidate_id];

  db.run(sql, params, function(err, data) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.json({
      message: 'success',
      data: body,
      id: this.lastID
    });
  });
});

module.exports = router;