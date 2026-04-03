const { useState, useEffect, useCallback, useRef } = React;

// ═══ CONFIG ═══
const STAGES = {
  egg: { min: 0, label: "Intern", head: 22 },
  baby: { min: 35, label: "Blogger", head: 22 },
  child: { min: 120, label: "Podcaster", head: 24 },
  teen: { min: 300, label: "Pundit", head: 26 },
  adult: { min: 600, label: "TPUSA CEO", head: 28 },
};

function stageOf(age) {
  if (age >= 600) return "adult";
  if (age >= 300) return "teen";
  if (age >= 120) return "child";
  if (age >= 35) return "baby";
  return "egg";
}

const TWEETS = [
  "Facts. Don't. Care.",
  "AMERICA FIRST! 🇺🇸",
  "Debate me, coward!",
  "Socialism DESTROYS!",
  "My face is NORMAL sized.",
  "Cope. Seethe. Repeat.",
  "Based & redpilled.",
  "Read the Constitution!",
  "Small govt, BIG energy!",
  "Liberty or DEATH!",
  "USA! USA! USA!",
  "Ratio + you're a lib",
  "The left can't meme.",
  "DESTROYED with FACTS!",
  "Curious. Very curious. 🤔",
  "Just built different 💪",
  "Another day, another lib OWNED",
  "Posting through it 🇺🇸",
  "I don't take days off",
  "Wake up. Tweet. Repeat.",
  "My mentions are a WARZONE",
  "Not reading the replies 😎",
  "Quote tweeting for FREEDOM",
  "Thread incoming... 🧵",
  "They're not sending their best tweets",
];

const DEAR_LIBS = [
  { top: "If socialism works,", mid: "why does my Kirkogotchi keep", bot: "running out of food?" },
  { top: "You claim to support", mid: "free healthcare, yet my", bot: "Kirkogotchi is SICK??" },
  { top: "If big government is great,", mid: "why can't it clean my", bot: "Kirkogotchi's poop?" },
  { top: "You say you care about the", mid: "environment but you let", bot: "my Kirkogotchi STARVE??" },
  { top: "If diversity is our strength,", mid: "why does my pet only have", bot: "ONE (tiny) face?" },
  { top: "You want free college but", mid: "can't even keep a virtual", bot: "pet alive." },
  { top: "If the economy is fine,", mid: "why is my Kirkogotchi's", bot: "clout at 0%?" },
  { top: "You say walls don't work,", mid: "but my Kirk can't escape", bot: "this screen. Curious." },
  { top: "You want universal healthcare", mid: "but you can't even keep", bot: "one pixel man ALIVE?" },
  { top: "If pronouns matter so much,", mid: "why is my Kirkogotchi's", bot: "gender just 'based'?" },
  { top: "You claim to love science,", mid: "yet you can't explain why", bot: "his face keeps SHRINKING" },
  { top: "If cancel culture isn't real,", mid: "why did my Kirkogotchi just", bot: "get RATIO'D to death?" },
];

// ═══ IDLE DIALOGUE ═══
const IDLE_DIALOGUE = {
  egg: [
    "Is this where the free pizza is?",
    "I'm just here for the resume line",
    "Who do I email about parking",
    "Unpaid but PASSIONATE",
    "I read half a Ben Shapiro book once",
    "Do I get a lanyard?",
    "My mom says I have leadership potential",
    "Is this internship... paid?",
    "I brought my own stapler",
    "Can I put this on LinkedIn?",
  ],
  baby: [
    "Just hit 200 followers. Basically famous",
    "My Substack is gonna blow up",
    "Hot take incoming...",
    "Actually, I think you'll find...",
    "Just posted a thread 🧵",
    "Ratio'd someone with 10x my followers",
    "Check my bio for the link",
    "Working on a manifesto (blog post)",
    "My open rate is INSANE",
    "Might start a newsletter idk",
  ],
  child: [
    "Welcome back to the show, folks",
    "Smash that subscribe button",
    "My guest today is... me",
    "This episode sponsored by FREEDOM",
    "Like and subscribe or you're a lib",
    "We're going LIVE in 3... 2...",
    "Drop a 🇺🇸 in the chat",
    "Don't forget to leave a 5-star review",
    "Our Patreon supporters get the REAL takes",
    "This is the episode the establishment FEARS",
  ],
  teen: [
    "Let's go to the phones",
    "BREAKING: I have an opinion",
    "Mainstream media won't cover this",
    "I've been saying this for YEARS",
    "Sources? I AM the source",
    "My ratings are through the ROOF",
    "They tried to cancel me. I got STRONGER",
    "Just got a call from a VERY important person",
    "The TRUTH cannot be silenced",
    "My haters are my biggest fans",
  ],
  adult: [
    "Livestreaming from my private jet",
    "Debate me. Anywhere. Anytime.",
    "Facts don't care about your feelings",
    "Most important election of our lifetime",
    "I built this organization from NOTHING",
    "Call me Mr. Chairman",
    "We have chapters on every campus in AMERICA",
    "Just got off the phone with... well, I can't say",
    "My schedule? 4am wake up. Tweet. Repeat.",
    "The movement is BIGGER than me now",
    "Check the merch store",
    "We're changing HEARTS and MINDS",
  ],
};

const NEGLECT_LINES = {
  hunger: [
    "You call this FREEDOM? I'm STARVING",
    "Even communists eat sometimes",
    "I'd eat a lib right now. That hungry.",
  ],
  happiness: [
    "Even Ben Shapiro texts me back faster",
    "This is what the left wants",
    "I'm not mad. I'm DISAPPOINTED.",
  ],
  energy: [
    "Haven't slept since the Obama administration",
    "Running on pure ideology at this point",
    "Low energy! Sad!",
  ],
  clout: [
    "I'm being CENSORED",
    "Big Tech is suppressing my reach",
    "Shadow banned AGAIN",
  ],
  multi: [
    "This is literally 1984",
    "You're worse than socialism",
    "I didn't die for THIS... wait",
  ],
};

const TAP_REACTIONS = [
  "Hey! Personal space!",
  "Do NOT boop me.",
  "I'm trying to WORK here",
  "Curious. You tapped me. 🤔",
  "Stop that! I'm on camera!",
  "That tickles... STOP.",
  "My face is up here. (It's small.)",
  "I will tweet about this.",
  "You just poked a PATRIOT",
  "Heh. Do it again.",
  "*adjusts tie*",
  "I'm not a touchscreen! Oh wait.",
  "Based tap.",
  "That's harassment. (I liked it.)",
  "You call that a tap? LOW ENERGY.",
];

const TAP_REACTIONS_GIRL = [
  "Excuse me??",
  "Don't tap the Kirkie!",
  "I'm posting about this.",
  "Rude but also funny",
  "*hair flip*",
  "My husband will hear about this",
  "I have a PODCAST you know",
  "Based tap, I guess",
  "That's not very patriotic of you",
  "Do I look like a button to you?",
];

const MEMORIAL_QUOTES = [
  "He tweeted so we didn't have to.",
  '"His face was the perfect size." — God',
  '"Rest now, brother. We have the watch." — Kash Patel',
  "He owned every lib. Every. Single. One.",
  "Valhalla just got a LOT more based.",
  "The ratio... is finally 1:1.",
  "Gone but never unsubscribed.",
  "He died doing what he loved: having an opinion.",
  "Pour one out. (Diet Coke, obviously.)",
  "His face may have been small, but his impact was huge.",
];

// ═══ ACHIEVEMENTS ═══
const ACHIEVEMENTS = [
  { id: "first_feed", icon: "🍔", title: "FIRST HAMBERDER", desc: "Fed your Kirkie for the first time", check: (s) => s.feeds >= 1 },
  { id: "first_tweet", icon: "📱", title: "FIRST TWEET", desc: "Sent your first tweet", check: (s) => s.tweets >= 1 },
  { id: "tweet10", icon: "🐦", title: "TWITTER FINGERS", desc: "Sent 10 tweets", check: (s) => s.tweets >= 10 },
  { id: "tweet50", icon: "📣", title: "INFLUENCER", desc: "Sent 50 tweets", check: (s) => s.tweets >= 50 },
  { id: "own5", icon: "💥", title: "SERIAL OWNER", desc: "Owned 5 libs", check: (s) => s.libsOwned >= 5 },
  { id: "own25", icon: "🔥", title: "LIB DESTROYER", desc: "Owned 25 libs", check: (s) => s.libsOwned >= 25 },
  { id: "own100", icon: "☠️", title: "EXTINCTION EVENT", desc: "Owned 100 libs", check: (s) => s.libsOwned >= 100 },
  { id: "debate_flawless", icon: "🏆", title: "FLAWLESS VICTORY", desc: "Won a debate with 0 misses", check: (s) => s.flawlessDebates >= 1 },
  { id: "survive5", icon: "⏰", title: "5 MINUTE MAN", desc: "Kirkie survived 5 minutes", check: (s) => s.maxAge >= 300 },
  { id: "survive10", icon: "🕐", title: "TENACIOUS", desc: "Kirkie survived 10 minutes", check: (s) => s.maxAge >= 600 },
  { id: "survive30", icon: "🏅", title: "ENDURANCE", desc: "Kirkie survived 30 minutes", check: (s) => s.maxAge >= 1800 },
  { id: "blogger", icon: "📝", title: "PROMOTED: BLOGGER", desc: "Reached Blogger stage", check: (s) => s.maxStage >= 1 },
  { id: "podcaster", icon: "🎙️", title: "PROMOTED: PODCASTER", desc: "Reached Podcaster stage", check: (s) => s.maxStage >= 2 },
  { id: "pundit", icon: "📺", title: "PROMOTED: PUNDIT", desc: "Reached Pundit stage", check: (s) => s.maxStage >= 3 },
  { id: "ceo", icon: "👑", title: "TPUSA CEO", desc: "Reached the final stage", check: (s) => s.maxStage >= 4 },
  { id: "kirkify5", icon: "👤", title: "KIRKIFIED", desc: "Used Kirkify 5 times", check: (s) => s.kirkifies >= 5 },
  { id: "clean10", icon: "🧹", title: "JANITOR", desc: "Cleaned 10 poops", check: (s) => s.cleans >= 10 },
  { id: "streak3", icon: "🔥", title: "3 DAY STREAK", desc: "Played 3 days in a row", check: (s) => s.streak >= 3 },
  { id: "streak7", icon: "💎", title: "WEEKLY WARRIOR", desc: "7 day streak", check: (s) => s.streak >= 7 },
  { id: "deaths3", icon: "💀", title: "VALHALLA FREQUENT FLYER", desc: "Lost 3 Kirkies", check: (s) => s.deaths >= 3 },
];

const STAGE_NUM = { egg: 0, baby: 1, child: 2, teen: 3, adult: 4 };

// ═══ DAILY STREAK ═══
function checkStreak() {
  const data = storage.get("kirk_streak") || { last: null, count: 0 };
  const today = new Date().toISOString().slice(0, 10);
  if (data.last === today) return data; // Already checked in today
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (data.last === yesterday) {
    data.count++;
  } else if (data.last !== today) {
    data.count = 1; // Streak broken
  }
  data.last = today;
  storage.set("kirk_streak", data);
  return data;
}

// ═══ SHARE HELPERS ═══
const SITE_URL = "https://jackdengler.github.io/kirk-bot/";

function shareToX(text, url) {
  const encoded = encodeURIComponent(text + "\n\n" + (url || SITE_URL));
  window.open("https://x.com/intent/tweet?text=" + encoded, "_blank", "width=550,height=420");
}

function shareNative(title, text, url) {
  if (navigator.share) {
    navigator.share({ title, text, url: url || SITE_URL });
  } else {
    navigator.clipboard.writeText((url || SITE_URL)).then(() => alert("Link copied!"));
  }
}

// ═══ KIRK QUOTES ═══
const KIRK_QUOTES = [
  { quote: "You claim to love freedom, yet you sleep 8 hours a day. Curious.", attr: "Charlie Kirk, probably" },
  { quote: "Socialism is when the government does stuff I don't like.", attr: "Turning Point USA" },
  { quote: "My face is exactly the right size for my head.", attr: "Charlie Kirk, 2024" },
  { quote: "I didn't go to college and I turned out fine. You're welcome.", attr: "Charlie Kirk" },
  { quote: "If healthcare is a right, why does my Kirkogotchi keep dying?", attr: "Turning Point Kirkogotchi" },
  { quote: "Every morning I wake up and choose facts.", attr: "Charlie Kirk" },
  { quote: "They tried to cancel me. I became uncancellable.", attr: "Charlie Kirk, from Valhalla" },
  { quote: "The Constitution doesn't say anything about bedtimes.", attr: "Charlie Kirk, age 8" },
  { quote: "If capitalism is so bad, why does my Kirkogotchi have a job?", attr: "Turning Point USA" },
  { quote: "I'm not owned. I'm not owned. I'm not owned.", attr: "Charlie Kirk, being owned" },
  { quote: "Debate me, coward. I'll wait. (I won't wait.)", attr: "Charlie Kirk" },
  { quote: "My haters are just fans who haven't accepted it yet.", attr: "Charlie Kirk" },
  { quote: "Liberty. Freedom. Hamberders.", attr: "The Kirk Doctrine" },
  { quote: "Libs say my face is small. My impact says otherwise.", attr: "Charlie Kirk" },
  { quote: "We are ALL Charlie Kirk on this blessed day.", attr: "We Are Charlie Kirk" },
  { quote: "Ratio + you fell off + I'm in Valhalla + L + cope", attr: "Charlie Kirk's ghost" },
];

// ═══ AUDIO ═══
let _ctx = null;
function getCtx() {
  if (!_ctx) {
    try { _ctx = new AudioContext(); } catch (e) { /* no audio */ }
  }
  return _ctx;
}

let _muted = false;
function setGlobalMute(m) { _muted = m; storage.set("kirk_muted", m); }

function tone(freq, dur, vol, type) {
  if (_muted) return;
  const c = getCtx();
  if (!c) return;
  try {
    if (c.state === "suspended") c.resume();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || "square";
    o.frequency.value = freq;
    g.gain.value = vol || 0.06;
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + (dur || 0.06));
    o.connect(g).connect(c.destination);
    o.start();
    o.stop(c.currentTime + (dur || 0.06));
  } catch (e) { /* silent */ }
}

function sfxFeed() { tone(330, 0.05); setTimeout(() => tone(440, 0.05), 60); setTimeout(() => tone(550, 0.07), 120); }
function sfxTweet() { tone(880, 0.03, 0.04); setTimeout(() => tone(1100, 0.03, 0.04), 40); setTimeout(() => tone(1320, 0.05, 0.04), 80); }
function sfxOwn() { tone(220, 0.06, 0.05); setTimeout(() => tone(440, 0.06, 0.05), 80); setTimeout(() => tone(880, 0.1, 0.07), 160); }
function sfxClean() { tone(660, 0.03); setTimeout(() => tone(880, 0.03), 40); setTimeout(() => tone(1100, 0.04), 80); }
function sfxKirkify() { [0, 60, 120, 180].forEach((t, i) => setTimeout(() => tone(i % 2 ? 880 : 440, 0.04), t)); }
function sfxEvolve() { [0, 100, 200, 300].forEach((t, i) => setTimeout(() => tone(523 * (1 + i * 0.25), 0.08, 0.06), t)); }
function sfxDie() { tone(200, 0.3, 0.08, "sawtooth"); setTimeout(() => tone(120, 0.4, 0.06, "sawtooth"), 300); }
function sfxHatch() { [0, 80, 160, 240].forEach((t, i) => setTimeout(() => tone(440 * (1 + i * 0.2), 0.07), t)); }
function sfxTap() { tone(800, 0.02, 0.03); }
function sfxCatch() { tone(1200, 0.03, 0.04); }
function sfxLight() { tone(180, 0.12, 0.04, "triangle"); }
function sfxDebateHit() { tone(600, 0.04, 0.05); setTimeout(() => tone(900, 0.03, 0.04), 50); }
function sfxAchievement() {
  // Triumphant 4-note arpeggio
  [0, 80, 160, 280].forEach((t, i) => setTimeout(() => tone([523, 659, 784, 1047][i], 0.12, 0.05, "triangle"), t));
}
function sfxEvolveFanfare() {
  // Majestic ascending fanfare
  const notes = [392, 440, 523, 587, 659, 784];
  notes.forEach((f, i) => setTimeout(() => tone(f, 0.15, 0.06, "triangle"), i * 100));
  // Triumphant chord at end
  setTimeout(() => { tone(523, 0.4, 0.04, "triangle"); tone(659, 0.4, 0.04, "triangle"); tone(784, 0.4, 0.04, "triangle"); }, 700);
}
function sfxStreakBonus() { tone(440, 0.08, 0.04, "triangle"); setTimeout(() => tone(660, 0.1, 0.05, "triangle"), 100); }

// "We Are Charlie Kirk" chiptune — simplified 8-bit melody
let _memorial = null;
function playWeAreCharlieKirk() {
  const c = getCtx();
  if (!c) return;
  try { if (c.state === "suspended") c.resume(); } catch(e) { return; }
  if (_memorial) { try { _memorial.stop(); } catch(e) {} }

  // Earnest anthem melody — cheesy inspirational, like the actual song
  const notes = [
    // "We are..." rising
    [261, 0.3], [329, 0.3], [392, 0.6],
    // "Charlie Kirk" — big interval jump
    [523, 0.4], [466, 0.2], [440, 0.6],
    // Descending emotional bit
    [392, 0.3], [349, 0.3], [329, 0.6],
    // Resolution — hopeful
    [293, 0.3], [329, 0.3], [392, 0.4], [349, 0.2],
    // Final hold
    [329, 0.3], [293, 0.3], [261, 1.0],
    // Rest
    [0, 0.5],
  ];

  let t = c.currentTime + 0.3;
  const gain = c.createGain();
  gain.gain.value = 0.04;
  gain.connect(c.destination);

  // Bass notes (root notes, lower octave)
  const bass = [
    [130, 1.2], [110, 1.2], [98, 1.2], [110, 0.8], [130, 0.8], [130, 1.5], [0, 0.5],
  ];

  notes.forEach(([freq, dur]) => {
    if (freq > 0) {
      const osc = c.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const noteGain = c.createGain();
      noteGain.gain.setValueAtTime(0.05, t);
      noteGain.gain.exponentialRampToValueAtTime(0.001, t + dur - 0.05);
      osc.connect(noteGain).connect(c.destination);
      osc.start(t);
      osc.stop(t + dur);
    }
    t += dur;
  });

  // Play bass
  let bt = c.currentTime + 0.3;
  bass.forEach(([freq, dur]) => {
    if (freq > 0) {
      const osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const noteGain = c.createGain();
      noteGain.gain.setValueAtTime(0.03, bt);
      noteGain.gain.exponentialRampToValueAtTime(0.001, bt + dur - 0.05);
      osc.connect(noteGain).connect(c.destination);
      osc.start(bt);
      osc.stop(bt + dur);
    }
    bt += dur;
  });

  // Loop it
  const totalDur = notes.reduce((a, [, d]) => a + d, 0);
  _memorial = { stop: () => {} };
  const loopId = setTimeout(() => playWeAreCharlieKirk(), (totalDur + 0.5) * 1000);
  _memorial = { stop: () => clearTimeout(loopId) };
}

function stopMemorialMusic() {
  if (_memorial) { try { _memorial.stop(); } catch(e) {} _memorial = null; }
}

// ═══ STORAGE (localStorage) ═══
const storage = {
  get(key) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch(e) { return null; } },
  set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {} },
  del(key) { try { localStorage.removeItem(key); } catch(e) {} },
};

// ═══ KIRK IDLE BEHAVIORS ═══
function getIdlePose(frame, mood, energy) {
  const t = (frame || 0);
  // Head tilt — slight rotation oscillation
  const tilt = Math.sin(t * 0.15) * 1.5;
  // Eye wander — look left/right occasionally
  const eyeX = Math.sin(t * 0.2) * 1.2;
  // Yawn when low energy
  const yawning = energy !== undefined && energy < 20 && t % 40 > 35;
  // Shiver when hungry (passed as prop)
  return { tilt, eyeX, yawning };
}

// ═══ KIRK FACE ═══
function Kirk({ stage, mood, faceSize, frame, dark, scale, gender, blink, energy, hunger }) {
  const s = scale || 1;
  const isGirl = gender === "girl";
  const skin = dark ? "#9a8a70" : "#f4d0a8";
  const skinSh = dark ? "#7a6a50" : "#e8b888";
  const hair = dark ? (isGirl ? "#1a0e14" : "#1a0e04") : (isGirl ? "#5a2a18" : "#3d1f08");
  const outline = dark ? "#1a2a45" : "#14325a";
  const blush = dark ? "#a07060" : "#f0a8a0";
  const suitC = dark ? "#0a1830" : (isGirl ? "#8b1545" : "#1a3a6a");
  const shirtC = dark ? "#888" : "#f0f0f0";
  const lipColor = isGirl ? "#c06068" : "#c06058";
  const gumColor = "#e89090";

  const hr = (STAGES[stage] || STAGES.baby).head;
  const R = hr * s;
  const fs = Math.max(0.2, Math.min(1.6, faceSize || 1));

  // Idle micro-behaviors
  const idle = getIdlePose(frame, mood, energy);
  const breathe = Math.sin((frame || 0) * 0.8) * 0.4 * s;
  const bob = [0, -0.5, -1, -0.5][(frame || 0) % 4] * s + breathe;
  // Shiver when very hungry
  const shiver = hunger !== undefined && hunger < 15 ? (frame % 2 === 0 ? 0.5 : -0.5) * s : 0;

  const isEgg = stage === "egg";
  const isDead = mood === "dead";
  const isSleep = mood === "sleep";
  const hasSuit = stage === "teen" || stage === "adult";
  const isBlinking = blink;

  return (
    <g transform={"translate(" + shiver + "," + bob + ") rotate(" + (isDead || isSleep ? 0 : idle.tilt) + ")"}>
      {isDead && (
        <g>
          <ellipse cx={0} cy={-R - 5 * s} rx={11 * s} ry={3 * s} fill="none" stroke="#c8a82880" strokeWidth={1.5 * s} strokeDasharray={(3 * s) + " " + (2 * s)}>
            <animate attributeName="stroke-opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <path d={"M " + (-(R + 2)) + " " + (-2 * s) + " C " + (-(R + 20 * s)) + " " + (-18 * s) + " " + (-(R + 16 * s)) + " " + (8 * s) + " " + (-(R + 4)) + " " + (4 * s)} fill="none" stroke="#c8a82844" strokeWidth={1.5 * s} />
          <path d={"M " + (R + 2) + " " + (-2 * s) + " C " + (R + 20 * s) + " " + (-18 * s) + " " + (R + 16 * s) + " " + (8 * s) + " " + (R + 4) + " " + (4 * s)} fill="none" stroke="#c8a82844" strokeWidth={1.5 * s} />
        </g>
      )}

      {!isEgg && !isDead && hasSuit && (
        <g>
          <path d={"M " + (-9 * s) + " " + (R - 2 * s) + " C " + (-14 * s) + " " + (R + 4 * s) + " " + (-18 * s) + " " + (R + 22 * s) + " " + (-16 * s) + " " + (R + 22 * s) + " L " + (16 * s) + " " + (R + 22 * s) + " C " + (18 * s) + " " + (R + 22 * s) + " " + (14 * s) + " " + (R + 4 * s) + " " + (9 * s) + " " + (R - 2 * s) + " Z"} fill={suitC} />
          <path d={"M " + (-3 * s) + " " + R + " L " + (-2.5 * s) + " " + (R + 20 * s) + " L " + (2.5 * s) + " " + (R + 20 * s) + " L " + (3 * s) + " " + R + " Z"} fill={shirtC} />
          <path d={"M 0 " + (R + s) + " L " + (-2 * s) + " " + (R + 5 * s) + " L 0 " + (R + 18 * s) + " L " + (2 * s) + " " + (R + 5 * s) + " Z"} fill="#c41e3a" />
          {stage === "adult" && <circle cx={-7 * s} cy={R + 5 * s} r={1.8 * s} fill="#c41e3a" opacity={0.8} />}
        </g>
      )}

      {!isEgg && !isDead && !hasSuit && (
        <g>
          <line x1={-6 * s} y1={R + s} x2={-9 * s} y2={R + 16 * s} stroke={outline} strokeWidth={2 * s} strokeLinecap="round" />
          <line x1={6 * s} y1={R + s} x2={9 * s} y2={R + 16 * s} stroke={outline} strokeWidth={2 * s} strokeLinecap="round" />
        </g>
      )}

      {isEgg ? (
        <g>
          <ellipse cx={0} cy={s} rx={R * 0.82} ry={R * 0.98} fill={skin} stroke={outline} strokeWidth={1.8 * s} />
          <g transform={"scale(" + (fs * 0.7) + ")"}>
            <circle cx={-3.5 * s} cy={-1 * s} r={1.5 * s} fill={outline} />
            <circle cx={3.5 * s} cy={-1 * s} r={1.5 * s} fill={outline} />
          </g>
        </g>
      ) : (
        <g>
          {!isDead && <ellipse cx={0} cy={-R * 0.32} rx={R * 1.06} ry={R * 0.72} fill={hair} />}
          {!isDead && !isGirl && (
            <path d={"M " + (-R * 0.65) + " " + (-R * 0.82) + " Q " + (-R * 1.15) + " " + (-R * 1.45) + " " + (-R * 0.15) + " " + (-R * 1.02) + " Q " + (-R * 0.55) + " " + (-R * 1.3) + " " + (-R * 0.75) + " " + (-R * 0.88)} fill={hair} />
          )}
          {/* Girl: longer hair flowing down + bow */}
          {!isDead && isGirl && (
            <g>
              <path d={"M " + (-R * 0.65) + " " + (-R * 0.82) + " Q " + (-R * 1.15) + " " + (-R * 1.35) + " " + (-R * 0.15) + " " + (-R * 1.02) + " Q " + (-R * 0.55) + " " + (-R * 1.2) + " " + (-R * 0.75) + " " + (-R * 0.88)} fill={hair} />
              {/* Long hair sides */}
              <path d={"M " + (-R * 0.95) + " " + (-R * 0.2) + " Q " + (-R * 1.3) + " " + (R * 0.5) + " " + (-R * 1.1) + " " + (R * 1.2)} fill={hair} stroke={hair} strokeWidth={3 * s} strokeLinecap="round" />
              <path d={"M " + (R * 0.95) + " " + (-R * 0.2) + " Q " + (R * 1.3) + " " + (R * 0.5) + " " + (R * 1.1) + " " + (R * 1.2)} fill={hair} stroke={hair} strokeWidth={3 * s} strokeLinecap="round" />
              {/* Bow */}
              <g transform={"translate(" + (R * 0.6) + "," + (-R * 0.85) + ")"}>
                <path d={"M 0 0 Q " + (3 * s) + " " + (-3 * s) + " " + (5 * s) + " 0 Q " + (3 * s) + " " + (3 * s) + " 0 0"} fill="#ff69b4" />
                <path d={"M 0 0 Q " + (-3 * s) + " " + (-3 * s) + " " + (-5 * s) + " 0 Q " + (-3 * s) + " " + (3 * s) + " 0 0"} fill="#ff69b4" />
                <circle r={1.2 * s} fill="#c41e6a" />
              </g>
            </g>
          )}
          {!isDead && (
            <g>
              <ellipse cx={-R + s} cy={s} rx={3.5 * s} ry={5 * s} fill={skin} stroke={outline} strokeWidth={0.8 * s} />
              <ellipse cx={R - s} cy={s} rx={3.5 * s} ry={5 * s} fill={skin} stroke={outline} strokeWidth={0.8 * s} />
            </g>
          )}
          <circle cx={0} cy={0} r={R} fill={isDead ? "none" : skin} stroke={outline} strokeWidth={1.6 * s} />

          <g transform={"scale(" + fs + ")"}>
            {isSleep ? (
              <g>
                <path d={"M " + (-8 * s) + " " + (-4 * s) + " Q " + (-5 * s) + " " + (-2 * s) + " " + (-2 * s) + " " + (-4 * s)} fill="none" stroke={outline} strokeWidth={1.8 * s} strokeLinecap="round" />
                <path d={"M " + (2 * s) + " " + (-4 * s) + " Q " + (5 * s) + " " + (-2 * s) + " " + (8 * s) + " " + (-4 * s)} fill="none" stroke={outline} strokeWidth={1.8 * s} strokeLinecap="round" />
                <ellipse cx={-7 * s} cy={2 * s} rx={3 * s} ry={1.5 * s} fill={blush} opacity={0.3} />
                <ellipse cx={7 * s} cy={2 * s} rx={3 * s} ry={1.5 * s} fill={blush} opacity={0.3} />
              </g>
            ) : isDead ? (
              <g>
                <line x1={-7 * s} y1={-6 * s} x2={-3 * s} y2={-2 * s} stroke={outline} strokeWidth={1.5 * s} strokeLinecap="round" />
                <line x1={-3 * s} y1={-6 * s} x2={-7 * s} y2={-2 * s} stroke={outline} strokeWidth={1.5 * s} strokeLinecap="round" />
                <line x1={3 * s} y1={-6 * s} x2={7 * s} y2={-2 * s} stroke={outline} strokeWidth={1.5 * s} strokeLinecap="round" />
                <line x1={7 * s} y1={-6 * s} x2={3 * s} y2={-2 * s} stroke={outline} strokeWidth={1.5 * s} strokeLinecap="round" />
                <path d={"M " + (-4 * s) + " " + (5 * s) + " Q 0 " + (3 * s) + " " + (4 * s) + " " + (5 * s)} fill="none" stroke={outline} strokeWidth={1.2 * s} />
              </g>
            ) : (
              <g>
                {/* Eyes — with blink */}
                {isBlinking || idle.yawning ? (
                  <g>
                    <line x1={-7 * s} y1={-4 * s} x2={-3 * s} y2={-4 * s} stroke={outline} strokeWidth={1.5 * s} strokeLinecap="round" />
                    <line x1={3 * s} y1={-4 * s} x2={7 * s} y2={-4 * s} stroke={outline} strokeWidth={1.5 * s} strokeLinecap="round" />
                  </g>
                ) : (
                  <g>
                    {/* Eyes with idle wander */}
                    <ellipse cx={(-5 + idle.eyeX) * s} cy={-4 * s} rx={2.2 * s} ry={2.2 * s} fill={outline} />
                    <ellipse cx={(5 + idle.eyeX) * s} cy={-4 * s} rx={2.2 * s} ry={2.2 * s} fill={outline} />
                    <circle cx={(-4 + idle.eyeX) * s} cy={-5 * s} r={0.8 * s} fill="#fff" opacity={0.6} />
                    <circle cx={(6 + idle.eyeX) * s} cy={-5 * s} r={0.8 * s} fill="#fff" opacity={0.6} />
                  </g>
                )}
                {/* Eyelashes for girl */}
                {isGirl && !isBlinking && (
                  <g>
                    <line x1={-7.5 * s} y1={-5.5 * s} x2={-8.5 * s} y2={-7 * s} stroke={outline} strokeWidth={0.8 * s} strokeLinecap="round" />
                    <line x1={-5 * s} y1={-6.5 * s} x2={-5 * s} y2={-8 * s} stroke={outline} strokeWidth={0.8 * s} strokeLinecap="round" />
                    <line x1={7.5 * s} y1={-5.5 * s} x2={8.5 * s} y2={-7 * s} stroke={outline} strokeWidth={0.8 * s} strokeLinecap="round" />
                    <line x1={5 * s} y1={-6.5 * s} x2={5 * s} y2={-8 * s} stroke={outline} strokeWidth={0.8 * s} strokeLinecap="round" />
                  </g>
                )}
                <ellipse cx={0} cy={0} rx={1.2 * s} ry={1.8 * s} fill={skinSh} opacity={0.2} />
                {idle.yawning ? (
                  <g>
                    {/* Yawn — big round open mouth */}
                    <ellipse cx={0} cy={5 * s} rx={3.5 * s} ry={4 * s} fill="#8a4040" stroke={outline} strokeWidth={0.5 * s} />
                    <ellipse cx={0} cy={3.5 * s} rx={3 * s} ry={1.5 * s} fill={gumColor} />
                    <rect x={-2 * s} y={2.5 * s} width={1.3 * s} height={1.5 * s} rx={0.3 * s} fill="#fff" />
                    <rect x={0.7 * s} y={2.5 * s} width={1.3 * s} height={1.5 * s} rx={0.3 * s} fill="#fff" />
                  </g>
                ) : mood === "happy" ? (
                  <g>
                    {/* GUMMY SMILE — big open mouth with teeth and gums */}
                    <path d={"M " + (-6 * s) + " " + (3 * s) + " Q 0 " + (12 * s) + " " + (6 * s) + " " + (3 * s)} fill={lipColor} stroke={outline} strokeWidth={0.6 * s} />
                    {/* Gums — pink strip at top of mouth */}
                    <path d={"M " + (-5 * s) + " " + (4.5 * s) + " Q 0 " + (3.5 * s) + " " + (5 * s) + " " + (4.5 * s)} fill={gumColor} />
                    {/* Teeth — white rectangles */}
                    <rect x={-4 * s} y={4 * s} width={1.8 * s} height={2 * s} rx={0.3 * s} fill="#fff" />
                    <rect x={-1.8 * s} y={3.8 * s} width={1.8 * s} height={2.2 * s} rx={0.3 * s} fill="#fff" />
                    <rect x={0.3 * s} y={3.8 * s} width={1.8 * s} height={2.2 * s} rx={0.3 * s} fill="#fff" />
                    <rect x={2.5 * s} y={4 * s} width={1.8 * s} height={2 * s} rx={0.3 * s} fill="#fff" />
                    {/* Tongue hint */}
                    <ellipse cx={0} cy={8 * s} rx={2.5 * s} ry={1.5 * s} fill="#d06060" opacity={0.6} />
                  </g>
                ) : mood === "sad" ? (
                  <path d={"M " + (-4 * s) + " " + (7 * s) + " Q 0 " + (3 * s) + " " + (4 * s) + " " + (7 * s)} fill="none" stroke={outline} strokeWidth={1.2 * s} strokeLinecap="round" />
                ) : mood === "angry" ? (
                  <g>
                    <line x1={-8 * s} y1={-8.5 * s} x2={-2 * s} y2={-6.5 * s} stroke={outline} strokeWidth={1.5 * s} strokeLinecap="round" />
                    <line x1={8 * s} y1={-8.5 * s} x2={2 * s} y2={-6.5 * s} stroke={outline} strokeWidth={1.5 * s} strokeLinecap="round" />
                    {/* Angry gummy smile */}
                    <path d={"M " + (-5 * s) + " " + (3.5 * s) + " Q 0 " + (10 * s) + " " + (5 * s) + " " + (3.5 * s)} fill={lipColor} stroke={outline} strokeWidth={0.6 * s} />
                    <rect x={-3.5 * s} y={4 * s} width={1.6 * s} height={1.8 * s} rx={0.3 * s} fill="#fff" />
                    <rect x={-1 * s} y={3.8 * s} width={1.6 * s} height={2 * s} rx={0.3 * s} fill="#fff" />
                    <rect x={1.5 * s} y={4 * s} width={1.6 * s} height={1.8 * s} rx={0.3 * s} fill="#fff" />
                  </g>
                ) : (
                  <line x1={-3 * s} y1={5 * s} x2={3 * s} y2={5 * s} stroke={outline} strokeWidth={1.2 * s} strokeLinecap="round" />
                )}
                {(mood === "happy" || mood === "angry") && (
                  <g>
                    <ellipse cx={-8 * s} cy={2 * s} rx={3 * s} ry={1.5 * s} fill={blush} opacity={0.25} />
                    <ellipse cx={8 * s} cy={2 * s} rx={3 * s} ry={1.5 * s} fill={blush} opacity={0.25} />
                  </g>
                )}
              </g>
            )}
          </g>
        </g>
      )}
    </g>
  );
}

// ═══ STAT BAR ═══
function Bar({ icon, value, color, warn }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
      <span style={{ fontSize: 11, animation: warn ? "pulse 0.6s infinite" : "none", transition: "transform 0.3s" }}>{icon}</span>
      <div style={{ flex: 1, height: 9, background: "#1a3a6a15", borderRadius: 5, overflow: "hidden", position: "relative" }}>
        <div style={{
          height: "100%",
          width: Math.max(0, value) + "%",
          background: value < 20
            ? "linear-gradient(90deg, #ef4444, #dc2626)"
            : "linear-gradient(90deg, " + color + "cc, " + color + ")",
          borderRadius: 5,
          transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: value < 20 ? "0 0 8px #ef444466, inset 0 1px 1px #fff3" : "inset 0 1px 1px #fff2",
        }} />
        {/* Shine overlay */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "40%",
          background: "linear-gradient(180deg, #fff2, transparent)",
          borderRadius: "5px 5px 0 0",
          pointerEvents: "none",
        }} />
      </div>
      <span style={{ fontSize: 6, fontFamily: "'Press Start 2P',monospace", color: "#fff6", minWidth: 18, textAlign: "right" }}>{Math.round(value)}</span>
    </div>
  );
}

// ═══ ACTION BUTTON ═══
function ABtn({ label, emoji, bg, onClick, off, sm }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={off}
      onPointerDown={e => { if (!off) { setPressed(true); e.currentTarget.style.transform = "scale(0.85)"; } }}
      onPointerUp={e => { setPressed(false); e.currentTarget.style.transform = "scale(1)"; }}
      onPointerLeave={e => { setPressed(false); e.currentTarget.style.transform = "scale(1)"; }}
      style={{
        width: sm ? 36 : 46, height: sm ? 36 : 46, borderRadius: "50%",
        background: pressed
          ? "radial-gradient(circle at 50% 50%, " + bg + "ff, " + bg + "aa 60%, #222)"
          : "radial-gradient(circle at 38% 28%, " + bg + "ee, " + bg + "88 65%, #111)",
        border: "2px solid #0004",
        boxShadow: pressed
          ? "0 1px 4px #0004, inset 0 2px 4px #0003"
          : "0 4px 12px #0005, inset 0 1px 2px #fff2",
        cursor: off ? "not-allowed" : "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0,
        opacity: off ? 0.25 : 1,
        transition: "transform 0.08s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.1s, opacity 0.2s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {emoji ? <span style={{ fontSize: sm ? 13 : 15, lineHeight: 1, filter: off ? "grayscale(1)" : "none" }}>{emoji}</span> : null}
      <span style={{ fontSize: sm ? 5 : 6.5, fontFamily: "'Bangers',cursive", color: "#fff", textShadow: "0 1px 3px #000a", letterSpacing: 0.5 }}>{label}</span>
    </button>
  );
}

// ═══ DEAR LIBERALS MEME ═══
function DearLib({ data, fs }) {
  return (
    <div style={{ background: "#0d2240", borderRadius: 8, overflow: "hidden" }}>
      <svg viewBox="0 0 200 134" style={{ display: "block", width: "100%" }}>
        <rect width="200" height="134" fill="#0d2240" />
        <rect x="8" y="6" width="184" height="94" rx="4" fill="#fff" />
        <rect x="8" y="6" width="184" height="20" rx="4" fill="#c41e3a" />
        <rect x="8" y="16" width="184" height="10" fill="#c41e3a" />
        <text x="100" y="20" fontSize="8" fontFamily="'Bangers',cursive" fill="#fff" textAnchor="middle" letterSpacing="2">Dear Liberals,</text>
        <text x="100" y="44" fontSize="5.5" fontFamily="'Press Start 2P',monospace" fill="#1a3a6a" textAnchor="middle">{data.top}</text>
        <text x="100" y="58" fontSize="5.5" fontFamily="'Press Start 2P',monospace" fill="#1a3a6a" textAnchor="middle">{data.mid}</text>
        <text x="100" y="72" fontSize="5.5" fontFamily="'Press Start 2P',monospace" fill="#1a3a6a" textAnchor="middle" fontWeight="bold">{data.bot}</text>
        <g transform="translate(166, 82)">
          <Kirk stage="adult" mood="angry" faceSize={fs} scale={0.28} frame={0} />
        </g>
        <text x="20" y="93" fontSize="6" fontFamily="'Bangers',cursive" fill="#c41e3a" letterSpacing="1">Curious. 🤔</text>
        <rect x="0" y="104" width="200" height="30" fill="#0a1a35" />
        <text x="100" y="116" fontSize="4" fontFamily="'Press Start 2P',monospace" fill="#fff5" textAnchor="middle">TURNING POINT KIRKOGOTCHI</text>
        <text x="100" y="128" fontSize="5" fontFamily="'Bangers',cursive" fill="#c41e3a" textAnchor="middle" letterSpacing="4">★  ★  ★</text>
      </svg>
    </div>
  );
}

// ═══ MINI GAME: DEBATE ME COWARD ═══
const DEBATE_ARGS = [
  "healthcare?", "climate!", "pronouns!", "tax the rich", "actually...",
  "source?", "cope", "ratio", "free college", "inequality!",
  "empathy!", "science!", "diversity!", "workers rights", "regulate!",
  "fact check!", "nuance!", "context!", "privilege!", "universal basic",
  "peer reviewed", "systemic!", "intersect!", "solidarity!", "mutual aid",
  "read theory", "late stage", "living wage", "eat the rich", "praxis!",
  "rent control", "unions!", "abolish!", "defund!", "redistribute",
  "ACAB!", "gentrified", "billionaires", "boot licker", "comrade!",
];

function DebateGame({ onDone, name, faceSize, gender }) {
  const [bubbles, setBubbles] = useState([]);
  const [sc, setSc] = useState(0);
  const [misses, setMisses] = useState(0);
  const [t, setT] = useState(15);
  const [fx, setFx] = useState([]);
  const [shakeKirk, setShakeKirk] = useState(false);
  const [hitFlash, setHitFlash] = useState(false);
  const fc = useRef(0);
  const done = useRef(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setT(p => { if (p <= 1) { clearInterval(iv); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (t === 0 && !done.current) {
      done.current = true;
      setTimeout(() => onDone(sc, misses), 800);
    }
  }, [t, sc, misses, onDone]);

  useEffect(() => {
    const iv = setInterval(() => {
      fc.current++;
      // Spawn bubbles — smooth difficulty ramp
      const elapsed = 15 - t;
      const spawnRate = Math.max(2, 7 - Math.floor(elapsed / 3));
      if (fc.current % spawnRate === 0) {
        const arg = DEBATE_ARGS[Math.floor(Math.random() * DEBATE_ARGS.length)];
        setBubbles(p => [...p, {
          id: Math.random(),
          x: 198,
          y: 28 + Math.random() * 75,
          text: arg,
          speed: 1.2 + Math.random() * 1.2 + elapsed * 0.12,
        }]);
      }
      // Move bubbles
      setBubbles(p => {
        const next = [];
        p.forEach(b => {
          const nb = { ...b, x: b.x - b.speed };
          if (nb.x < 25) {
            // Hit Kirk!
            setMisses(m => m + 1);
            setShakeKirk(true);
            setHitFlash(true);
            setTimeout(() => { setShakeKirk(false); setHitFlash(false); }, 150);
          } else {
            next.push(nb);
          }
        });
        return next;
      });
      // Decay FX
      setFx(p => p.map(f => ({ ...f, l: f.l - 1 })).filter(f => f.l > 0));
    }, 45);
    return () => clearInterval(iv);
  }, [t]);

  function popBubble(id, x, y) {
    setBubbles(p => p.filter(b => b.id !== id));
    setSc(p => p + 1);
    setFx(f => [...f, { x, y, l: 14 }]);
    sfxDebateHit();
  }

  const rating = sc > 12 ? "ABSOLUTELY DESTROYED" : sc > 7 ? "BASED" : sc > 3 ? "MID ENERGY" : "LOW ENERGY";

  return (
    <div style={{ background: "#0d2240", borderRadius: 8, overflow: "hidden", touchAction: "none" }}>
      <svg viewBox="0 0 200 130" style={{ display: "block", width: "100%", transition: "transform 0.05s", transform: shakeKirk ? "translateX(2px)" : "none" }}>
        <rect width="200" height="130" fill="#dce8f5" />
        {/* Header */}
        <rect width="200" height="20" fill="#1a3a6a" />
        <text x="12" y="14" fontSize="7" fontFamily="'Bangers',cursive" fill="#fff" letterSpacing="1">DEBATE ME, COWARD!</text>
        <text x="188" y="14" fontSize="8" fontFamily="'Bangers',cursive" fill="#c41e3a" textAnchor="end">{sc}</text>
        {/* Timer bar */}
        <rect x="0" y="20" width={200 * t / 15} height="2.5" fill="#c41e3a" />

        {/* Hit flash */}
        {hitFlash && <rect width="200" height="130" fill="#ef444433" />}
        {/* Kirk at podium */}
        <g transform={shakeKirk ? "translate(22, 72) rotate(3)" : "translate(22, 72)"}>
          <rect x={-8} y={10} width={16} height={20} rx={2} fill="#5a3a1a" />
          <rect x={-10} y={10} width={20} height={3} rx={1} fill="#7a5a3a" />
          <Kirk stage="adult" mood="angry" faceSize={faceSize} scale={0.32} frame={fc.current % 4} gender={gender} />
        </g>

        {/* Bubbles */}
        {bubbles.map(b => (
          <g key={b.id} onPointerDown={(e) => { e.preventDefault(); popBubble(b.id, b.x, b.y); }} style={{ cursor: "pointer" }}>
            <rect x={b.x - 22} y={b.y - 8} width={44} height={16} rx={8} fill="#fff" stroke="#1a3a6a" strokeWidth={0.8} />
            <text x={b.x} y={b.y + 3} fontSize="4.5" fontFamily="'Press Start 2P',monospace" fill="#1a3a6a" textAnchor="middle" style={{ pointerEvents: "none" }}>{b.text}</text>
          </g>
        ))}

        {/* DESTROYED fx */}
        {fx.map((p, i) => (
          <text key={i} x={p.x} y={p.y - (14 - p.l) * 2} fontSize="6" fontFamily="'Bangers',cursive" fill="#c41e3a" textAnchor="middle" opacity={p.l / 14} fontWeight="bold">DESTROYED!</text>
        ))}

        {/* End screen */}
        {t === 0 && (
          <g>
            <rect x="15" y="30" width="170" height="65" rx="8" fill="#1a3a6aee" />
            <text x="100" y="52" fontSize="12" fontFamily="'Bangers',cursive" fill="#fff" textAnchor="middle" letterSpacing="2">{rating}</text>
            <text x="100" y="68" fontSize="7" fontFamily="'Bangers',cursive" fill="#c41e3a" textAnchor="middle">{sc} arguments destroyed</text>
            <text x="100" y="80" fontSize="5" fontFamily="'Press Start 2P',monospace" fill="#fff6" textAnchor="middle">{misses > 0 ? misses + " got through" : "FLAWLESS DEBATE"}</text>
            <text x="100" y="90" fontSize="5" fontFamily="'Bangers',cursive" fill="#fff4" textAnchor="middle">Curious.</text>
          </g>
        )}
      </svg>
    </div>
  );
}

// ═══ MEMORIAL SCREEN ═══
function MemorialScreen({ pet, stats, onReset, frame, gender }) {
  const [showBtn, setShowBtn] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBtn(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!musicStarted) {
      playWeAreCharlieKirk();
      setMusicStarted(true);
    }
    return () => stopMemorialMusic();
  }, [musicStarted]);

  const quote = MEMORIAL_QUOTES[Math.floor(Math.abs(Math.sin(pet.born || 0)) * MEMORIAL_QUOTES.length)];
  const hatched = storage.get("kirks_hatched") || 0;
  const highestStage = STAGES[stageOf(pet.age)] || STAGES.egg;
  const ageMin = Math.floor(pet.age / 60);
  const ageSec = pet.age % 60;

  // Candle positions
  const candles = [30, 55, 80, 105, 130, 155, 170];

  return (
    <div style={{ background: "#080e1a", borderRadius: 8, overflow: "hidden", position: "relative" }}>
      <svg viewBox="0 0 200 180" style={{ display: "block", width: "100%" }}>
        {/* Dark solemn background */}
        <rect width="200" height="180" fill="#080e1a" />

        {/* Stars */}
        {Array.from({ length: 15 }, (_, i) => (
          <circle key={i} cx={(i * 31 + 7) % 200} cy={(i * 17 + 3) % 60} r={0.6} fill="#fff" opacity={0.15 + (frame % 2) * 0.1} />
        ))}

        {/* Flag at half mast */}
        <line x1="18" y1="8" x2="18" y2="65" stroke="#888" strokeWidth="1" />
        <g transform="translate(19, 28)">
          <rect width="18" height="10" fill="#c41e3a" rx="1" />
          <rect y="2.5" width="18" height="2.5" fill="#fff" />
          <rect y="7.5" width="18" height="2.5" fill="#fff" />
          <rect width="7" height="5" fill="#1a3a6a" />
        </g>

        {/* In Loving Memory */}
        <text x="100" y="22" fontSize="5" fontFamily="'Press Start 2P',monospace" fill="#c41e3a88" textAnchor="middle" letterSpacing="2">IN LOVING MEMORY</text>

        {/* Kirk portrait */}
        <circle cx="100" cy="52" r="18" fill="#1a3a6a33" stroke="#c41e3a44" strokeWidth="1" />
        <g transform="translate(100, 50)">
          <Kirk stage={stageOf(pet.age)} mood="dead" faceSize={1} frame={frame} scale={0.55} gender={gender} />
        </g>

        {/* Name */}
        <text x="100" y="80" fontSize="12" fontFamily="'Bangers',cursive" fill="#fff" textAnchor="middle" letterSpacing="3">{pet.name}</text>

        {/* Life details */}
        <text x="100" y="92" fontSize="4.5" fontFamily="'Press Start 2P',monospace" fill="#fff6" textAnchor="middle">
          {highestStage.label} · {ageMin}m {ageSec}s
        </text>
        <text x="100" y="102" fontSize="4" fontFamily="'Press Start 2P',monospace" fill="#fff4" textAnchor="middle">
          🐦 {stats.tweets || 0} tweets · 💥 {stats.libsOwned || 0} libs · 🍔 {stats.feeds || 0} fed
        </text>

        {/* Quote */}
        <text x="100" y="120" fontSize="4.5" fontFamily="'Press Start 2P',monospace" fill="#c41e3a" textAnchor="middle">{quote.length > 40 ? quote.slice(0, 40) : quote}</text>
        {quote.length > 40 && (
          <text x="100" y="128" fontSize="4.5" fontFamily="'Press Start 2P',monospace" fill="#c41e3a" textAnchor="middle">{quote.slice(40)}</text>
        )}

        {/* We Are Charlie Kirk */}
        <text x="100" y="142" fontSize="3.5" fontFamily="'Press Start 2P',monospace" fill="#fff3" textAnchor="middle">
          ♪ We Are Charlie Kirk ♪
        </text>

        {/* Candlelight vigil */}
        {candles.map((cx, i) => (
          <g key={i} transform={"translate(" + cx + ", 155)"}>
            {/* Person silhouette */}
            <circle cy={-3} r={2.5} fill="#1a3a6a55" />
            <rect x={-1.5} y={0} width={3} height={6} rx={1} fill="#1a3a6a44" />
            {/* Candle */}
            <rect x={-0.5} y={-8} width={1} height={4} fill="#f5deb3" />
            {/* Flame */}
            <ellipse cy={-10} rx={1} ry={1.5} fill="#f59e0b" opacity={frame % 2 === 0 ? 0.9 : 0.6}>
              <animate attributeName="ry" values="1.5;2;1.5" dur="0.8s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cy={-10} rx={0.5} ry={0.8} fill="#fff" opacity={0.4} />
          </g>
        ))}

        {/* Valhalla */}
        <text x="100" y="175" fontSize="6" fontFamily="'Bangers',cursive" fill="#c8a828" textAnchor="middle" letterSpacing="4" opacity={frame % 4 < 2 ? 0.7 : 0.35}>
          SEE YOU IN VALHALLA
        </text>
      </svg>

      {/* Hatch another button */}
      {showBtn && (
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
          <button
            onClick={() => { stopMemorialMusic(); onReset(); }}
            style={{
              background: "#c41e3a",
              border: "2px solid #8b1525",
              borderRadius: 20,
              color: "#fff",
              fontFamily: "'Bangers',cursive",
              fontSize: 14,
              padding: "6px 20px",
              cursor: "pointer",
              letterSpacing: 2,
              boxShadow: "0 2px 8px #0008",
            }}
          >
            🇺🇸 HATCH ANOTHER KIRKIE
          </button>
          <div style={{ fontSize: 8, color: "#fff3", fontFamily: "'Press Start 2P',monospace", marginTop: 4 }}>
            Kirkies hatched: {hatched}
          </div>
          {/* Share buttons — THE viral moment */}
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 6, flexWrap: "wrap" }}>
            <button
              onClick={() => {
                const ageStr = Math.floor(pet.age / 60) + "m " + (pet.age % 60) + "s";
                const stg = STAGES[stageOf(pet.age)] ? STAGES[stageOf(pet.age)].label : "";
                shareToX("RIP " + pet.name + " 🕊️\n\n" + stg + " · Survived " + ageStr + "\n" + (stats.tweets || 0) + " tweets · " + (stats.libsOwned || 0) + " libs owned\n\nCan you keep your Kirkie alive longer? 👇", window.location.href);
              }}
              style={{
                background: "#000", border: "1.5px solid #333", borderRadius: 14,
                color: "#fff", fontFamily: "'Bangers',cursive", fontSize: 11,
                padding: "5px 14px", cursor: "pointer", letterSpacing: 1,
              }}
            >𝕏 POST TO X</button>
            <button
              onClick={() => {
                const url = window.location.href;
                shareNative("RIP " + pet.name, "Pour one out. " + Math.floor(pet.age / 60) + "m survivor. We Are Charlie Kirk.", url);
              }}
              style={{
                background: "none", border: "1.5px solid #fff3", borderRadius: 14,
                color: "#fff8", fontFamily: "'Bangers',cursive", fontSize: 11,
                padding: "5px 14px", cursor: "pointer", letterSpacing: 1,
              }}
            >📋 COPY LINK</button>
            <button
              onClick={() => {
                const challengeUrl = SITE_URL + "#challenge=" + pet.age;
                shareToX("I kept my Kirkie alive for " + Math.floor(pet.age / 60) + "m " + (pet.age % 60) + "s\n\nBet you can't beat that 😤\n\nChallenge link 👇", challengeUrl);
              }}
              style={{
                background: "#c41e3a", border: "none", borderRadius: 14,
                color: "#fff", fontFamily: "'Bangers',cursive", fontSize: 11,
                padding: "5px 14px", cursor: "pointer", letterSpacing: 1,
              }}
            >🎯 CHALLENGE FRIEND</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ KIRKIFY TEMPLATES ═══
const KIRKIFY_TEMPLATES = [
  { name: "MONA KIRK", render: (fs, frame) => (
    <svg viewBox="0 0 200 134" style={{ display: "block", width: "100%" }}>
      <rect width="200" height="134" fill="#3a2a10" />
      <rect x="6" y="6" width="188" height="122" fill="#8a7a50" rx="2" />
      <rect x="10" y="10" width="180" height="114" fill="#c4a44a22" />
      {/* Simple Mona Lisa body silhouette */}
      <path d="M70 50 Q100 30 130 50 L140 134 L60 134 Z" fill="#2a1a08" />
      <g transform="translate(100, 42)">
        <Kirk stage="adult" mood="happy" faceSize={fs} frame={frame} scale={0.6} />
      </g>
      <text x="100" y="128" fontSize="6" fontFamily="'Bangers',cursive" fill="#fff8" textAnchor="middle" letterSpacing="2">MONA KIRK</text>
    </svg>
  )},
  { name: "MOUNT KIRKMORE", render: (fs, frame) => (
    <svg viewBox="0 0 200 134" style={{ display: "block", width: "100%" }}>
      <rect width="200" height="134" fill="#87CEEB" />
      {/* Mountain */}
      <path d="M0 80 L30 50 L60 70 L90 40 L120 55 L160 35 L200 60 L200 134 L0 134 Z" fill="#8a8a7a" />
      {/* 4 Kirk faces */}
      {[35, 75, 115, 155].map((x, i) => (
        <g key={i} transform={"translate(" + x + ", 58)"}>
          <Kirk stage="adult" mood="neutral" faceSize={fs} frame={frame} scale={0.28} />
        </g>
      ))}
      <text x="100" y="128" fontSize="7" fontFamily="'Bangers',cursive" fill="#fff" textAnchor="middle" letterSpacing="2" stroke="#000" strokeWidth="0.5">MOUNT KIRKMORE</text>
    </svg>
  )},
  { name: "THIS IS FINE", render: (fs, frame) => (
    <svg viewBox="0 0 200 134" style={{ display: "block", width: "100%" }}>
      <rect width="200" height="134" fill="#f5a623" />
      {/* Flames */}
      {[20, 50, 80, 120, 150, 180].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy={40 + (i % 3) * 10} rx={15} ry={25} fill="#e8441188" />
          <ellipse cx={x} cy={30 + (i % 3) * 10} rx={8} ry={15} fill="#ff880066" />
        </g>
      ))}
      {/* Kirk at table */}
      <rect x="60" y="80" width="80" height="3" fill="#5a3a1a" />
      <rect x="65" y="83" width="3" height="20" fill="#5a3a1a" />
      <rect x="132" y="83" width="3" height="20" fill="#5a3a1a" />
      <rect x="85" y="70" width="12" height="12" rx="1" fill="#8B4513" /> {/* Coffee cup */}
      <rect x="87" y="66" width="8" height="5" rx="2" fill="#d4a574" />
      <g transform="translate(100, 68)">
        <Kirk stage="adult" mood="happy" faceSize={fs} frame={frame} scale={0.4} />
      </g>
      <text x="100" y="126" fontSize="8" fontFamily="'Bangers',cursive" fill="#fff" textAnchor="middle" letterSpacing="1" stroke="#000" strokeWidth="0.5">THIS IS FINE.</text>
    </svg>
  )},
  { name: "KIRKBUCKS", render: (fs, frame) => (
    <svg viewBox="0 0 200 134" style={{ display: "block", width: "100%" }}>
      <rect width="200" height="134" fill="#2a5a2a" rx="6" />
      <rect x="4" y="4" width="192" height="126" rx="4" fill="#f5f0e0" stroke="#2a5a2a" strokeWidth="2" />
      <text x="100" y="20" fontSize="5" fontFamily="'Press Start 2P',monospace" fill="#2a5a2a" textAnchor="middle">THE UNITED STATES OF KIRK</text>
      <ellipse cx="100" cy="65" rx="30" ry="32" fill="#f0e8d0" stroke="#2a5a2a" strokeWidth="1.5" />
      <g transform="translate(100, 60)">
        <Kirk stage="adult" mood="neutral" faceSize={fs} frame={frame} scale={0.5} />
      </g>
      <text x="20" y="65" fontSize="28" fontFamily="'Bangers',cursive" fill="#2a5a2a">$</text>
      <text x="180" y="65" fontSize="28" fontFamily="'Bangers',cursive" fill="#2a5a2a" textAnchor="end">$</text>
      <text x="100" y="115" fontSize="10" fontFamily="'Bangers',cursive" fill="#2a5a2a" textAnchor="middle" letterSpacing="3">ONE KIRK DOLLAR</text>
      <text x="100" y="126" fontSize="4" fontFamily="'Press Start 2P',monospace" fill="#2a5a2a88" textAnchor="middle">IN KIRK WE TRUST</text>
    </svg>
  )},
  { name: "GIGAKIRK", render: (fs, frame) => (
    <svg viewBox="0 0 200 134" style={{ display: "block", width: "100%" }}>
      <rect width="200" height="134" fill="#1a1a2e" />
      {/* Dramatic lighting */}
      <radialGradient id="glow"><stop offset="0%" stopColor="#c41e3a33" /><stop offset="100%" stopColor="#0000" /></radialGradient>
      <ellipse cx="100" cy="60" rx="90" ry="60" fill="url(#glow)" />
      {/* Big Kirk */}
      <g transform="translate(100, 55)">
        <Kirk stage="adult" mood="angry" faceSize={fs} frame={frame} scale={1.2} />
      </g>
      <text x="100" y="124" fontSize="14" fontFamily="'Bangers',cursive" fill="#c41e3a" textAnchor="middle" letterSpacing="4">GIGAKIRK</text>
    </svg>
  )},
  { name: "LIBERTY KIRK", render: (fs, frame) => (
    <svg viewBox="0 0 200 134" style={{ display: "block", width: "100%" }}>
      <rect width="200" height="134" fill="#87CEEB" />
      {/* Water */}
      <rect y="100" width="200" height="34" fill="#2a6a9a" />
      {/* Pedestal */}
      <rect x="75" y="85" width="50" height="49" fill="#6a8a6a" />
      <rect x="70" y="82" width="60" height="5" rx="1" fill="#7a9a7a" />
      {/* Robe */}
      <path d="M85 40 L75 85 L125 85 L115 40 Z" fill="#6a9a6a" />
      {/* Torch arm */}
      <line x1="115" y1="40" x2="130" y2="15" stroke="#6a9a6a" strokeWidth="4" />
      <ellipse cx="130" cy="10" rx="4" ry="6" fill="#f5a623" />
      {/* Kirk face */}
      <g transform="translate(100, 32)">
        <Kirk stage="adult" mood="happy" faceSize={fs} frame={frame} scale={0.4} />
      </g>
      {/* Crown */}
      <g transform="translate(100, 10)">
        {[-6, -3, 0, 3, 6].map((x, i) => (
          <line key={i} x1={x} y1={0} x2={x * 1.5} y2={-6} stroke="#6a9a6a" strokeWidth="1.5" />
        ))}
      </g>
      <text x="100" y="128" fontSize="6" fontFamily="'Bangers',cursive" fill="#fff" textAnchor="middle" letterSpacing="1" stroke="#0008" strokeWidth="0.3">GIVE ME LIBERTY OR GIVE ME KIRK</text>
    </svg>
  )},
  { name: "KIRKIFIED", render: (fs, frame) => (
    <svg viewBox="0 0 200 134" style={{ display: "block", width: "100%" }}>
      <rect width="200" height="134" fill="#ff69b4" />
      <rect x="5" y="5" width="190" height="124" fill="#1a1a2e" rx="4" />
      {/* Multiple Kirk faces scattered */}
      {[[40, 35], [100, 45], [160, 30], [60, 80], [140, 75], [100, 100]].map(([x, y], i) => (
        <g key={i} transform={"translate(" + x + "," + y + ") rotate(" + ((i * 23 - 30) % 60) + ")"}>
          <Kirk stage={["egg", "baby", "child", "teen", "adult"][i % 5]} mood="happy" faceSize={fs} frame={(frame + i) % 4} scale={0.22 + (i % 3) * 0.08} />
        </g>
      ))}
      <text x="100" y="120" fontSize="16" fontFamily="'Bangers',cursive" fill="#c41e3a" textAnchor="middle" letterSpacing="3" stroke="#fff" strokeWidth="1">KIRKIFIED</text>
    </svg>
  )},
  { name: "AMERICAN KIRKOTHIC", render: (fs, frame) => (
    <svg viewBox="0 0 200 134" style={{ display: "block", width: "100%" }}>
      <rect width="200" height="134" fill="#8a7a5a" />
      {/* Barn bg */}
      <path d="M50 30 L100 10 L150 30 L150 100 L50 100 Z" fill="#8B4513" />
      <rect x="85" y="60" width="30" height="40" fill="#3a2a10" />
      {/* Two Kirks - American Gothic style */}
      <g transform="translate(75, 60)">
        <Kirk stage="adult" mood="neutral" faceSize={fs} frame={0} scale={0.4} />
      </g>
      <g transform="translate(125, 60)">
        <Kirk stage="adult" mood="neutral" faceSize={fs} frame={0} scale={0.4} />
      </g>
      {/* Pitchfork */}
      <line x1="65" y1="45" x2="65" y2="100" stroke="#5a4a2a" strokeWidth="2" />
      <path d="M60 45 L65 35 L70 45" fill="none" stroke="#5a4a2a" strokeWidth="2" />
      <line x1="65" y1="35" x2="65" y2="45" stroke="#5a4a2a" strokeWidth="2" />
      <text x="100" y="125" fontSize="7" fontFamily="'Bangers',cursive" fill="#fff" textAnchor="middle" letterSpacing="1" stroke="#000" strokeWidth="0.3">AMERICAN KIRKOTHIC</text>
    </svg>
  )},
  { name: "KIRK LISA", render: (fs, frame) => (
    <svg viewBox="0 0 200 134" style={{ display: "block", width: "100%" }}>
      <rect width="200" height="134" fill="#1a1a2e" />
      {/* Starry night swirls */}
      {[[40, 30], [80, 20], [120, 35], [160, 25]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={20} ry={12} fill="none" stroke="#4a6aaa" strokeWidth="3" opacity="0.4" transform={"rotate(" + (i * 20) + " " + x + " " + y + ")"} />
      ))}
      {/* Village silhouette */}
      <rect y="80" width="200" height="54" fill="#1a2a1a" />
      <rect x="30" y="60" width="15" height="40" fill="#2a1a2a" />
      <polygon points="37,40 25,60 50,60" fill="#2a1a2a" />
      <rect x="80" y="55" width="20" height="45" fill="#2a1a2a" />
      <rect x="140" y="65" width="25" height="35" fill="#2a1a2a" />
      {/* Kirk moon */}
      <circle cx="165" cy="25" r="15" fill="#f5deb3" />
      <g transform="translate(165, 25)">
        <Kirk stage="adult" mood="happy" faceSize={fs} frame={frame} scale={0.2} />
      </g>
      <text x="100" y="125" fontSize="7" fontFamily="'Bangers',cursive" fill="#f5deb3" textAnchor="middle" letterSpacing="1">KIRK-Y NIGHT</text>
    </svg>
  )},
  { name: "KIRK VALHALLA", render: (fs, frame) => (
    <svg viewBox="0 0 200 134" style={{ display: "block", width: "100%" }}>
      {/* Golden sky */}
      <rect width="200" height="134" fill="#1a0a2a" />
      <radialGradient id="heaven"><stop offset="0%" stopColor="#c8a82866" /><stop offset="100%" stopColor="#0000" /></radialGradient>
      <ellipse cx="100" cy="40" rx="100" ry="50" fill="url(#heaven)" />
      {/* Light rays */}
      {[70, 85, 100, 115, 130].map((x, i) => (
        <line key={i} x1={x} y1="0" x2={x + (i - 2) * 8} y2="134" stroke="#c8a82811" strokeWidth="8" />
      ))}
      {/* Kirk ascending */}
      <g transform={"translate(100, " + (45 + Math.sin(frame) * 2) + ")"}>
        <Kirk stage="adult" mood="happy" faceSize={fs} frame={frame} scale={0.6} />
      </g>
      {/* Wings */}
      <path d="M70 52 Q50 35 30 45 Q45 38 65 48" fill="#fff3" />
      <path d="M130 52 Q150 35 170 45 Q155 38 135 48" fill="#fff3" />
      <text x="100" y="100" fontSize="5" fontFamily="'Press Start 2P',monospace" fill="#c8a828" textAnchor="middle">WELCOME TO VALHALLA</text>
      <text x="100" y="118" fontSize="4" fontFamily="'Press Start 2P',monospace" fill="#c8a82866" textAnchor="middle">★ WE ARE CHARLIE KIRK ★</text>
    </svg>
  )},
];

// ═══ ACHIEVEMENT TOAST ═══
function AchievementToast({ achievement, onDone }) {
  useEffect(() => {
    sfxAchievement();
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
      zIndex: 999, animation: "toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      pointerEvents: "none",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #1a3a6a 0%, #0d2240 100%)",
        border: "2px solid #c41e3a",
        borderRadius: 16,
        padding: "10px 18px",
        display: "flex", alignItems: "center", gap: 10,
        boxShadow: "0 8px 32px #000a, 0 0 20px #c41e3a33",
        minWidth: 220,
      }}>
        <span style={{ fontSize: 28 }}>{achievement.icon}</span>
        <div>
          <div style={{ fontSize: 11, fontFamily: "'Bangers',cursive", color: "#c41e3a", letterSpacing: 2 }}>ACHIEVEMENT</div>
          <div style={{ fontSize: 13, fontFamily: "'Bangers',cursive", color: "#fff", letterSpacing: 1 }}>{achievement.title}</div>
          <div style={{ fontSize: 7, fontFamily: "'Press Start 2P',monospace", color: "#fff8", marginTop: 2 }}>{achievement.desc}</div>
        </div>
      </div>
    </div>
  );
}

// ═══ EVOLUTION CEREMONY ═══
function EvolutionCeremony({ fromStage, toStage, name, gender, onDone }) {
  const [phase, setPhase] = useState(0); // 0=flash, 1=show, 2=done
  const [f, setF] = useState(0);

  useEffect(() => {
    sfxEvolveFanfare();
    setTimeout(() => setPhase(1), 400);
    setTimeout(() => setPhase(2), 3200);
    setTimeout(onDone, 3500);
    const iv = setInterval(() => setF(p => (p + 1) % 4), 200);
    return () => clearInterval(iv);
  }, [onDone]);

  const newLabel = STAGES[toStage] ? STAGES[toStage].label : toStage;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: phase === 0 ? "#fff" : "#080e1aee",
      transition: "background 0.4s",
      borderRadius: 7,
    }}>
      {phase >= 1 && (
        <div style={{ textAlign: "center", animation: "evolveIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
          {/* Sparkle ring */}
          <svg viewBox="0 0 100 100" style={{ width: 140, height: 140, display: "block", margin: "0 auto" }}>
            {/* Rotating sparkles */}
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i / 8) * Math.PI * 2 + f * 0.3;
              const r = 38 + Math.sin(f + i) * 4;
              return <circle key={i} cx={50 + Math.cos(angle) * r} cy={50 + Math.sin(angle) * r} r={1.5} fill={i % 2 ? "#c41e3a" : "#f5a623"} opacity={0.6 + Math.sin(f + i) * 0.3} />;
            })}
            <g transform="translate(50, 50)">
              <Kirk stage={toStage} mood="happy" faceSize={1} frame={f} scale={0.8} gender={gender} />
            </g>
          </svg>
          <div style={{ fontSize: 8, fontFamily: "'Press Start 2P',monospace", color: "#c41e3a", letterSpacing: 2, marginTop: 4 }}>PROMOTED!</div>
          <div style={{ fontSize: 18, fontFamily: "'Bangers',cursive", color: "#fff", letterSpacing: 3, marginTop: 2 }}>{newLabel.toUpperCase()}</div>
          <div style={{ fontSize: 7, fontFamily: "'Press Start 2P',monospace", color: "#fff6", marginTop: 4 }}>{name} leveled up!</div>
        </div>
      )}
    </div>
  );
}

// ═══ STREAK BANNER ═══
function StreakBanner({ streak, isNew }) {
  if (streak < 2 || !isNew) return null;
  return (
    <div style={{
      textAlign: "center", padding: "4px 0",
      animation: "slideUp 0.3s ease-out",
    }}>
      <span style={{
        fontSize: 8, fontFamily: "'Press Start 2P',monospace",
        color: "#f59e0b",
        background: "#f59e0b18",
        padding: "2px 8px",
        borderRadius: 8,
      }}>
        🔥 {streak} DAY STREAK! +{Math.min(streak * 2, 20)} bonus stats
      </span>
    </div>
  );
}

// ═══ ONBOARDING ═══
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const tips = [
    { icon: "🍔", title: "FEED YOUR KIRKIE", desc: "Tap buttons to keep stats up. If two stats hit zero... Valhalla." },
    { icon: "👆", title: "TAP YOUR KIRKIE", desc: "Tap Kirk to interact! Backgrounds change and Kirk reacts." },
    { icon: "🏆", title: "EARN ACHIEVEMENTS", desc: "Tweet, debate, survive — unlock achievements and climb the ranks." },
  ];

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 60,
      background: "#080e1aee",
      display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: 7,
    }}>
      <div style={{ textAlign: "center", padding: 16, animation: "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }} key={step}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>{tips[step].icon}</div>
        <div style={{ fontSize: 14, fontFamily: "'Bangers',cursive", color: "#fff", letterSpacing: 2, marginBottom: 6 }}>{tips[step].title}</div>
        <div style={{ fontSize: 7, fontFamily: "'Press Start 2P',monospace", color: "#fff8", lineHeight: 1.8, maxWidth: 200, margin: "0 auto" }}>{tips[step].desc}</div>

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
          {tips.map((_, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%",
              background: i === step ? "#c41e3a" : "#fff3",
              transition: "background 0.2s",
            }} />
          ))}
        </div>

        <button
          onClick={() => { sfxTap(); if (step < tips.length - 1) setStep(step + 1); else { storage.set("kirk_onboarded", true); onDone(); } }}
          style={{
            marginTop: 14, background: "#c41e3a", border: "none", borderRadius: 16,
            color: "#fff", fontFamily: "'Bangers',cursive", fontSize: 14,
            padding: "6px 24px", cursor: "pointer", letterSpacing: 2,
            boxShadow: "0 3px 12px #c41e3a44",
          }}
        >
          {step < tips.length - 1 ? "NEXT" : "LET'S GO!"}
        </button>
      </div>
    </div>
  );
}

// ═══ VIRALITY FEATURE 1: CUSTOM MEME MAKER ═══
function MemeMaker({ faceSize, frame, onClose }) {
  const [top, setTop] = useState("If socialism works,");
  const [mid, setMid] = useState("why does my friend");
  const [bot, setBot] = useState("STILL OWE ME $20?");

  return (
    <div style={{ padding: 4 }}>
      <div style={{ background: "#0d2240", borderRadius: 8, overflow: "hidden" }}>
        <svg viewBox="0 0 200 134" style={{ display: "block", width: "100%" }}>
          <rect width="200" height="134" fill="#0d2240" />
          <rect x="8" y="6" width="184" height="94" rx="4" fill="#fff" />
          <rect x="8" y="6" width="184" height="20" rx="4" fill="#c41e3a" />
          <rect x="8" y="16" width="184" height="10" fill="#c41e3a" />
          <text x="100" y="20" fontSize="8" fontFamily="'Bangers',cursive" fill="#fff" textAnchor="middle" letterSpacing="2">Dear Liberals,</text>
          <text x="100" y="44" fontSize="5" fontFamily="'Press Start 2P',monospace" fill="#1a3a6a" textAnchor="middle">{top}</text>
          <text x="100" y="58" fontSize="5" fontFamily="'Press Start 2P',monospace" fill="#1a3a6a" textAnchor="middle">{mid}</text>
          <text x="100" y="72" fontSize="5" fontFamily="'Press Start 2P',monospace" fill="#1a3a6a" textAnchor="middle" fontWeight="bold">{bot}</text>
          <g transform="translate(166, 82)">
            <Kirk stage="adult" mood="angry" faceSize={faceSize} scale={0.28} frame={frame} />
          </g>
          <text x="20" y="93" fontSize="6" fontFamily="'Bangers',cursive" fill="#c41e3a" letterSpacing="1">Curious. 🤔</text>
          <rect x="0" y="104" width="200" height="30" fill="#0a1a35" />
          <text x="100" y="116" fontSize="4" fontFamily="'Press Start 2P',monospace" fill="#fff5" textAnchor="middle">TURNING POINT KIRKOGOTCHI</text>
          <text x="100" y="128" fontSize="5" fontFamily="'Bangers',cursive" fill="#c41e3a" textAnchor="middle" letterSpacing="4">★  ★  ★</text>
        </svg>
      </div>
      <div style={{ padding: "6px 2px", display: "flex", flexDirection: "column", gap: 3 }}>
        {[["Line 1", top, setTop], ["Line 2", mid, setMid], ["Line 3 (bold)", bot, setBot]].map(([label, val, setter]) => (
          <input
            key={label}
            type="text"
            maxLength={35}
            value={val}
            onChange={e => setter(e.target.value)}
            placeholder={label}
            style={{
              background: "#fff1", border: "1px solid #fff2", borderRadius: 6,
              color: "#fff", fontFamily: "'Press Start 2P',monospace", fontSize: 7,
              padding: "4px 6px", outline: "none", width: "100%",
            }}
          />
        ))}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 3 }}>
          <button onClick={() => shareToX("Dear Liberals,\n\n" + top + "\n" + mid + "\n" + bot + "\n\nCurious. 🤔\n\nMake your own 👇")}
            style={{ background: "#000", border: "none", borderRadius: 8, color: "#fff", fontFamily: "'Press Start 2P',monospace", fontSize: 5, padding: "3px 8px", cursor: "pointer" }}>
            𝕏 POST MEME
          </button>
          <span style={{ fontSize: 5, fontFamily: "'Press Start 2P',monospace", color: "#c41e3a", lineHeight: "20px" }}>📸 SCREENSHOT</span>
        </div>
      </div>
    </div>
  );
}

// ═══ VIRALITY FEATURE 2: KIRK REACTION STICKERS ═══
const REACTION_STICKERS = [
  { mood: "happy", label: "BASED", bg: "#22c55e", text: "Based & approved" },
  { mood: "angry", label: "DESTROYED", bg: "#ef4444", text: "Absolutely DESTROYED" },
  { mood: "sad", label: "LOW ENERGY", bg: "#6366f1", text: "Low energy. Sad!" },
  { mood: "neutral", label: "CURIOUS", bg: "#f59e0b", text: "Curious. Very curious. 🤔" },
  { mood: "happy", label: "COPE", bg: "#ec4899", text: "Cope. Seethe. Repeat." },
  { mood: "angry", label: "RATIO", bg: "#1da1f2", text: "Ratio + you're a lib" },
  { mood: "happy", label: "W", bg: "#c41e3a", text: "That's a W, king 👑" },
  { mood: "sad", label: "F", bg: "#334155", text: "Press F for respects" },
];

function StickerPicker({ frame, faceSize, gender }) {
  const [idx, setIdx] = useState(0);
  const sticker = REACTION_STICKERS[idx];

  return (
    <div style={{ padding: 4 }}>
      <div style={{ background: sticker.bg, borderRadius: 12, overflow: "hidden", padding: 0 }}>
        <svg viewBox="0 0 200 120" style={{ display: "block", width: "100%" }}>
          <rect width="200" height="120" fill={sticker.bg} rx="8" />
          {/* Kirk */}
          <g transform="translate(100, 48)">
            <Kirk stage="adult" mood={sticker.mood} faceSize={faceSize} frame={frame} scale={0.7} gender={gender} />
          </g>
          {/* Label */}
          <text x="100" y="100" fontSize="16" fontFamily="'Bangers',cursive" fill="#fff" textAnchor="middle" letterSpacing="3" stroke="#0003" strokeWidth="0.5">{sticker.label}</text>
          <text x="100" y="114" fontSize="4.5" fontFamily="'Press Start 2P',monospace" fill="#fff8" textAnchor="middle">{sticker.text}</text>
        </svg>
      </div>
      {/* Sticker nav */}
      <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
        {REACTION_STICKERS.map((st, i) => (
          <button
            key={i}
            onClick={() => { setIdx(i); sfxTap(); }}
            style={{
              background: i === idx ? st.bg : st.bg + "44",
              border: i === idx ? "2px solid #fff" : "2px solid transparent",
              borderRadius: 8, padding: "2px 6px",
              color: "#fff", fontFamily: "'Bangers',cursive", fontSize: 8,
              cursor: "pointer", letterSpacing: 1,
              transition: "all 0.12s",
            }}
          >{st.label}</button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 4 }}>
        <button onClick={() => shareToX(sticker.text + "\n\nSend Kirk reactions to your friends 👇")}
          style={{ background: "#000", border: "none", borderRadius: 8, color: "#fff", fontFamily: "'Press Start 2P',monospace", fontSize: 5, padding: "3px 8px", cursor: "pointer" }}>
          𝕏 POST
        </button>
        <span style={{ fontSize: 5, fontFamily: "'Press Start 2P',monospace", color: "#c41e3a", lineHeight: "20px" }}>📸 SCREENSHOT</span>
      </div>
    </div>
  );
}

// ═══ VIRALITY FEATURE 3: CHALLENGE TIMER ═══
function ChallengeTimer({ age, alive }) {
  if (!alive) return null;
  const m = Math.floor(age / 60);
  const s = age % 60;
  const formatted = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  return (
    <div style={{
      textAlign: "center", padding: "2px 0",
      fontFamily: "'Press Start 2P',monospace",
    }}>
      <span style={{
        fontSize: 8, color: "#fff6", letterSpacing: 1,
      }}>⏱️ {formatted}</span>
    </div>
  );
}

// ═══ VIRALITY FEATURE 4: SHAREABLE DEATH URL ═══
function encodeDeathCard(pet, stats) {
  const data = {
    n: pet.name,
    g: pet.gender || "boy",
    a: pet.age,
    t: stats.tweets || 0,
    l: stats.libsOwned || 0,
    s: stageOf(pet.age),
  };
  return btoa(JSON.stringify(data));
}

function decodeDeathCard(hash) {
  try { return JSON.parse(atob(hash)); } catch(e) { return null; }
}

function SharedMemorialCard({ data, frame }) {
  const ageMin = Math.floor(data.a / 60);
  const ageSec = data.a % 60;
  const stageLabel = STAGES[data.s] ? STAGES[data.s].label : data.s;
  const quote = MEMORIAL_QUOTES[Math.abs(data.n.charCodeAt(0)) % MEMORIAL_QUOTES.length];

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#080e1a", fontFamily: "'Bangers', cursive", padding: 16,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Press+Start+2P&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 360, width: "100%" }}>
        <div style={{ background: "#080e1a", borderRadius: 12, overflow: "hidden", border: "2px solid #c41e3a33", padding: 4 }}>
          <svg viewBox="0 0 200 160" style={{ display: "block", width: "100%" }}>
            <rect width="200" height="160" fill="#080e1a" />
            <text x="100" y="18" fontSize="5" fontFamily="'Press Start 2P',monospace" fill="#c41e3a88" textAnchor="middle" letterSpacing="2">IN LOVING MEMORY</text>
            <circle cx="100" cy="50" r="18" fill="#1a3a6a33" stroke="#c41e3a44" strokeWidth="1" />
            <g transform="translate(100, 48)">
              <Kirk stage={data.s} mood="dead" faceSize={1} frame={frame} scale={0.55} gender={data.g} />
            </g>
            <text x="100" y="78" fontSize="14" fontFamily="'Bangers',cursive" fill="#fff" textAnchor="middle" letterSpacing="3">{data.n}</text>
            <text x="100" y="90" fontSize="4.5" fontFamily="'Press Start 2P',monospace" fill="#fff6" textAnchor="middle">
              {stageLabel} · {ageMin}m {ageSec}s
            </text>
            <text x="100" y="100" fontSize="4" fontFamily="'Press Start 2P',monospace" fill="#fff4" textAnchor="middle">
              🐦 {data.t} tweets · 💥 {data.l} libs owned
            </text>
            <text x="100" y="118" fontSize="4" fontFamily="'Press Start 2P',monospace" fill="#c41e3a" textAnchor="middle">{quote.slice(0, 45)}</text>
            <text x="100" y="136" fontSize="3.5" fontFamily="'Press Start 2P',monospace" fill="#fff3" textAnchor="middle">♪ We Are Charlie Kirk ♪</text>
            <text x="100" y="152" fontSize="3" fontFamily="'Press Start 2P',monospace" fill="#c41e3a55" textAnchor="middle">kirkogotchi — hatch yours at kirkogotchi.app</text>
          </svg>
        </div>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <a href="./" style={{
            background: "#c41e3a", color: "#fff", fontFamily: "'Bangers',cursive",
            fontSize: 16, padding: "8px 24px", borderRadius: 20, textDecoration: "none",
            letterSpacing: 2, boxShadow: "0 3px 12px #c41e3a44",
          }}>HATCH YOUR OWN KIRKIE</a>
        </div>
      </div>
    </div>
  );
}

// ═══ KIRK QUOTE GENERATOR ═══
function QuoteGenerator({ frame }) {
  const [idx, setIdx] = useState(Math.floor(Math.random() * KIRK_QUOTES.length));
  const q = KIRK_QUOTES[idx];

  return (
    <div style={{ padding: 4 }}>
      <div style={{ background: "#0d2240", borderRadius: 10, overflow: "hidden" }}>
        <svg viewBox="0 0 200 130" style={{ display: "block", width: "100%" }}>
          <rect width="200" height="130" fill="#0d2240" />
          {/* Quote marks */}
          <text x="16" y="28" fontSize="20" fontFamily="'Bangers',cursive" fill="#c41e3a33">"</text>
          {/* Quote text — wrap manually */}
          {q.quote.length <= 45 ? (
            <text x="100" y="55" fontSize="6" fontFamily="'Press Start 2P',monospace" fill="#fff" textAnchor="middle" style={{ lineHeight: 1.8 }}>{q.quote}</text>
          ) : (
            <g>
              <text x="100" y="48" fontSize="5.5" fontFamily="'Press Start 2P',monospace" fill="#fff" textAnchor="middle">{q.quote.slice(0, 40)}</text>
              <text x="100" y="60" fontSize="5.5" fontFamily="'Press Start 2P',monospace" fill="#fff" textAnchor="middle">{q.quote.slice(40)}</text>
            </g>
          )}
          {/* Attribution */}
          <text x="100" y="80" fontSize="4.5" fontFamily="'Bangers',cursive" fill="#c41e3a" textAnchor="middle" letterSpacing="1">— {q.attr}</text>
          {/* Kirk portrait */}
          <g transform="translate(100, 104)">
            <Kirk stage="adult" mood="happy" faceSize={1} frame={frame} scale={0.3} />
          </g>
          {/* Branding */}
          <text x="100" y="126" fontSize="3" fontFamily="'Press Start 2P',monospace" fill="#fff2" textAnchor="middle">kirkogotchi · we are charlie kirk</text>
        </svg>
      </div>
      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 6 }}>
        <button
          onClick={() => { setIdx((idx + 1) % KIRK_QUOTES.length); sfxTap(); }}
          style={{
            background: "#1a3a6a", border: "none", borderRadius: 12,
            color: "#fff", fontFamily: "'Bangers',cursive", fontSize: 11,
            padding: "5px 14px", cursor: "pointer", letterSpacing: 1,
          }}
        >🔄 NEXT QUOTE</button>
        <button
          onClick={() => shareToX('"' + q.quote + '" — ' + q.attr + "\n\nRaise your own Kirkie 👇")}
          style={{
            background: "#000", border: "none", borderRadius: 12,
            color: "#fff", fontFamily: "'Bangers',cursive", fontSize: 11,
            padding: "5px 14px", cursor: "pointer", letterSpacing: 1,
          }}
        >𝕏 POST</button>
      </div>
      <div style={{ textAlign: "center", marginTop: 4 }}>
        <span style={{ fontSize: 5, fontFamily: "'Press Start 2P',monospace", color: "#c41e3a" }}>📸 SCREENSHOT · SHARE · KIRKIFY</span>
      </div>
    </div>
  );
}

// ═══ CHALLENGE BANNER ═══
function ChallengeBanner({ targetAge }) {
  if (!targetAge) return null;
  const m = Math.floor(targetAge / 60);
  const s = targetAge % 60;
  return (
    <div style={{
      textAlign: "center", padding: "3px 0",
      animation: "slideUp 0.3s ease-out",
    }}>
      <span style={{
        fontSize: 7, fontFamily: "'Press Start 2P',monospace",
        color: "#c41e3a",
        background: "#c41e3a15",
        padding: "2px 8px",
        borderRadius: 8,
        border: "1px solid #c41e3a33",
      }}>
        🎯 BEAT {m}m {s < 10 ? "0" : ""}{s}s — CAN YOU?
      </span>
    </div>
  );
}

// ═══ PARTICLE HELPERS ═══
function mkParticles(cx, cy, color) {
  return Array.from({ length: 12 }, () => ({
    x: cx + (Math.random() - 0.5) * 8,
    y: cy,
    dx: (Math.random() - 0.5) * 3,
    dy: -Math.random() * 2.5 - 0.5,
    c: color,
    l: 16 + Math.random() * 10,
    ml: 26,
  }));
}

// ═══ MAIN APP ═══
window.Kirkogotchi = function Kirkogotchi() {
  const [pet, setPet] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [frame, setFrame] = useState(0);
  const [act, setAct] = useState(null);
  const [poops, setPoops] = useState([]);
  const [msg, setMsg] = useState("");
  const [lightsOff, setLightsOff] = useState(false);
  const [rally, setRally] = useState(false);
  const [view, setView] = useState("pet");
  const [log, setLog] = useState([]);
  const [particles, setParticles] = useState([]);
  const [evolveFlash, setEvolveFlash] = useState(false);
  const [dearIdx, setDearIdx] = useState(0);
  const faceSlider = 1.0;
  const [kFlash, setKFlash] = useState(false);
  const [shake, setShake] = useState(false);
  const [kirkifyIdx, setKirkifyIdx] = useState(0);
  const [idleMsg, setIdleMsg] = useState("");
  const [stats, setStats] = useState({ tweets: 0, libsOwned: 0, feeds: 0, cleans: 0, kirkifies: 0, flawlessDebates: 0, maxAge: 0, maxStage: 0, deaths: 0, streak: 0 });
  const [showMemorial, setShowMemorial] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const [bgIdx, setBgIdx] = useState(-1);
  const [tapReaction, setTapReaction] = useState("");
  const [achievementQueue, setAchievementQueue] = useState([]);
  const [showingAchievement, setShowingAchievement] = useState(null);
  const [evolving, setEvolving] = useState(null); // { from, to }
  const [streakData, setStreakData] = useState({ count: 0, isNew: false });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [sharedCard, setSharedCard] = useState(null);
  const [muted, setMuted] = useState(storage.get("kirk_muted") || false);
  const [combo, setCombo] = useState(0);
  const [comboTimer, setComboTimer] = useState(null);
  const [floatingEmoji, setFloatingEmoji] = useState(null);
  const [holdingItem, setHoldingItem] = useState(null); // emoji Kirk is holding
  const poopsRef = useRef([]);
  const unlockedRef = useRef(new Set());

  // Init mute
  useEffect(() => { _muted = muted; }, [muted]);

  const [challengeTarget, setChallengeTarget] = useState(null);

  // Check for shared death card or challenge URL
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash.startsWith("rip=")) {
      const data = decodeDeathCard(hash.slice(4));
      if (data) setSharedCard(data);
    } else if (hash.startsWith("challenge=")) {
      const age = parseInt(hash.slice(10));
      if (age > 0) setChallengeTarget(age);
    }
  }, []);

  // Load saved data (with v6 migration)
  useEffect(() => {
    var d = storage.get("kirk_v8");
    if (!d) {
      // Try migrating from old formats
      try {
        var old = storage.get("kirk_v7") || storage.get("kirk_v6");
        if (!old) {
          const raw = localStorage.getItem("kirk_v6") || localStorage.getItem("kirk_v7");
          if (raw) old = JSON.parse(raw);
        }
        if (old) {
          var p = old.p || null;
          if (p && !p.gender) p.gender = "boy"; // default old saves to boy
          d = { p, pp: old.pp, lg: old.lg, fs: old.fs || 1.0, st: old.st || { tweets: 0, libsOwned: 0 } };
          storage.set("kirk_v8", d);
          localStorage.removeItem("kirk_v6");
          localStorage.removeItem("kirk_v7");
        }
      } catch(e) {}
    }
    if (d) {
      setPet(d.p || null);
      setPoops(d.pp || []);
      setLog(d.lg || []);

      setStats(d.st || { tweets: 0, libsOwned: 0 });
      if (d.p && !d.p.alive) setShowMemorial(true);
    }
    setLoaded(true);
  }, []);

  const save = useCallback((p, pp, lg, st) => {
    storage.set("kirk_v8", { p, pp: pp || [], lg: lg || [], st: st || { tweets: 0, libsOwned: 0 } });
  }, []);

  // Keep poops ref in sync
  useEffect(() => { poopsRef.current = poops; }, [poops]);

  // Daily streak check on load
  useEffect(() => {
    if (!loaded || !pet) return;
    const sd = checkStreak();
    const isNew = sd.count > (stats.streak || 0);
    setStreakData({ count: sd.count, isNew });
    if (isNew && pet.alive && sd.count >= 2) {
      sfxStreakBonus();
      const bonus = Math.min(sd.count * 2, 20);
      setPet(p => p && p.alive ? ({
        ...p,
        happiness: Math.min(100, p.happiness + bonus),
        clout: Math.min(100, p.clout + bonus),
      }) : p);
      setStats(s => ({ ...s, streak: sd.count }));
      addLog("🔥 " + sd.count + " day streak! +" + bonus + " stats");
    }
  }, [loaded, pet?.name]);

  // Achievement checker — runs when stats change
  useEffect(() => {
    if (!stats || !pet) return;
    const unlocked = storage.get("kirk_achievements") || [];
    unlockedRef.current = new Set(unlocked);
    const newAch = [];
    ACHIEVEMENTS.forEach(a => {
      if (!unlockedRef.current.has(a.id) && a.check(stats)) {
        unlockedRef.current.add(a.id);
        newAch.push(a);
      }
    });
    if (newAch.length > 0) {
      storage.set("kirk_achievements", [...unlockedRef.current]);
      setAchievementQueue(q => [...q, ...newAch]);
    }
  }, [stats, pet]);

  // Show achievements one at a time
  useEffect(() => {
    if (showingAchievement || achievementQueue.length === 0) return;
    setShowingAchievement(achievementQueue[0]);
    setAchievementQueue(q => q.slice(1));
  }, [achievementQueue, showingAchievement]);

  const addLog = useCallback((text) => {
    setLog(prev => [{ t: text, d: Date.now() }, ...prev].slice(0, 60));
  }, []);

  const doShake = () => { setShake(true); setTimeout(() => setShake(false), 120); };

  // Frame animation
  useEffect(() => {
    const iv = setInterval(() => setFrame(f => (f + 1) % 4), 350);
    return () => clearInterval(iv);
  }, []);

  // Blink timer
  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() < 0.35) {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 150);
      }
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  // Particle animation
  useEffect(() => {
    const iv = setInterval(() => {
      setParticles(p => p
        .map(pt => ({ ...pt, y: pt.y + pt.dy, x: pt.x + pt.dx, l: pt.l - 1 }))
        .filter(pt => pt.l > 0)
      );
    }, 50);
    return () => clearInterval(iv);
  }, []);

  // Idle dialogue
  useEffect(() => {
    if (!pet || !pet.alive || rally || lightsOff || showOnboarding) return;
    const iv = setInterval(() => {
      if (Math.random() > 0.4) return; // Don't always talk
      const stage = stageOf(pet.age);

      // Check for neglect lines
      const lowCount = [pet.hunger < 20, pet.happiness < 20, pet.energy < 15, pet.clout < 20].filter(Boolean).length;
      if (lowCount >= 2 && Math.random() < 0.5) {
        const lines = NEGLECT_LINES.multi;
        setIdleMsg(lines[Math.floor(Math.random() * lines.length)]);
      } else if (pet.hunger < 20 && Math.random() < 0.4) {
        const lines = NEGLECT_LINES.hunger;
        setIdleMsg(lines[Math.floor(Math.random() * lines.length)]);
      } else if (pet.happiness < 20 && Math.random() < 0.4) {
        const lines = NEGLECT_LINES.happiness;
        setIdleMsg(lines[Math.floor(Math.random() * lines.length)]);
      } else if (pet.energy < 15 && Math.random() < 0.4) {
        const lines = NEGLECT_LINES.energy;
        setIdleMsg(lines[Math.floor(Math.random() * lines.length)]);
      } else if (pet.clout < 20 && Math.random() < 0.4) {
        const lines = NEGLECT_LINES.clout;
        setIdleMsg(lines[Math.floor(Math.random() * lines.length)]);
      } else {
        const lines = IDLE_DIALOGUE[stage] || IDLE_DIALOGUE.egg;
        setIdleMsg(lines[Math.floor(Math.random() * lines.length)]);
      }

      setTimeout(() => setIdleMsg(""), 4000);
    }, 12000);
    return () => clearInterval(iv);
  }, [pet, rally, lightsOff]);

  // Game tick
  useEffect(() => {
    if (!pet || !pet.alive || rally || showOnboarding) return;
    const iv = setInterval(() => {
      setPet(prev => {
        if (!prev || !prev.alive) return prev;
        var n = {
          ...prev,
          age: prev.age + 1,
          hunger: Math.max(0, prev.hunger - 0.22),
          happiness: Math.max(0, prev.happiness - (lightsOff ? 0.03 : 0.13)),
          energy: Math.min(100, prev.energy + (lightsOff ? 0.35 : -0.08)),
          clout: Math.max(0, prev.clout - 0.08),
        };

        // Poops make Kirk sad
        var currentPoops = poopsRef.current.length;
        if (currentPoops > 0) {
          n.happiness = Math.max(0, n.happiness - currentPoops * 0.02);
          n.clout = Math.max(0, n.clout - currentPoops * 0.03);
        }

        // Death check — any two stats at 0
        var zeros = [n.hunger <= 0, n.happiness <= 0, n.energy <= 0].filter(Boolean).length;
        if (zeros >= 2) {
          n.alive = false;
          // Dramatic death sequence: pause, flash, then memorial
          sfxDie();
          addLog("💀 Gone to Valhalla...");
          const hatched = storage.get("kirks_hatched") || 0;
          storage.set("kirks_hatched", hatched + 1);
          setStats(s => ({ ...s, deaths: (s.deaths || 0) + 1 }));
          // Phase 1: Screen goes dark (1.5s)
          setShake(true);
          setTimeout(() => setShake(false), 300);
          // Phase 2: Flash white (0.3s)
          setTimeout(() => { setEvolveFlash(true); setTimeout(() => setEvolveFlash(false), 300); }, 1200);
          // Phase 3: Memorial (after 2s) + generate share URL
          setTimeout(() => {
            setShowMemorial(true);
            // Set share URL hash
            try {
              const encoded = encodeDeathCard(n, stats);
              window.history.replaceState(null, "", "#rip=" + encoded);
            } catch(e) {}
          }, 2000);
        }

        // Random poop — more frequent so CLEAN matters
        if (Math.random() < 0.008 && !lightsOff) {
          setPoops(pp => pp.length < 5 ? [...pp, {
            id: Math.random(),
            x: 55 + Math.random() * 40,
            y: 50 + Math.random() * 30,
          }] : pp);
          n.clout = Math.max(0, n.clout - 4);
        }

        // Track max age for achievements
        setStats(s => ({ ...s, maxAge: Math.max(s.maxAge || 0, n.age) }));

        // Evolution check — full ceremony
        var oldStage = stageOf(prev.age);
        var newStage = stageOf(n.age);
        if (oldStage !== newStage) {
          setEvolving({ from: oldStage, to: newStage });
          setStats(s => ({ ...s, maxStage: Math.max(s.maxStage || 0, STAGE_NUM[newStage] || 0) }));
          addLog("🎉 Promoted to " + STAGES[newStage].label + "!");
        }

        return n;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [pet, lightsOff, rally, addLog, showOnboarding]);

  // Auto-save
  useEffect(() => {
    if (!pet) return;
    const iv = setInterval(() => save(pet, poops, log, stats), 3000);
    return () => clearInterval(iv);
  }, [pet, poops, log, stats, save]);

  // Combo tracker
  const triggerCombo = useCallback(() => {
    if (comboTimer) clearTimeout(comboTimer);
    setCombo(c => c + 1);
    const t = setTimeout(() => setCombo(0), 3000);
    setComboTimer(t);
  }, [comboTimer]);

  // Floating emoji
  const float = useCallback((emoji) => {
    setFloatingEmoji({ emoji, id: Math.random() });
    setTimeout(() => setFloatingEmoji(null), 1200);
  }, []);

  // Actions
  const doAction = useCallback((type) => {
    if (!pet || !pet.alive || act || rally) return;
    setAct(type);
    doShake();
    triggerCombo();

    if (type === "light") {
      sfxLight();
      setLightsOff(v => {
        var n = !v;
        setMsg(n ? "💤 Goodnight, King" : "☀️ Rise & grind!");
        addLog(n ? "💤 Lights off" : "☀️ Lights on");
        return n;
      });
      setAct(null);
      setTimeout(() => setMsg(""), 1000);
      return;
    }

    if (type === "rally") {
      sfxTap();
      setPet(p => {
        if (p.energy < 10) {
          setMsg("⚡ Low energy!");
          setAct(null);
          return p;
        }
        setRally(true);
        setMsg("");
        setAct(null);
        setView("pet");
        return p;
      });
      return;
    }

    if (type === "kirkify") {
      sfxKirkify();
      setKFlash(true);
      setTimeout(() => setKFlash(false), 300);
      setKirkifyIdx(i => (i + 1) % KIRKIFY_TEMPLATES.length);
      setBgIdx(i => (i + 1) % KIRKIFY_TEMPLATES.length);
      setPet(p => ({
        ...p,
        happiness: Math.min(100, p.happiness + 3),
        clout: Math.min(100, p.clout + 3),
      }));
      addLog("👤 KIRKIFIED!");
      setMsg("👤 KIRKIFIED!");
      setStats(s => ({ ...s, kirkifies: (s.kirkifies || 0) + 1 }));
      setAct(null);
      setTimeout(() => setMsg(""), 900);
      return;
    }

    // feed, tweet, clean, own
    if (type === "feed") sfxFeed();
    if (type === "tweet") sfxTweet();
    if (type === "clean") sfxClean();
    if (type === "own") sfxOwn();

    setPet(prev => {
      var n = { ...prev };
      if (type === "feed") {
        if (n.hunger >= 95) { setMsg("Already full!"); setAct(null); return prev; }
        n.hunger = Math.min(100, n.hunger + 22);
        n.energy = Math.min(100, n.energy + 4);
        setMsg("🍔 Hamberder time!");
        addLog("🍔 Hamberder");
        setParticles(p => [...p, ...mkParticles(50, 40, "#c41e3a")]);
        setStats(s => ({ ...s, feeds: (s.feeds || 0) + 1 }));
        float("🍔");
        setHoldingItem("🍔"); setTimeout(() => setHoldingItem(null), 1200);
      }
      if (type === "tweet") {
        n.happiness = Math.min(100, n.happiness + 9);
        n.clout = Math.min(100, n.clout + 13);
        var tw = TWEETS[Math.floor(Math.random() * TWEETS.length)];
        setMsg(tw);
        addLog("📱 " + tw);
        setParticles(p => [...p, ...mkParticles(50, 38, "#1da1f2")]);
        setStats(s => ({ ...s, tweets: (s.tweets || 0) + 1 }));
        float("📱");
        setHoldingItem("📱"); setTimeout(() => setHoldingItem(null), 1200);
      }
      if (type === "clean") {
        n.clout = 100;
        setPoops([]);
        setMsg("✨ Based & clean!");
        addLog("🧹 Cleaned up");
        setParticles(p => [...p, ...mkParticles(50, 50, "#3b82f6")]);
        setStats(s => ({ ...s, cleans: (s.cleans || 0) + 1 }));
        float("✨");
      }
      if (type === "own") {
        if (n.energy < 10) { setMsg("⚡ Need energy!"); setAct(null); return prev; }
        n.happiness = Math.min(100, n.happiness + 16);
        n.energy = Math.max(0, n.energy - 7);
        n.clout = Math.min(100, n.clout + 14);
        setDearIdx(Math.floor(Math.random() * DEAR_LIBS.length));
        setView("meme");
        setTimeout(() => setView("pet"), 3000); // Auto-dismiss after 3s
        addLog("💥 Owned the libs");
        setParticles(p => [...p, ...mkParticles(50, 40, "#dc2626")]);
        setStats(s => ({ ...s, libsOwned: (s.libsOwned || 0) + 1 }));
        float("💥");
      }
      return n;
    });

    // Combo bonus
    if (combo > 1) {
      const bonus = Math.min(combo * 2, 12);
      setPet(p => p && p.alive ? ({
        ...p,
        happiness: Math.min(100, p.happiness + bonus),
        clout: Math.min(100, p.clout + bonus),
      }) : p);
    }

    setTimeout(() => { setAct(null); setMsg(""); }, 1500);
  }, [pet, act, rally, lightsOff, addLog, combo, triggerCombo, float]);

  const endRally = useCallback((sc, misses) => {
    setRally(false);
    const perfect = misses === 0;
    const bonus = perfect ? 10 : 0;
    setPet(p => ({
      ...p,
      happiness: Math.min(100, p.happiness + Math.min(sc * 2.5, 30) + bonus),
      energy: Math.max(0, p.energy - 6),
      clout: Math.min(100, p.clout + sc * 2.5 + bonus),
      hunger: Math.max(0, p.hunger - 3), // Debating is hungry work
    }));
    setStats(s => ({
      ...s,
      libsOwned: (s.libsOwned || 0) + sc,
      flawlessDebates: (s.flawlessDebates || 0) + (perfect ? 1 : 0),
    }));
    addLog("🎤 Debate: " + sc + " destroyed" + (perfect ? " (FLAWLESS)" : ""));
    setMsg(
      perfect ? "🏆 FLAWLESS DEBATE!" :
      sc > 12 ? "🔥 ABSOLUTELY DESTROYED!" :
      sc > 7 ? "💪 Based!" :
      sc > 3 ? "😐 Mid energy..." :
      "💀 Low energy. Sad!"
    );
    setTimeout(() => setMsg(""), 1500);
  }, [addLog]);

  const createPet = useCallback((name, gender) => {
    var p = { name: name, gender: gender || "boy", hunger: 80, happiness: 80, energy: 100, clout: 70, age: 0, alive: true, born: Date.now() };
    var lg = [{ t: "🇺🇸 " + name + " joined TPUSA! (" + (gender === "girl" ? "Erika mode" : "Kirk mode") + ")", d: Date.now() }];
    var st = { tweets: 0, libsOwned: 0 };
    setPet(p);
    setPoops([]);
    setLog(lg);
    setStats(st);

    setShowMemorial(false);
    save(p, [], lg, st);
    setMsg(name + " has arrived!");
    sfxHatch();
    setTimeout(() => setMsg(""), 1800);
    // Show onboarding for first-time users
    if (!storage.get("kirk_onboarded")) {
      setTimeout(() => setShowOnboarding(true), 2000);
    }
  }, [save]);

  const reset = useCallback(() => {
    storage.del("kirk_v8");
    try { window.history.replaceState(null, "", window.location.pathname); } catch(e) {}
    setPet(null);
    setPoops([]);
    setLog([]);
    setMsg("");
    setLightsOff(false);
    setRally(false);
    setView("pet");

    setShowMemorial(false);
    setStats({ tweets: 0, libsOwned: 0 });
  }, []);

  // Tap on Kirk
  const tapKirk = useCallback(() => {
    if (!pet || !pet.alive || rally) return;
    sfxTap();
    doShake();
    const lines = pet.gender === "girl" ? TAP_REACTIONS_GIRL : TAP_REACTIONS;
    setTapReaction(lines[Math.floor(Math.random() * lines.length)]);
    setPet(p => ({ ...p, happiness: Math.min(100, p.happiness + 1) }));
    setTimeout(() => setTapReaction(""), 2500);
  }, [pet, rally]);


  // Shared memorial card
  if (sharedCard) {
    return <SharedMemorialCard data={sharedCard} frame={frame} />;
  }

  // Loading
  if (!loaded) {
    return <div style={{ minHeight: "100vh", background: "#080e1a" }} />;
  }

  // Name screen
  if (!pet) {
    return <StartScreen onCreate={createPet} />;
  }

  // Memorial screen
  if (showMemorial && !pet.alive) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#080e1a",
        fontFamily: "'Bangers', cursive",
        padding: 8,
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Press+Start+2P&display=swap" rel="stylesheet" />
        <div style={{ maxWidth: 360, width: "100%" }}>
          <MemorialScreen pet={pet} stats={stats} onReset={reset} frame={frame} gender={pet.gender} />
        </div>
      </div>
    );
  }

  // Derived state
  var stage = pet.alive ? stageOf(pet.age) : "baby";
  var ov = Math.round((pet.hunger + pet.happiness + pet.energy + pet.clout) / 4);
  var mood = !pet.alive ? "dead" : lightsOff ? "sleep" : ov > 70 ? "happy" : ov < 25 ? "sad" : "neutral";
  var fs = faceSlider;
  var dark = lightsOff;
  var displayMsg = msg || tapReaction || idleMsg;
  var critical = pet.alive && (pet.hunger < 10 || pet.happiness < 10 || pet.energy < 5);

  // Time-of-day ambiance
  var hour = new Date().getHours();
  var timeOfDay = hour >= 6 && hour < 12 ? "morning" : hour >= 12 && hour < 18 ? "day" : hour >= 18 && hour < 21 ? "evening" : "night";
  var timeTint = { morning: "#f5deb322", day: "transparent", evening: "#f59e0b15", night: "#1a1a4a22" }[timeOfDay];
  var overallHealth = pet.alive ? Math.round((pet.hunger + pet.happiness + pet.energy + pet.clout) / 4) : 0;

  // Merge OWN into tweet (20% chance of owning when tweeting)
  // KIRKIFY is now a button that just does the visual effect + bg change

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#080e1a",
      fontFamily: "'Bangers', cursive",
      padding: 8,
      overflow: "hidden",
      position: "relative",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Press+Start+2P&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}
        @keyframes glow{0%,100%{box-shadow:0 8px 32px #0008,0 0 0 2px #8b1525,0 0 16px #c41e3a18}50%{box-shadow:0 8px 32px #0008,0 0 0 2px #8b1525,0 0 28px #c41e3a33}}
        @keyframes kf{0%{filter:invert(1) hue-rotate(180deg) saturate(2)}100%{filter:none}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes critical{0%,100%{box-shadow:0 8px 32px #0008,0 0 0 2px #ef4444,0 0 16px #ef444433}50%{box-shadow:0 8px 32px #0008,0 0 0 2px #ef4444,0 0 28px #ef444466}}
        @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(-30px) scale(0.8)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
        @keyframes evolveIn{from{opacity:0;transform:scale(0.3) rotate(-10deg)}to{opacity:1;transform:scale(1) rotate(0)}}
        @keyframes popIn{from{transform:scale(0)}50%{transform:scale(1.15)}to{transform:scale(1)}}
        .shell{animation:glow 2.8s ease-in-out infinite}
        .shell-critical{animation:critical 0.8s ease-in-out infinite !important}
      `}</style>

      {/* Achievement toast */}
      {showingAchievement && (
        <AchievementToast
          achievement={showingAchievement}
          onDone={() => setShowingAchievement(null)}
        />
      )}

      {/* Device shell — tight, modern */}
      <div className={critical ? "shell shell-critical" : "shell"} style={{
        background: "#0d2240",
        borderRadius: 16,
        maxWidth: 380,
        width: "100%",
        overflow: "hidden",
        border: "2px solid #c41e3a44",
      }}>
        {/* Header bar */}
        <div style={{
          background: "linear-gradient(135deg, #c41e3a, #8b1525)",
          padding: "6px 10px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 16, color: "#fff", letterSpacing: 2, textShadow: "0 1px 4px #0005" }}>KIRKOGOTCHI</span>
          <button onClick={() => { const m = !muted; setMuted(m); setGlobalMute(m); }}
            style={{ background: "none", border: "none", fontSize: 14, cursor: "pointer", opacity: 0.7 }}>{muted ? "🔇" : "🔊"}</button>
        </div>

          {/* Streak banner */}
          <StreakBanner streak={streakData.count} isNew={streakData.isNew} />

          {/* Challenge banner (from shared link) */}
          {challengeTarget && <ChallengeBanner targetAge={challengeTarget} />}

          {/* Screen */}
            <div style={{
              background: dark ? "#2a3550" : "#dce8f5",
              overflow: "hidden",
              transition: "background 0.4s",
              animation: kFlash ? "kf 0.2s ease" : "none",
              transform: shake ? "translate(1px,-1px)" : "none",
              position: "relative",
            }}>
              {/* Onboarding overlay */}
              {showOnboarding && <Onboarding onDone={() => setShowOnboarding(false)} />}

              {/* Time-of-day tint */}
              {!dark && timeTint !== "transparent" && (
                <div style={{ position: "absolute", inset: 0, background: timeTint, pointerEvents: "none", zIndex: 1, borderRadius: 7 }} />
              )}
              {rally ? (
                <DebateGame onDone={endRally} name={pet.name} faceSize={fs} gender={pet.gender} />
              ) : view === "meme" ? (
                /* Dear Libs overlay — shown briefly when OWN is tapped */
                <div onClick={() => setView("pet")} style={{ cursor: "pointer" }}>
                  <DearLib data={DEAR_LIBS[dearIdx]} fs={fs} />
                  <div style={{ textAlign: "center", padding: 3 }}>
                    <span style={{ fontSize: 5, fontFamily: "'Press Start 2P',monospace", color: dark ? "#5a6a8a" : "#1a3a6a88" }}>TAP TO DISMISS</span>
                  </div>
                </div>
              ) : view === "share" ? (
                /* ═══ SHARE HUB — all shareable content in one scrollable view ═══ */
                <div style={{ maxHeight: 260, overflowY: "auto", overflowX: "hidden" }}>
                  {/* Kirkify gallery */}
                  <div style={{ borderRadius: 8, overflow: "hidden", cursor: "pointer", marginBottom: 4 }} onClick={() => { setKirkifyIdx(i => (i + 1) % KIRKIFY_TEMPLATES.length); sfxKirkify(); }}>
                    {KIRKIFY_TEMPLATES[kirkifyIdx].render(fs, frame)}
                    <div style={{ background: "#0d2240", padding: "4px 0", textAlign: "center", display: "flex", justifyContent: "center", gap: 6 }}>
                      <button onClick={(e) => { e.stopPropagation(); shareToX("My Kirkie got Kirkified 👤\n\n" + KIRKIFY_TEMPLATES[kirkifyIdx].name + "\n\nMake your own 👇"); }}
                        style={{ background: "#000", border: "none", borderRadius: 8, color: "#fff", fontFamily: "'Press Start 2P',monospace", fontSize: 5, padding: "3px 8px", cursor: "pointer" }}>𝕏 POST</button>
                      <span style={{ fontSize: 5, fontFamily: "'Press Start 2P',monospace", color: "#fff3", lineHeight: "20px" }}>{kirkifyIdx + 1}/{KIRKIFY_TEMPLATES.length} · TAP</span>
                    </div>
                  </div>

                  {/* Meme maker */}
                  <div style={{ background: "#1a3a6a11", borderRadius: 8, padding: 2, marginBottom: 4 }}>
                    <MemeMaker faceSize={fs} frame={frame} />
                  </div>

                  {/* Kirk quotes */}
                  <div style={{ background: "#1a3a6a11", borderRadius: 8, padding: 2, marginBottom: 4 }}>
                    <QuoteGenerator frame={frame} />
                  </div>

                  {/* Reaction stickers */}
                  <div style={{ background: "#1a3a6a11", borderRadius: 8, padding: 2 }}>
                    <StickerPicker frame={frame} faceSize={fs} gender={pet.gender} />
                  </div>
                </div>
              ) : view === "ach" ? (
                /* ═══ ACHIEVEMENTS ═══ */
                <div style={{ padding: 6, maxHeight: 260, overflowY: "auto" }}>
                  <div style={{ fontSize: 12, color: "#1a3a6a", textAlign: "center", marginBottom: 6, fontFamily: "'Bangers',cursive", letterSpacing: 2 }}>
                    🏆 {[...unlockedRef.current].length}/{ACHIEVEMENTS.length}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                    {ACHIEVEMENTS.map(a => {
                      const unlocked = unlockedRef.current.has(a.id);
                      return (
                        <div key={a.id} style={{
                          background: unlocked ? "#1a3a6a18" : "#1a3a6a08",
                          borderRadius: 8,
                          padding: "5px 6px",
                          opacity: unlocked ? 1 : 0.3,
                          transition: "opacity 0.3s",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ fontSize: 14 }}>{unlocked ? a.icon : "🔒"}</span>
                            <div>
                              <div style={{ fontSize: 6, fontFamily: "'Press Start 2P',monospace", color: "#1a3a6a", lineHeight: 1.5 }}>{a.title}</div>
                              <div style={{ fontSize: 4.5, fontFamily: "'Press Start 2P',monospace", color: "#1a3a6a88", lineHeight: 1.4 }}>{a.desc}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* ═══ PET VIEW ═══ */
                <div style={{ position: "relative", minHeight: 135 }}>
                  {/* Evolution ceremony overlay */}
                  {evolving && (
                    <EvolutionCeremony
                      fromStage={evolving.from}
                      toStage={evolving.to}
                      name={pet.name}
                      gender={pet.gender}
                      onDone={() => setEvolving(null)}
                    />
                  )}
                  {/* Pet name + stage compact header */}
                  <div style={{ textAlign: "center", padding: "4px 0 0" }}>
                    <span style={{ fontSize: 14, color: dark ? "#8a9abc" : "#1a3a6a", fontFamily: "'Bangers',cursive", letterSpacing: 2 }}>{pet.name}</span>
                    {pet.alive && <span style={{ fontSize: 7, color: dark ? "#5a6a8a" : "#1a3a6a66", fontFamily: "'Press Start 2P',monospace", marginLeft: 8 }}>
                      {STAGES[stage] ? STAGES[stage].label : stage} · {Math.floor(pet.age / 60)}:{(pet.age % 60 < 10 ? "0" : "") + pet.age % 60}
                    </span>}
                  </div>

                  {/* Tappable Kirk area */}
                  <div onClick={tapKirk} style={{ cursor: "pointer", position: "relative" }}>
                    <svg viewBox="0 0 100 100" style={{ display: "block", width: "100%", maxHeight: 160, position: "relative" }}>
                      {evolveFlash && (
                        <rect width="100" height="90" fill="#fff" opacity={0.4}>
                          <animate attributeName="opacity" from="0.5" to="0" dur="0.6s" fill="freeze" />
                        </rect>
                      )}

                      {/* Ambient — subtle ground line only */}
                      {!dark && (
                        <g>
                          <line x1="0" y1="82" x2="100" y2="82" stroke="#1a3a6a11" strokeWidth="0.5" />
                        </g>
                      )}
                      {/* Night — moon only */}
                      {dark && (
                        <g>
                          <circle cx="85" cy="12" r="5" fill="#f5deb3" opacity="0.3" />
                          <circle cx="87" cy="11" r="4" fill="#2a3550" />
                        </g>
                      )}

                      <g transform="translate(50, 42)">
                        <Kirk stage={stage} mood={act === "own" ? "angry" : mood} faceSize={fs} frame={frame} dark={dark} gender={pet.gender} blink={blinking} energy={pet.energy} hunger={pet.hunger} />
                        {/* Held item */}
                        {holdingItem && (
                          <text x={12} y={-2} fontSize="8" opacity={0.9}>
                            <animate attributeName="y" from="-2" to="-8" dur="1s" fill="freeze" />
                            <animate attributeName="opacity" from="1" to="0.3" dur="1.2s" fill="freeze" />
                            {holdingItem}
                          </text>
                        )}
                      </g>

                      {/* Floating emoji */}
                      {floatingEmoji && (
                        <text key={floatingEmoji.id} x="50" y="25" fontSize="14" textAnchor="middle" opacity="0.9">
                          <animate attributeName="y" from="30" to="5" dur="1s" fill="freeze" />
                          <animate attributeName="opacity" from="1" to="0" dur="1.2s" fill="freeze" />
                          {floatingEmoji.emoji}
                        </text>
                      )}
                      {mood === "sleep" && (
                        <g>
                          <text x="72" y="28" fontSize="5" fontFamily="'Bangers',cursive" fill={dark ? "#5a6a8a" : "#1a3a6a"} opacity={frame < 2 ? 0.5 : 0.2}>z</text>
                          <text x="78" y="20" fontSize="8" fontFamily="'Bangers',cursive" fill={dark ? "#5a6a8a" : "#1a3a6a"} opacity={frame < 2 ? 0.3 : 0.5}>Z</text>
                          <text x="85" y="14" fontSize="10" fontFamily="'Bangers',cursive" fill={dark ? "#5a6a8a" : "#1a3a6a"} opacity={frame >= 2 ? 0.3 : 0.4}>Z</text>
                        </g>
                      )}
                      {poops.map(p => <text key={p.id} x={p.x} y={p.y} fontSize="7">💩</text>)}
                      {particles.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={1.2} fill={p.c} opacity={p.l / p.ml} />)}
                    </svg>
                  </div>

                  {!pet.alive && (
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#0d2240ee", padding: "8px 6px 6px", borderRadius: "0 0 7px 7px", textAlign: "center" }}>
                      <div style={{ fontSize: 7, fontFamily: "'Press Start 2P',monospace", color: "#c41e3a", lineHeight: 1.8 }}>Gone to Valhalla...</div>
                      <div style={{ fontSize: 16, fontFamily: "'Bangers',cursive", color: "#fff", letterSpacing: 2, marginTop: 2 }}>
                        {Math.floor(pet.age / 60)}m {pet.age % 60}s
                      </div>
                      {challengeTarget && pet.age >= challengeTarget ? (
                        <div style={{ fontSize: 7, fontFamily: "'Press Start 2P',monospace", color: "#22c55e", marginTop: 2, animation: "pulse 0.6s infinite" }}>🏆 CHALLENGE BEATEN!</div>
                      ) : challengeTarget ? (
                        <div style={{ fontSize: 6, fontFamily: "'Press Start 2P',monospace", color: "#ef4444", marginTop: 2 }}>❌ Challenge failed ({Math.floor(challengeTarget/60)}m {challengeTarget%60}s needed)</div>
                      ) : (
                        <div style={{ fontSize: 6, fontFamily: "'Press Start 2P',monospace", color: "#fff5", marginTop: 2 }}>Can your friends beat this?</div>
                      )}
                    </div>
                  )}

                  {displayMsg && pet.alive && (
                    <div style={{
                      position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
                      animation: "popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      zIndex: 10,
                    }}>
                      <div style={{
                        background: msg ? "#fff" : "#fffd",
                        color: "#1a3a6a",
                        padding: "5px 12px",
                        borderRadius: 10,
                        fontSize: 7, fontFamily: "'Press Start 2P',monospace",
                        whiteSpace: "nowrap", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis",
                        boxShadow: "0 3px 12px #0003",
                        border: "1.5px solid #1a3a6a33",
                        position: "relative",
                      }}>
                        {displayMsg}
                        {/* Bubble tail */}
                        <div style={{
                          position: "absolute", bottom: -6, left: "50%", marginLeft: -5,
                          width: 0, height: 0,
                          borderLeft: "5px solid transparent",
                          borderRight: "5px solid transparent",
                          borderTop: msg ? "6px solid #fff" : "6px solid #fffd",
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          {/* Stat bars — compact single strip */}
          {pet.alive && (
            <div style={{ display: "flex", gap: 2, padding: "3px 6px" }}>
              {[
                ["🍔", pet.hunger, "#c41e3a", pet.hunger < 20],
                ["⭐", pet.happiness, "#d97706", pet.happiness < 20],
                ["⚡", pet.energy, "#2563eb", pet.energy < 15],
                ["📢", pet.clout, "#7c3aed", pet.clout < 20],
              ].map(([icon, val, color, warn]) => (
                <div key={icon} style={{ flex: 1, display: "flex", alignItems: "center", gap: 3 }}>
                  <span style={{ fontSize: 12, animation: warn ? "pulse 0.6s infinite" : "none" }}>{icon}</span>
                  <div style={{ flex: 1, height: 7, background: "#fff1", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: Math.max(0, val) + "%",
                      background: val < 20 ? "#ef4444" : color,
                      borderRadius: 3,
                      transition: "width 0.5s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Nav */}
          <div style={{ display: "flex", justifyContent: "center", gap: 3, margin: "4px 0" }}>
            {[["pet", "🐣 KIRKIE"], ["share", "📸 SHARE"], ["ach", "🏆 " + [...unlockedRef.current].length + "/" + ACHIEVEMENTS.length]].map(function([k, label]) {
              const hasNotif = (k === "pet" && view !== "pet" && poops.length > 0) ||
                               (k === "ach" && achievementQueue.length > 0);
              return (
                <button
                  key={k}
                  onClick={() => {
                    setView(k);
                    sfxTap();
                    if (k === "meme") setDearIdx(Math.floor(Math.random() * DEAR_LIBS.length));
                  }}
                  style={{
                    background: view === k ? "#1a3a6a" : "#fff1",
                    border: "1px solid #fff3",
                    borderRadius: 12,
                    color: view === k ? "#fff" : "#fff8",
                    fontSize: 9,
                    fontFamily: "'Bangers',cursive",
                    letterSpacing: 1,
                    padding: "4px 12px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    position: "relative",
                    transform: view === k ? "scale(1.05)" : "scale(1)",
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  {label}
                  {hasNotif && (
                    <div style={{
                      position: "absolute", top: -2, right: -2,
                      width: 7, height: 7, borderRadius: "50%",
                      background: "#ef4444",
                      boxShadow: "0 0 4px #ef444488",
                      animation: "pulse 1s infinite",
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action buttons — clean 4-button layout */}
          {pet.alive ? (
            <div style={{ padding: "4px 6px 6px" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                <ABtn label="FEED" emoji="🍔" bg="#c41e3a" onClick={() => doAction("feed")} off={!!act || rally} />
                <ABtn label="TWEET" emoji="📱" bg="#1da1f2" onClick={() => doAction("tweet")} off={!!act || rally} />
                <ABtn label="OWN" emoji="💥" bg="#dc2626" onClick={() => doAction("own")} off={!!act || rally} />
                <ABtn label="DEBATE" emoji="🎤" bg="#7c3aed" onClick={() => doAction("rally")} off={!!act || rally} />
                <ABtn label={lightsOff ? "WAKE" : "SLEEP"} emoji={lightsOff ? "☀️" : "🌙"} bg="#334155" onClick={() => doAction("light")} off={!!act || rally} />
              </div>
              {/* Clean — only shows when poops exist */}
              {poops.length > 0 && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                  <ABtn label={"CLEAN " + poops.length + "💩"} emoji="🧹" bg="#3b82f6" onClick={() => doAction("clean")} off={!!act || rally} />
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", padding: "8px 6px" }}>
              <ABtn label="NEW KIRKIE" emoji="🇺🇸" bg="#c41e3a" onClick={reset} />
            </div>
          )}
      </div>
    </div>
  );
}

// ═══ START SCREEN ═══
function StartScreen({ onCreate }) {
  const [name, setName] = useState("CHARLIE");
  const [gender, setGender] = useState("boy"); // "boy" or "girl"
  const [f, setF] = useState(0);
  const [dfs, setDfs] = useState(1.0);
  const dirRef = useRef(1);

  useEffect(() => {
    const iv = setInterval(() => {
      setF(p => (p + 1) % 4);
      setDfs(p => {
        var next = p + dirRef.current * 0.035;
        if (next > 1.35 || next < 0.35) {
          dirRef.current = -dirRef.current;
          return p;
        }
        return next;
      });
    }, 300);
    return () => clearInterval(iv);
  }, []);

  const hatched = storage.get("kirks_hatched") || 0;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#080e1a",
      fontFamily: "'Bangers', cursive",
      padding: 16,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Press+Start+2P&display=swap" rel="stylesheet" />
      <style>{`@keyframes glow{0%,100%{box-shadow:0 8px 32px #0008,0 0 0 2px #8b1525,0 0 16px #c41e3a18}50%{box-shadow:0 8px 32px #0008,0 0 0 2px #8b1525,0 0 28px #c41e3a33}}.shell{animation:glow 2.8s ease-in-out infinite}`}</style>

      <div className="shell" style={{
        background: "linear-gradient(165deg, #e8e8e8 0%, #c41e3a 35%, #1a3a6a 85%)",
        borderRadius: "28px 28px 42px 42px",
        padding: 4,
        maxWidth: 360,
        width: "100%",
      }}>
        <div style={{
          background: "linear-gradient(168deg, #d4d4d4 0%, #c41e3a 25%, #1a3a6a 80%)",
          borderRadius: "24px 24px 38px 38px",
          padding: "16px 12px 22px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 28, color: "#fff", letterSpacing: 3, textShadow: "0 3px 10px #0008, 0 0 15px #c41e3a55", marginBottom: 8 }}>KIRKOGOTCHI</div>

          <div style={{ background: "#0a0a0a", borderRadius: 10, padding: 4, boxShadow: "inset 0 2px 8px #000a" }}>
            <div style={{ background: "#dce8f5", borderRadius: 7, padding: "18px 10px 10px" }}>
              <svg viewBox="0 0 100 80" style={{ width: 160, display: "block", margin: "0 auto" }}>
                <g transform="translate(50, 34)">
                  <Kirk stage="adult" mood="happy" faceSize={dfs} frame={f} scale={0.95} gender={gender} />
                </g>
              </svg>

              {/* Gender selector */}
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 6, marginBottom: 4 }}>
                {[["boy", "👔 Kirk"], ["girl", "🎀 Erika"]].map(([g, label]) => (
                  <button
                    key={g}
                    onClick={() => { setGender(g); if (g === "girl" && name === "CHARLIE") setName("ERIKA"); if (g === "boy" && name === "ERIKA") setName("CHARLIE"); sfxTap(); }}
                    style={{
                      background: gender === g ? "#1a3a6a" : "#1a3a6a22",
                      border: gender === g ? "2px solid #1a3a6a" : "2px solid #1a3a6a44",
                      borderRadius: 12,
                      color: gender === g ? "#fff" : "#1a3a6a",
                      fontFamily: "'Bangers',cursive",
                      fontSize: 12,
                      padding: "3px 12px",
                      cursor: "pointer",
                      letterSpacing: 1,
                      transition: "all 0.15s",
                    }}
                  >{label}</button>
                ))}
              </div>

              <div style={{ fontSize: 9, color: "#1a3a6a", letterSpacing: 1, marginTop: 4, marginBottom: 4 }}>Name your Kirkie</div>
              <input
                type="text"
                maxLength={10}
                value={name}
                onChange={e => setName(e.target.value.toUpperCase())}
                onKeyDown={e => { if (e.key === "Enter" && name.trim()) onCreate(name.trim(), gender); }}
                autoFocus
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "2.5px solid #1a3a6a",
                  color: "#1a3a6a",
                  fontFamily: "'Bangers',cursive",
                  fontSize: 22,
                  textAlign: "center",
                  outline: "none",
                  width: "80%",
                  padding: "2px 4px",
                  letterSpacing: 3,
                }}
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <ABtn label="HATCH" emoji="🇺🇸" bg="#c41e3a" onClick={() => { if (name.trim()) onCreate(name.trim(), gender); }} off={!name.trim()} />
          </div>
          <div style={{ fontSize: 9, color: "#fff3", marginTop: 10, lineHeight: 1.8, fontFamily: "'Press Start 2P',monospace" }}>
            Keep your Kirkie fed & tweeting
            <br />
            Keep the face the right size
          </div>
          {hatched > 0 && (
            <div style={{ fontSize: 8, color: "#c41e3a55", fontFamily: "'Press Start 2P',monospace", marginTop: 6 }}>
              Kirkies lost: {hatched}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
