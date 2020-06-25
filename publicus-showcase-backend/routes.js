import DB from "./db";
import express from 'express'
import path from 'path';

const router = express.Router();

router.get(['/home', '/home/*'], function(req, res, next) {
  res.sendFile(path.join(__dirname, '..', 'publicus-showcase-ui', 'build', 'index.html'));
});

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '..', 'publicus-showcase-ui', 'build', 'index.html'));
});



router.get('/api/hello', (req, res, next) => {
  res.json('World');
});

router.get('/api/stats', async (req, res) => {
  try{
    let stats = await DB.Stats.all();
    console.log(stats);
    await res.json(stats);
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/api/addReg', async (req, res) => {
  try{
    console.log(req.body);
    let stats = await DB.Stats.post(req.body);
    console.log(stats);
    await res.json([]);
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get('/api/statsPerDate', async (req, res) => {
  try{
    let stats = await DB.Stats.statPerDate();
    console.log(stats);
    await res.json(stats);
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});


export default router;