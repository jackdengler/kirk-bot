const { useState, useEffect, useCallback, useRef } = React;

// ═══ CONFIG ═══
const STAGES = {
  egg: { min: 0, label: "Intern", head: 18 },
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
  ],
  baby: [
    "Just hit 200 followers. Basically famous",
    "My Substack is gonna blow up",
    "Hot take incoming...",
    "Actually, I think you'll find...",
    "Just posted a thread 🧵",
    "Ratio'd someone with 10x my followers",
  ],
  child: [
    "Welcome back to the show, folks",
    "Smash that subscribe button",
    "My guest today is... me",
    "This episode sponsored by FREEDOM",
    "Like and subscribe or you're a lib",
    "We're going LIVE in 3... 2...",
  ],
  teen: [
    "Let's go to the phones",
    "BREAKING: I have an opinion",
    "Mainstream media won't cover this",
    "I've been saying this for YEARS",
    "Sources? I AM the source",
    "My ratings are through the ROOF",
  ],
  adult: [
    "Livestreaming from my private jet",
    "Debate me. Anywhere. Anytime.",
    "Facts don't care about your feelings",
    "Most important election of our lifetime",
    "I built this organization from NOTHING",
    "Call me Mr. Chairman",
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

// ═══ AUDIO ═══
let _ctx = null;
function getCtx() {
  if (!_ctx) {
    try { _ctx = new AudioContext(); } catch (e) { /* no audio */ }
  }
  return _ctx;
}

function tone(freq, dur, vol, type) {
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

// ═══ KIRK FACE ═══
function Kirk({ stage, mood, faceSize, frame, dark, scale }) {
  const s = scale || 1;
  const skin = dark ? "#9a8a70" : "#f4d0a8";
  const skinSh = dark ? "#7a6a50" : "#e8b888";
  const hair = dark ? "#1a0e04" : "#3d1f08";
  const outline = dark ? "#1a2a45" : "#14325a";
  const blush = dark ? "#a07060" : "#f0a8a0";
  const suitC = dark ? "#0a1830" : "#1a3a6a";
  const shirtC = dark ? "#888" : "#f0f0f0";

  const hr = (STAGES[stage] || STAGES.baby).head;
  const R = hr * s;
  const fs = Math.max(0.2, Math.min(1.6, faceSize || 1));
  const bob = [0, -0.5, -1, -0.5][(frame || 0) % 4] * s;
  const isEgg = stage === "egg";
  const isDead = mood === "dead";
  const isSleep = mood === "sleep";
  const hasSuit = stage === "teen" || stage === "adult";

  return (
    <g transform={"translate(0," + bob + ")"}>
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
          {!isDead && (
            <path d={"M " + (-R * 0.65) + " " + (-R * 0.82) + " Q " + (-R * 1.15) + " " + (-R * 1.45) + " " + (-R * 0.15) + " " + (-R * 1.02) + " Q " + (-R * 0.55) + " " + (-R * 1.3) + " " + (-R * 0.75) + " " + (-R * 0.88)} fill={hair} />
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
                <ellipse cx={-5 * s} cy={-4 * s} rx={2.2 * s} ry={2.2 * s} fill={outline} />
                <ellipse cx={5 * s} cy={-4 * s} rx={2.2 * s} ry={2.2 * s} fill={outline} />
                <circle cx={-4 * s} cy={-5 * s} r={0.8 * s} fill="#fff" opacity={0.6} />
                <circle cx={6 * s} cy={-5 * s} r={0.8 * s} fill="#fff" opacity={0.6} />
                <ellipse cx={0} cy={0} rx={1.2 * s} ry={1.8 * s} fill={skinSh} opacity={0.2} />
                {mood === "happy" ? (
                  <path d={"M " + (-5 * s) + " " + (4 * s) + " Q 0 " + (10 * s) + " " + (5 * s) + " " + (4 * s)} fill="#c06058" stroke={outline} strokeWidth={0.6 * s} />
                ) : mood === "sad" ? (
                  <path d={"M " + (-4 * s) + " " + (7 * s) + " Q 0 " + (3 * s) + " " + (4 * s) + " " + (7 * s)} fill="none" stroke={outline} strokeWidth={1.2 * s} strokeLinecap="round" />
                ) : mood === "angry" ? (
                  <g>
                    <line x1={-8 * s} y1={-8.5 * s} x2={-2 * s} y2={-6.5 * s} stroke={outline} strokeWidth={1.5 * s} strokeLinecap="round" />
                    <line x1={8 * s} y1={-8.5 * s} x2={2 * s} y2={-6.5 * s} stroke={outline} strokeWidth={1.5 * s} strokeLinecap="round" />
                    <path d={"M " + (-5 * s) + " " + (4 * s) + " Q 0 " + (9 * s) + " " + (5 * s) + " " + (4 * s)} fill="#c06058" stroke={outline} strokeWidth={0.6 * s} />
                  </g>
                ) : (
                  <line x1={-3 * s} y1={5 * s} x2={3 * s} y2={5 * s} stroke={outline} strokeWidth={1.2 * s} strokeLinecap="round" />
                )}
                {mood === "happy" && (
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
      <span style={{ fontSize: 11, animation: warn ? "pulse 0.6s infinite" : "none" }}>{icon}</span>
      <div style={{ flex: 1, height: 8, background: "#1a3a6a22", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: Math.max(0, value) + "%",
          background: value < 20 ? "#ef4444" : color,
          borderRadius: 4,
          transition: "width 0.5s ease",
          boxShadow: value < 20 ? "0 0 6px #ef444488" : "none",
        }} />
      </div>
    </div>
  );
}

// ═══ ACTION BUTTON ═══
function ABtn({ label, emoji, bg, onClick, off, sm }) {
  return (
    <button
      onClick={onClick}
      disabled={off}
      onPointerDown={e => { if (!off) e.currentTarget.style.transform = "scale(0.88)"; }}
      onPointerUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
      onPointerLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
      style={{
        width: sm ? 34 : 44, height: sm ? 34 : 44, borderRadius: "50%",
        background: "radial-gradient(circle at 38% 28%, " + bg + "ee, " + bg + "88 65%, #111)",
        border: "2px solid #0005",
        boxShadow: "0 3px 8px #0004, inset 0 1px 1px #fff2",
        cursor: off ? "not-allowed" : "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0,
        opacity: off ? 0.25 : 1,
        transition: "transform 0.06s, opacity 0.2s",
      }}
    >
      {emoji ? <span style={{ fontSize: sm ? 12 : 14, lineHeight: 1 }}>{emoji}</span> : null}
      <span style={{ fontSize: sm ? 5 : 6, fontFamily: "'Bangers',cursive", color: "#fff", textShadow: "0 1px 2px #0008", letterSpacing: 0.5 }}>{label}</span>
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
];

function DebateGame({ onDone, name, faceSize }) {
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
      // Spawn bubbles — speed ramps up
      const spawnRate = t > 10 ? 6 : t > 5 ? 4 : 3;
      if (fc.current % spawnRate === 0) {
        const arg = DEBATE_ARGS[Math.floor(Math.random() * DEBATE_ARGS.length)];
        setBubbles(p => [...p, {
          id: Math.random(),
          x: 195,
          y: 25 + Math.random() * 80,
          text: arg,
          speed: 1.5 + Math.random() * 1.5 + (15 - t) * 0.1,
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
          <Kirk stage="adult" mood="angry" faceSize={faceSize} scale={0.32} frame={fc.current % 4} />
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
function MemorialScreen({ pet, stats, onReset, frame }) {
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
          <Kirk stage={stageOf(pet.age)} mood="dead" faceSize={1} frame={frame} scale={0.55} />
        </g>

        {/* Name */}
        <text x="100" y="80" fontSize="12" fontFamily="'Bangers',cursive" fill="#fff" textAnchor="middle" letterSpacing="3">{pet.name}</text>

        {/* Life details */}
        <text x="100" y="92" fontSize="4.5" fontFamily="'Press Start 2P',monospace" fill="#fff6" textAnchor="middle">
          {highestStage.label} · {ageMin}m {ageSec}s
        </text>
        <text x="100" y="102" fontSize="4" fontFamily="'Press Start 2P',monospace" fill="#fff4" textAnchor="middle">
          Tweets: {stats.tweets || 0} · Libs owned: {stats.libsOwned || 0}
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
            🇺🇸 HATCH ANOTHER
          </button>
          <div style={{ fontSize: 8, color: "#fff3", fontFamily: "'Press Start 2P',monospace", marginTop: 4 }}>
            Kirks hatched: {hatched}
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
  const [faceSlider, setFaceSlider] = useState(1.0);
  const [kFlash, setKFlash] = useState(false);
  const [shake, setShake] = useState(false);
  const [kirkifyIdx, setKirkifyIdx] = useState(0);
  const [idleMsg, setIdleMsg] = useState("");
  const [stats, setStats] = useState({ tweets: 0, libsOwned: 0 });
  const [showMemorial, setShowMemorial] = useState(false);

  // Load saved data (with v6 migration)
  useEffect(() => {
    var d = storage.get("kirk_v7");
    if (!d) {
      // Try migrating from old format
      try {
        const old = localStorage.getItem("kirk_v6");
        if (old) {
          const parsed = JSON.parse(old);
          d = { p: parsed.p, pp: parsed.pp, lg: parsed.lg, fs: 1.0, st: { tweets: 0, libsOwned: 0 } };
          storage.set("kirk_v7", d);
          localStorage.removeItem("kirk_v6");
        }
      } catch(e) {}
    }
    if (d) {
      setPet(d.p || null);
      setPoops(d.pp || []);
      setLog(d.lg || []);
      setFaceSlider(d.fs != null ? d.fs : 1.0);
      setStats(d.st || { tweets: 0, libsOwned: 0 });
      if (d.p && !d.p.alive) setShowMemorial(true);
    }
    setLoaded(true);
  }, []);

  const save = useCallback((p, pp, lg, fs, st) => {
    storage.set("kirk_v7", { p, pp: pp || [], lg: lg || [], fs: fs != null ? fs : 1.0, st: st || { tweets: 0, libsOwned: 0 } });
  }, []);

  const addLog = useCallback((text) => {
    setLog(prev => [{ t: text, d: Date.now() }, ...prev].slice(0, 60));
  }, []);

  const doShake = () => { setShake(true); setTimeout(() => setShake(false), 120); };

  // Frame animation
  useEffect(() => {
    const iv = setInterval(() => setFrame(f => (f + 1) % 4), 350);
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
    if (!pet || !pet.alive || rally || lightsOff) return;
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
    if (!pet || !pet.alive || rally) return;
    const iv = setInterval(() => {
      setPet(prev => {
        if (!prev || !prev.alive) return prev;
        var n = {
          ...prev,
          age: prev.age + 1,
          hunger: Math.max(0, prev.hunger - 0.2),
          happiness: Math.max(0, prev.happiness - (lightsOff ? 0.03 : 0.11)),
          energy: Math.min(100, prev.energy + (lightsOff ? 0.32 : -0.05)),
          clout: Math.max(0, prev.clout - 0.06),
        };

        // Death check
        if (n.hunger <= 0 && n.happiness <= 0 && n.energy <= 0) {
          n.alive = false;
          sfxDie();
          addLog("💀 Gone to Valhalla...");
          // Increment hatched counter
          const hatched = storage.get("kirks_hatched") || 0;
          storage.set("kirks_hatched", hatched + 1);
          setTimeout(() => setShowMemorial(true), 1500);
        }

        // Random poop
        if (Math.random() < 0.003 && !lightsOff) {
          setPoops(pp => pp.length < 5 ? [...pp, {
            id: Math.random(),
            x: 55 + Math.random() * 40,
            y: 50 + Math.random() * 30,
          }] : pp);
          n.clout = Math.max(0, n.clout - 4);
        }

        // Evolution check
        var oldStage = stageOf(prev.age);
        var newStage = stageOf(n.age);
        if (oldStage !== newStage) {
          sfxEvolve();
          setEvolveFlash(true);
          setTimeout(() => setEvolveFlash(false), 600);
          addLog("🎉 Promoted to " + STAGES[newStage].label + "!");
        }

        return n;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [pet, lightsOff, rally, addLog]);

  // Auto-save
  useEffect(() => {
    if (!pet) return;
    const iv = setInterval(() => save(pet, poops, log, faceSlider, stats), 3000);
    return () => clearInterval(iv);
  }, [pet, poops, log, faceSlider, stats, save]);

  // Actions
  const doAction = useCallback((type) => {
    if (!pet || !pet.alive || act || rally) return;
    setAct(type);
    doShake();

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
      setView("kirkify");
      setPet(p => ({
        ...p,
        happiness: Math.min(100, p.happiness + 3),
        clout: Math.min(100, p.clout + 3),
      }));
      addLog("👤 KIRKIFIED!");
      setMsg("👤 KIRKIFIED!");
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
      }
      if (type === "tweet") {
        n.happiness = Math.min(100, n.happiness + 9);
        n.clout = Math.min(100, n.clout + 13);
        var tw = TWEETS[Math.floor(Math.random() * TWEETS.length)];
        setMsg(tw);
        addLog("📱 " + tw);
        setParticles(p => [...p, ...mkParticles(50, 38, "#1da1f2")]);
        setStats(s => ({ ...s, tweets: (s.tweets || 0) + 1 }));
      }
      if (type === "clean") {
        n.clout = 100;
        setPoops([]);
        setMsg("✨ Based & clean!");
        addLog("🧹 Cleaned up");
        setParticles(p => [...p, ...mkParticles(50, 50, "#3b82f6")]);
      }
      if (type === "own") {
        if (n.energy < 10) { setMsg("⚡ Need energy!"); setAct(null); return prev; }
        n.happiness = Math.min(100, n.happiness + 16);
        n.energy = Math.max(0, n.energy - 7);
        n.clout = Math.min(100, n.clout + 14);
        setDearIdx(Math.floor(Math.random() * DEAR_LIBS.length));
        setView("meme");
        addLog("💥 Owned the libs");
        setParticles(p => [...p, ...mkParticles(50, 40, "#dc2626")]);
        setStats(s => ({ ...s, libsOwned: (s.libsOwned || 0) + 1 }));
      }
      return n;
    });

    setTimeout(() => { setAct(null); setMsg(""); }, 1500);
  }, [pet, act, rally, lightsOff, addLog]);

  const endRally = useCallback((sc, misses) => {
    setRally(false);
    setPet(p => ({
      ...p,
      happiness: Math.min(100, p.happiness + Math.min(sc * 3, 25)),
      energy: Math.max(0, p.energy - 8),
      clout: Math.min(100, p.clout + sc * 2),
    }));
    setStats(s => ({ ...s, libsOwned: (s.libsOwned || 0) + sc }));
    addLog("🎤 Debate: " + sc + " destroyed");
    setMsg(sc > 12 ? "🔥 ABSOLUTELY DESTROYED!" : sc > 7 ? "💪 Based!" : "😐 Low energy...");
    setTimeout(() => setMsg(""), 1200);
  }, [addLog]);

  const createPet = useCallback((name) => {
    var p = { name: name, hunger: 80, happiness: 80, energy: 100, clout: 70, age: 0, alive: true, born: Date.now() };
    var lg = [{ t: "🇺🇸 " + name + " joined TPUSA!", d: Date.now() }];
    var st = { tweets: 0, libsOwned: 0 };
    setPet(p);
    setPoops([]);
    setLog(lg);
    setStats(st);
    setFaceSlider(1.0);
    setShowMemorial(false);
    save(p, [], lg, 1.0, st);
    setMsg(name + " has arrived!");
    sfxHatch();
    setTimeout(() => setMsg(""), 1800);
  }, [save]);

  const reset = useCallback(() => {
    storage.del("kirk_v7");
    setPet(null);
    setPoops([]);
    setLog([]);
    setMsg("");
    setLightsOff(false);
    setRally(false);
    setView("pet");
    setFaceSlider(1.0);
    setShowMemorial(false);
    setStats({ tweets: 0, libsOwned: 0 });
  }, []);

  // Face slider comment
  const [faceComment, setFaceComment] = useState("");
  const faceCommentRef = useRef(null);
  const handleFaceSlider = useCallback((val) => {
    setFaceSlider(val);
    if (faceCommentRef.current) clearTimeout(faceCommentRef.current);
    var comment = "";
    if (val < 0.4) comment = "My face is NORMAL SIZED";
    else if (val > 1.3) comment = "ENHANCE";
    else if (Math.round(val * 100) === 69) comment = "Nice.";
    if (comment) {
      setFaceComment(comment);
      faceCommentRef.current = setTimeout(() => setFaceComment(""), 2000);
    } else {
      setFaceComment("");
    }
  }, []);

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
          <MemorialScreen pet={pet} stats={stats} onReset={reset} frame={frame} />
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
  var displayMsg = msg || idleMsg;

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
        .shell{animation:glow 2.8s ease-in-out infinite}
        .view-enter{animation:fadeIn 0.25s ease-out}
      `}</style>

      {/* Stars bg */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        {Array.from({ length: 25 }, (_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: ((i * 29 + 11) % 100) + "%",
            top: ((i * 43 + 7) % 100) + "%",
            width: i % 4 === 0 ? 2.5 : 1.5,
            height: i % 4 === 0 ? 2.5 : 1.5,
            background: "#fff",
            borderRadius: "50%",
            opacity: 0.12 + Math.sin(i) * 0.1,
          }} />
        ))}
      </div>

      {/* Device shell */}
      <div className="shell" style={{
        background: "linear-gradient(165deg, #e8e8e8 0%, #b0b0b0 8%, #c41e3a 35%, #8b1525 60%, #1a3a6a 85%, #0d2240 100%)",
        borderRadius: "28px 28px 42px 42px",
        padding: 4,
        maxWidth: 360,
        width: "100%",
      }}>
        <div style={{
          background: "linear-gradient(168deg, #d4d4d4 0%, #c41e3a 25%, #9b1228 50%, #1a3a6a 80%, #0d2240 100%)",
          borderRadius: "24px 24px 38px 38px",
          padding: "10px 8px 14px",
        }}>
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 22, color: "#fff", letterSpacing: 3, textShadow: "0 2px 8px #0008, 0 0 12px #c41e3a55" }}>KIRKOGOTCHI</span>
          </div>

          {/* Screen */}
          <div style={{ background: "#0a0a0a", borderRadius: 10, padding: 4, boxShadow: "inset 0 2px 8px #000a" }}>
            <div style={{
              background: dark ? "#2a3550" : "#dce8f5",
              borderRadius: 7,
              overflow: "hidden",
              transition: "background 0.4s",
              animation: kFlash ? "kf 0.2s ease" : "none",
              transform: shake ? "translate(1px,-1px)" : "none",
            }}>
              {rally ? (
                <DebateGame onDone={endRally} name={pet.name} faceSize={fs} />
              ) : view === "kirkify" ? (
                <div style={{ borderRadius: 8, overflow: "hidden" }} onClick={() => { setKirkifyIdx(i => (i + 1) % KIRKIFY_TEMPLATES.length); sfxKirkify(); }}>
                  {KIRKIFY_TEMPLATES[kirkifyIdx].render(fs, frame)}
                  <div style={{ background: "#0d2240", padding: "4px 0", textAlign: "center" }}>
                    <span style={{ fontSize: 5, fontFamily: "'Press Start 2P',monospace", color: "#fff5" }}>TAP FOR MORE · {KIRKIFY_TEMPLATES[kirkifyIdx].name}</span>
                  </div>
                </div>
              ) : view === "meme" ? (
                <DearLib data={DEAR_LIBS[dearIdx]} fs={fs} />
              ) : view === "log" ? (
                <div style={{ padding: 8, minHeight: 120 }}>
                  <div style={{ fontSize: 12, color: "#1a3a6a", textAlign: "center", marginBottom: 6, fontFamily: "'Bangers',cursive", letterSpacing: 2 }}>Activity Log</div>
                  {log.slice(0, 8).map((e, i) => (
                    <div key={i} style={{ fontSize: 7, fontFamily: "'Press Start 2P',monospace", color: "#1a3a6a", opacity: 1 - i * 0.08, marginBottom: 2, lineHeight: 1.6 }}>
                      {new Date(e.d).toLocaleTimeString().slice(0, 5)} {e.t}
                    </div>
                  ))}
                  {log.length === 0 && <div style={{ textAlign: "center", fontSize: 8, color: "#1a3a6a44", fontFamily: "'Press Start 2P',monospace", marginTop: 30 }}>No entries yet</div>}
                </div>
              ) : (
                /* ═══ PET VIEW ═══ */
                <div style={{ position: "relative", minHeight: 135 }}>
                  <div style={{ textAlign: "center", padding: "6px 0 2px" }}>
                    <div style={{ fontSize: 13, color: dark ? "#8a9abc" : "#1a3a6a", fontFamily: "'Bangers',cursive", letterSpacing: 2 }}>{pet.name}</div>
                    <div style={{ fontSize: 6, color: dark ? "#5a6a8a" : "#1a3a6a88", fontFamily: "'Press Start 2P',monospace" }}>
                      {pet.alive ? (STAGES[stage] ? STAGES[stage].label : stage) + " · " + Math.floor(pet.age / 60) + "m" : "† IN VALHALLA †"}
                    </div>
                  </div>

                  <svg viewBox="0 0 100 90" style={{ display: "block", width: "100%", maxHeight: 110 }}>
                    {evolveFlash && (
                      <rect width="100" height="90" fill="#fff" opacity={0.4}>
                        <animate attributeName="opacity" from="0.5" to="0" dur="0.6s" fill="freeze" />
                      </rect>
                    )}
                    <g transform="translate(50, 38)">
                      <Kirk stage={stage} mood={act === "own" ? "angry" : mood} faceSize={fs} frame={frame} dark={dark} />
                    </g>
                    {mood === "sleep" && (
                      <g>
                        <text x="72" y="28" fontSize="5" fontFamily="'Bangers',cursive" fill={dark ? "#5a6a8a" : "#1a3a6a"} opacity={frame < 2 ? 0.5 : 0.2}>z</text>
                        <text x="78" y="20" fontSize="8" fontFamily="'Bangers',cursive" fill={dark ? "#5a6a8a" : "#1a3a6a"} opacity={frame < 2 ? 0.3 : 0.5}>Z</text>
                        <text x="85" y="14" fontSize="10" fontFamily="'Bangers',cursive" fill={dark ? "#5a6a8a" : "#1a3a6a"} opacity={frame >= 2 ? 0.3 : 0.4}>Z</text>
                      </g>
                    )}
                    {poops.map(p => <text key={p.id} x={p.x} y={p.y} fontSize="6">💩</text>)}
                    {particles.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={1.2} fill={p.c} opacity={p.l / p.ml} />)}
                  </svg>

                  {!pet.alive && (
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#0d2240ee", padding: "8px 6px 6px", borderRadius: "0 0 7px 7px", textAlign: "center" }}>
                      <div style={{ fontSize: 7, fontFamily: "'Press Start 2P',monospace", color: "#c41e3a", lineHeight: 1.8 }}>Gone to Valhalla...</div>
                      <div style={{ fontSize: 10, fontFamily: "'Bangers',cursive", color: "#fff", letterSpacing: 3, marginTop: 3, opacity: frame < 2 ? 0.8 : 0.4 }}>WE ARE CHARLIE KIRK</div>
                    </div>
                  )}

                  {displayMsg && pet.alive && (
                    <div style={{
                      position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)",
                      background: msg ? "#1a3a6aee" : "#1a3a6acc",
                      color: "#fff", padding: "4px 12px", borderRadius: 6,
                      fontSize: 7, fontFamily: "'Press Start 2P',monospace",
                      whiteSpace: "nowrap", maxWidth: "90%", overflow: "hidden", textOverflow: "ellipsis",
                      boxShadow: "0 2px 10px #0005",
                      animation: "slideUp 0.2s ease-out",
                    }}>{displayMsg}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Face slider */}
          {pet.alive && (
            <div style={{ margin: "5px 4px 0", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 14 }}>🤏</span>
              <input
                type="range"
                min="20"
                max="150"
                value={Math.round(faceSlider * 100)}
                onChange={e => handleFaceSlider(Number(e.target.value) / 100)}
                style={{ flex: 1, accentColor: "#c41e3a", height: 16, cursor: "grab", display: "block" }}
              />
              <span style={{ fontSize: 14 }}>😱</span>
            </div>
          )}
          {pet.alive && (
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 8, color: "#fff5", fontFamily: "'Bangers',cursive", letterSpacing: 1 }}>
                FACE SIZE: {Math.round(faceSlider * 100)}%{faceComment ? " — " + faceComment : ""}
              </span>
            </div>
          )}

          {/* Stat bars */}
          {pet.alive && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 8px", margin: "4px 6px" }}>
              <Bar icon="🍔" value={pet.hunger} color="#c41e3a" warn={pet.hunger < 20} />
              <Bar icon="⭐" value={pet.happiness} color="#d97706" warn={pet.happiness < 20} />
              <Bar icon="⚡" value={pet.energy} color="#2563eb" warn={pet.energy < 15} />
              <Bar icon="📢" value={pet.clout} color="#7c3aed" warn={pet.clout < 20} />
            </div>
          )}

          {/* Nav */}
          <div style={{ display: "flex", justifyContent: "center", gap: 3, margin: "4px 0" }}>
            {[["pet", "🏠"], ["kirkify", "👤"], ["meme", "📝"], ["log", "📜"]].map(function([k, ic]) {
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
                    borderRadius: 10,
                    color: view === k ? "#fff" : "#fff8",
                    fontSize: 18,
                    padding: "2px 14px",
                    cursor: "pointer",
                    transition: "all 0.12s",
                  }}
                >
                  {ic}
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          {pet.alive ? (
            <div>
              {/* Main actions */}
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 4 }}>
                <ABtn label="FEED" emoji="🍔" bg="#c41e3a" onClick={() => doAction("feed")} off={!!act || rally} />
                <ABtn label="TWEET" emoji="📱" bg="#1da1f2" onClick={() => doAction("tweet")} off={!!act || rally} />
                <ABtn label="DEBATE" emoji="🎤" bg="#7c3aed" onClick={() => doAction("rally")} off={!!act || rally} />
                <ABtn label="OWN" emoji="💥" bg="#dc2626" onClick={() => doAction("own")} off={!!act || rally} />
                <ABtn label="KIRKIFY" emoji="👤" bg="#f59e0b" onClick={() => doAction("kirkify")} off={!!act || rally} />
              </div>
              {/* Utility row */}
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 4, alignItems: "center" }}>
                <div style={{ position: "relative" }}>
                  <ABtn label="CLEAN" emoji="🧹" bg="#3b82f6" onClick={() => doAction("clean")} off={!!act || rally || poops.length === 0} sm />
                  {poops.length > 0 && (
                    <div style={{
                      position: "absolute", top: -2, right: -2,
                      background: "#ef4444", borderRadius: "50%",
                      width: 14, height: 14, fontSize: 8, color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Bangers',cursive",
                      boxShadow: "0 1px 3px #0005",
                      animation: "pulse 1s infinite",
                    }}>{poops.length}</div>
                  )}
                </div>
                <ABtn label={lightsOff ? "ON" : "OFF"} emoji={lightsOff ? "☀️" : "🌙"} bg="#334155" onClick={() => doAction("light")} off={!!act || rally} sm />
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
              <ABtn label="NEW KIRK" emoji="🇺🇸" bg="#c41e3a" onClick={reset} />
            </div>
          )}

          {pet.alive && (
            <div style={{ textAlign: "center", marginTop: 4 }}>
              <button onClick={reset} style={{ background: "none", border: "none", color: "#fff2", fontSize: 7, fontFamily: "'Bangers',cursive", cursor: "pointer", letterSpacing: 1 }}>RESET</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══ START SCREEN ═══
function StartScreen({ onCreate }) {
  const [name, setName] = useState("CHARLIE");
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
                  <Kirk stage="adult" mood="happy" faceSize={dfs} frame={f} scale={0.95} />
                </g>
              </svg>
              <div style={{ fontSize: 10, color: "#1a3a6a88", letterSpacing: 1, marginTop: 2 }}>face: {Math.round(dfs * 100)}%</div>
              <div style={{ fontSize: 9, color: "#1a3a6a", letterSpacing: 1, marginTop: 6, marginBottom: 4 }}>Name your Kirk</div>
              <input
                type="text"
                maxLength={10}
                value={name}
                onChange={e => setName(e.target.value.toUpperCase())}
                onKeyDown={e => { if (e.key === "Enter" && name.trim()) onCreate(name.trim()); }}
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
            <ABtn label="HATCH" emoji="🇺🇸" bg="#c41e3a" onClick={() => { if (name.trim()) onCreate(name.trim()); }} off={!name.trim()} />
          </div>
          <div style={{ fontSize: 9, color: "#fff3", marginTop: 10, lineHeight: 1.8, fontFamily: "'Press Start 2P',monospace" }}>
            Keep him fed · Keep him tweeting
            <br />
            Keep his face the right size
          </div>
          {hatched > 0 && (
            <div style={{ fontSize: 8, color: "#c41e3a55", fontFamily: "'Press Start 2P',monospace", marginTop: 6 }}>
              Kirks lost: {hatched}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
