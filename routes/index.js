var express = require('express');
var path = require('path');
var router = express.Router();
var db = require('mysql2');
var dbconn = require('./db.js');
var crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'System Quiz' });
});

/* quiz page. */
router.get('/quiz', function(req, res) {
  var name = req.query.name.trim().slice(0,8);
  if (name.length===0) {res.redirect('/');}
  res.render('quiz', { title: 'System Quiz', name: name});
});

router.get("/getProblems", function(req, res) {
  const key = crypto.createHash('sha256').update("Saen02u_4eS_K3y").digest();
  const data = require("../public/jsons/problems.json");
  console.log("succes get raw json");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  const text = JSON.stringify(data);
  let encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  console.log("success encrypt");
  res.send( key.toString('hex') + '.' + iv.toString('hex') + '.' + encrypted.toString('base64') );
});

router.get('/saveScore', async function(req, res) {
  const name = req.query.name?.trim().slice(0, 8) || '';
  const score = Number(req.query.t2NvWG8);
  const countdown = Number(req.query.countdown);
  console.log(name, score, countdown);

  // Validate inputs
  if (
    name.length === 0 ||
    isNaN(score) || score < 0 || score > 30 ||
    isNaN(countdown) || countdown < 0 || countdown > 1200
  ) {
    return res.redirect('/');
  }

  try {
  // First check if the new score should replace the old one
    const [rows] = await dbconn.query(`
      SELECT * FROM leaderboard
      WHERE username = ? AND (score < ? OR (score = ? AND countdown < ?))`,
      [name, score, score, countdown]
    );

      if (rows.length > 0) {
      // Update existing better score
        await dbconn.query(`
          UPDATE leaderboard
          SET score = ?, countdown = ?, endedtime = CURRENT_TIMESTAMP()
          WHERE username = ?`,
          [score, countdown, name]
        );
        console.log(`UPDATE leaderboard SET score=${score}, countdown=${countdown}, endedtime=CURRENT_TIMESTAMP() WHERE username=${name};`);
        console.log("Score updated");
      } else {
      // Try to insert, or ignore if user already exists and has equal/better score
        await dbconn.query(`
          INSERT INTO leaderboard (username, score, countdown)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE
            score = IF(VALUES(score) > score OR (VALUES(score) = score AND VALUES(countdown) > countdown), VALUES(score), score),
            countdown = IF(VALUES(score) > score OR (VALUES(score) = score AND VALUES(countdown) > countdown), VALUES(countdown), countdown),
            endedtime = IF(VALUES(score) > score OR (VALUES(score) = score AND VALUES(countdown) > countdown), CURRENT_TIMESTAMP(), endedtime)`,
          [name, score, countdown]
        );
        console.log("Score inserted or retained existing better score");
      }
      return res.redirect('/leaderboard');
    } catch (err) {
       console.error("DB error:", err);
       return res.status(500).send("DB error");
    }
});

router.get('/leaderboard', async function(req, res) {
  try {
    const [rows] = await dbconn.query('SELECT RANK() OVER (ORDER BY score DESC, endedtime, countdown DESC, username) as no,username,score,endedtime FROM leaderboard');
    res.render('leaderboard', { title: 'System Quiz', rankList: rows });
  } catch (err) {
    console.log("DB error:", err);
  }
});

module.exports = router;
