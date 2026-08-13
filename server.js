const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

function printStartup() {
  console.log('╔══════════════════════════════╗');
  console.log('║       💘 LOVESYNC SERVER     ║');
  console.log('╠══════════════════════════════╣');
  console.log('║ Server running successfully  ║');
  console.log('║ Port: ' + PORT + '                   ║');
  console.log('╚══════════════════════════════╝');
  console.log('');
  console.log('Open http://localhost:' + PORT + ' in your browser');
  console.log('');
}

function logSubmission(data, score) {
  const time = new Date().toLocaleTimeString();
  console.log('[' + time + '] 💘 New LoveSync test');
  console.log('');
  console.log('Person 1');
  console.log('  Name: ' + data.name1);
  console.log('  Birthday: ' + data.birthday1);
  console.log('');
  console.log('Person 2');
  console.log('  Name: ' + data.name2);
  console.log('  Birthday: ' + data.birthday2);
  console.log('');
  console.log('❤️ Compatibility: ' + score + '%');
  console.log('');
  console.log('[' + time + '] Result sent successfully.');
  console.log('');
  console.log('────────────────────────────────────');
  console.log('');
}

function calculateCompatibility(name1, name2, bday1, bday2) {
  const nums1 = bday1.replace(/-/g, '');
  const nums2 = bday2.replace(/-/g, '');

  let combined = nums1 + nums2 + name1.toLowerCase() + name2.toLowerCase();
  let sum = 0;

  for (let i = 0; i < combined.length; i++) {
    const c = combined.charCodeAt(i);
    sum += c;
  }

  let raw = sum * 3;

  if (raw % 100 === 0) {
    return 100;
  }

  let score = (raw % 96) + 5;

  return score;
}

function isValidDate(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const parts = dateStr.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  if (year < 1900 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

app.post('/api/compatibility', (req, res) => {
  const { name1, birthday1, name2, birthday2 } = req.body || {};

  if (!name1 || !name2 || !birthday1 || !birthday2) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both names and both birthdays.'
    });
  }

  if (typeof name1 !== 'string' || typeof name2 !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Names must be strings.'
    });
  }

  if (name1.trim() === '' || name2.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Names cannot be empty.'
    });
  }

  if (!isValidDate(birthday1) || !isValidDate(birthday2)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format. Please use YYYY-MM-DD.'
    });
  }

  const cleanName1 = name1.trim();
  const cleanName2 = name2.trim();

  const score = calculateCompatibility(cleanName1, cleanName2, birthday1, birthday2);

  logSubmission({
    name1: cleanName1,
    birthday1: birthday1,
    name2: cleanName2,
    birthday2: birthday2
  }, score);

  res.json({
    success: true,
    compatibility: score
  });
});

app.listen(PORT, () => {
  printStartup();
});