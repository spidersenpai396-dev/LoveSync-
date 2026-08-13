const form = document.getElementById('loveForm');
const name1Input = document.getElementById('name1');
const birthday1Input = document.getElementById('birthday1');
const name2Input = document.getElementById('name2');
const birthday2Input = document.getElementById('birthday2');
const errorMsg = document.getElementById('errorMsg');
const calcBtn = document.getElementById('calcBtn');
const loading = document.getElementById('loading');
const loadingText = document.getElementById('loadingText');
const result = document.getElementById('result');
const resultPercent = document.getElementById('resultPercent');
const resultNames = document.getElementById('resultNames');
const resultMsg = document.getElementById('resultMsg');
const againBtn = document.getElementById('againBtn');
const heartsBg = document.getElementById('heartsBg');

function createHearts() {
  const emojis = ['❤️', '💕', '💖', '💘', '💗', '💓'];
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('span');
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
    heart.style.animationDuration = (Math.random() * 10 + 8) + 's';
    heart.style.animationDelay = Math.random() * 10 + 's';
    heartsBg.appendChild(heart);
  }
}

const loadingMessages = [
  '❤️ Connecting hearts...',
  '🔮 Comparing birthdays...',
  '💫 Measuring chemistry...',
  '💕 Calculating compatibility...'
];

async function showLoading() {
  loading.style.display = 'block';
  result.style.display = 'none';
  form.style.display = 'none';

  for (let i = 0; i < loadingMessages.length; i++) {
    loadingText.textContent = loadingMessages[i];
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  loadingText.textContent = '✨ RESULT READY';
  await new Promise(resolve => setTimeout(resolve, 600));
}

function parseDate(input) {
  const months = {
    'january': 1, 'jan': 1,
    'february': 2, 'feb': 2,
    'march': 3, 'mar': 3,
    'april': 4, 'apr': 4,
    'may': 5,
    'june': 6, 'jun': 6,
    'july': 7, 'jul': 7,
    'august': 8, 'aug': 8,
    'september': 9, 'sep': 9, 'sept': 9,
    'october': 10, 'oct': 10,
    'november': 11, 'nov': 11,
    'december': 12, 'dec': 12
  };

  const isoMatch = input.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1]);
    const m = parseInt(isoMatch[2]);
    const d = parseInt(isoMatch[3]);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    }
    return null;
  }

  const match = input.match(/^(\d{1,2})\s+([a-zA-Z]+)[,\s]*(\d{4})$/);
  if (match) {
    const day = parseInt(match[1]);
    const monthName = match[2].toLowerCase();
    const year = parseInt(match[3]);
    const month = months[monthName];
    if (month && day >= 1 && day <= 31 && year >= 1900 && year <= 2100) {
      return year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    }
    return null;
  }

  const match2 = input.match(/^([a-zA-Z]+)[,\s]+(\d{1,2})[,\s]*(\d{4})$/);
  if (match2) {
    const monthName = match2[1].toLowerCase();
    const day = parseInt(match2[2]);
    const year = parseInt(match2[3]);
    const month = months[monthName];
    if (month && day >= 1 && day <= 31 && year >= 1900 && year <= 2100) {
      return year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    }
    return null;
  }

  const match3 = input.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (match3) {
    const day = parseInt(match3[1]);
    const month = parseInt(match3[2]);
    const year = parseInt(match3[3]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900 && year <= 2100) {
      return year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    }
    return null;
  }

  return null;
}

function calculateLocal(name1, name2, bday1, bday2) {
  const nums1 = bday1.replace(/-/g, '');
  const nums2 = bday2.replace(/-/g, '');

  let combined = nums1 + nums2 + name1.toLowerCase() + name2.toLowerCase();
  let sum = 0;

  for (let i = 0; i < combined.length; i++) {
    sum += combined.charCodeAt(i);
  }

  let raw = sum * 3;

  if (raw % 100 === 0) {
    return 100;
  }

  return (raw % 96) + 5;
}

function getResultMessage(score) {
  if (score === 100) {
    return '💯 PERFECT MATCH. This is destiny. 💍';
  } else if (score >= 90) {
    return '💍 Wedding when?';
  } else if (score >= 80) {
    return "Okayyy, there's definitely chemistry. 👀";
  } else if (score >= 50) {
    return 'It works. Something is cooking. 🔥';
  } else if (score >= 30) {
    return 'Yea maybe... it could work. 🤔';
  } else if (score >= 20) {
    return 'Hmm... this is a bit concerning. 😬';
  } else {
    return 'You should breakup man. 💀';
  }
}

function animatePercent(target) {
  let current = 0;
  const step = target / 60;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    resultPercent.textContent = Math.floor(current) + '%';
  }, 16);
}

function showResult(score, name1, name2) {
  loading.style.display = 'none';
  result.style.display = 'block';

  resultNames.textContent = name1 + ' ❤️ ' + name2;
  resultMsg.textContent = getResultMessage(score);

  resultPercent.textContent = '0%';
  animatePercent(score);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  errorMsg.textContent = '';

  const name1 = name1Input.value.trim();
  const birthday1 = birthday1Input.value;
  const name2 = name2Input.value.trim();
  const birthday2 = birthday2Input.value;

  if (!name1) {
    errorMsg.textContent = 'Please enter your name.';
    name1Input.focus();
    return;
  }

  if (!name2) {
    errorMsg.textContent = "Please enter your partner's name.";
    name2Input.focus();
    return;
  }

  if (!birthday1 || !birthday2) {
    errorMsg.textContent = 'Please enter both birthdays.';
    return;
  }

  const parsedBday1 = parseDate(birthday1);
  const parsedBday2 = parseDate(birthday2);

  if (!parsedBday1) {
    errorMsg.textContent = 'Please enter a valid date for your birthday (e.g. 1 June 2010).';
    birthday1Input.focus();
    return;
  }

  if (!parsedBday2) {
    errorMsg.textContent = "Please enter a valid date for your partner's birthday (e.g. 1 June 2010).";
    birthday2Input.focus();
    return;
  }

  calcBtn.disabled = true;

  try {
    await showLoading();

    let score;

    try {
      const response = await fetch('/api/compatibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name1: name1,
          birthday1: parsedBday1,
          name2: name2,
          birthday2: parsedBday2
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      score = data.compatibility;
    } catch (err) {
      score = calculateLocal(name1, name2, parsedBday1, parsedBday2);
    }

    showResult(score, name1, name2);

  } catch (err) {
    loading.style.display = 'none';
    form.style.display = 'block';
    errorMsg.textContent = err.message || 'Could not reach the server. Is it running?';
  } finally {
    calcBtn.disabled = false;
  }
});

againBtn.addEventListener('click', () => {
  result.style.display = 'none';
  form.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

createHearts();