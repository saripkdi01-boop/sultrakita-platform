'use strict';
const express = require('express');
const { createRun, getRun, listRuns } = require('../services/task-automation');

const ok = (res, data) => res.json({ success: true, data });
const fail = (res, status, message) => res.status(status).json({ success: false, error: message });
const router = express.Router();

router.get('/runs', (_req, res) => ok(res, listRuns()));
router.get('/runs/:id', (req, res) => { const run = getRun(req.params.id); return run ? ok(res, run) : fail(res, 404, 'Workflow tidak ditemukan.'); });
router.post('/runs', (req, res, next) => { try { return res.status(201).json({ success: true, data: createRun(req.body || {}) }); } catch (error) { if (error.statusCode) return fail(res, error.statusCode, error.message); return next(error); } });
module.exports = router;
