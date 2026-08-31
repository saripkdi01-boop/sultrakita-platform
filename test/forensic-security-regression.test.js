'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const server = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');
test('conversation creation binds buyer identity to authenticated session', () => { assert.match(server, /const actorId = Number\(req\.user\.id\)/); assert.match(server, /buyer_id = \? AND seller_id/); });
test('message sender identity is never accepted from request body', () => { assert.doesNotMatch(server, /const \{ sender_id, body \} = req\.body/); assert.match(server, /INSERT INTO messages \(conversation_id, sender_id, body\).*Number\(req\.user\.id\)/); });
test('seller badge uses canonical verification_status only', () => { assert.doesNotMatch(server, /verification_status.*OR LOWER\(COALESCE\(u\.is_verified/); });
