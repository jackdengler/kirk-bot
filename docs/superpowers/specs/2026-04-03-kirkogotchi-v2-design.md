# Kirkogotchi v2 — "Have You Seen My Kirkie?"

## Context

Kirkogotchi is a Tamagotchi parody where you raise a pixel Charlie Kirk through life stages (Intern → Blogger → Podcaster → Pundit → TPUSA CEO). The app already has: feeding, tweeting, stat bars, a face-size slider, a "Dear Liberals" meme viewer, a mini-game, evolution stages, and a death screen.

Charlie Kirk was assassinated Sept 10, 2025 at Utah Valley University. Since then, "Kirkification" (face-swapping his face onto everything) became a massive meme trend, and the AI-generated tribute song "We Are Charlie Kirk" went viral on TikTok (58K+ videos). The app leans into this culture — irreverent love, dark humor as tribute.

## Goals

1. Make people emotionally attached to their stupid little Kirk so that when he dies, they screenshot and share
2. Create shareable moments (Kirkified meme cards, memorial death screen)
3. More personality and humor in the Tamagotchi loop
4. Ship to PWA at https://jackdengler.github.io/kirk-bot/

## Non-Goals

- No backend, accounts, leaderboards
- No actual audio files — chiptune via WebAudio only
- No AI generation at runtime
- Desktop pet / sniper defense mode is a future phase, not this build

---

## Changes

### 1. Kirkify Button → Shareable Kirkified Meme Cards

**Current:** Flashes the screen, adds +7 happiness and +5 clout. Visually boring.

**New:** Tapping KIRKIFY cycles through pre-built Kirkified meme templates rendered as SVG inside the app screen area. Each template is Kirk's face composited onto a recognizable meme format or celebrity silhouette.

Templates (8-10 to start):
- Kirk face on Mona Lisa
- Kirk face on Mount Rushmore (all four faces)
- Kirk face on "This Is Fine" dog
- Kirk face on Gigachad silhouette
- Kirk face on the "Distracted Boyfriend" guy
- Kirk face on a dollar bill (replacing Washington)
- Kirk face on the Statue of Liberty
- Kirk face on a bodybuilder flexing

Behavior:
- Each tap cycles to next random template
- The current face-size slider value applies to the Kirkified image (tiny face Kirk on Mona Lisa = comedy gold)
- Still gives small stat boosts (+3 happiness, +3 clout)
- A small "KIRKIFIED!" toast appears

Shareability: The meme card fills the screen area so a screenshot captures it cleanly. No share API needed — screenshots are how memes spread.

### 2. Death → Full Memorial Experience

**Current:** X eyes, halo, wings, "Rest now brother" Kash Patel quote, "SEE YOU IN VALHALLA" blinking text.

**New:** Multi-beat death sequence:

**Beat 1 — The Moment (1.5s):**
- Screen flashes white
- Kirk's face slowly shrinks to nothing (face-size animates to 0)
- All stat bars drain simultaneously
- A single low tone plays

**Beat 2 — Memorial Card (stays until user taps):**
- Background shifts to solemn dark blue
- "In Loving Memory" header in gold Bangers font
- Kirk's name, life stages achieved, age survived, total tweets sent, libs owned count
- "We Are Charlie Kirk" chiptune melody plays (8-bit rendition of the chorus, looping)
- Pixel candlelight vigil: 5-6 tiny pixel mourners with flickering candle dots at the bottom
- Small pixel American flag at half-mast
- Quote: random from pool of parody eulogy lines:
  - "He tweeted so we didn't have to." 
  - "His face was the perfect size." — God
  - "Rest now, brother. We have the watch." — Kash Patel
  - "He owned every lib. Every. Single. One."
  - "Valhalla just got a LOT more based."
  - "The ratio... is finally 1:1."

**Beat 3 — "New Kirk" button appears:**
- "HATCH ANOTHER" button fades in after 3 seconds
- Below it: "Kirks hatched: N" (lifetime counter stored in localStorage)

The memorial card is designed to be screenshot bait — it looks like a real memorial graphic but absurd.

### 3. Kirk Has Personality — Stage-Based Idle Dialogue

Random speech bubbles appear above Kirk every 15-30 seconds while idle. Different per stage:

**Intern (egg):**
- "Is this where the free pizza is?"
- "I'm just here for the resume line"
- "Who do I email about the parking pass"
- "Unpaid but PASSIONATE"

**Blogger (baby):**
- "Just hit 200 followers, basically famous"
- "My Substack is gonna blow up"
- "Hot take incoming..."
- "Actually, I think you'll find..."

**Podcaster (child):**
- "Welcome back to the show, folks"
- "Smash that subscribe button"
- "My guest today is... me"
- "This episode is sponsored by FREEDOM"

**Pundit (teen):**
- "Let's go to the phones"
- "BREAKING: I have an opinion"
- "The mainstream media won't cover this"
- "I've been saying this for YEARS"

**TPUSA CEO (adult):**
- "I will be livestreaming from my private jet"
- "Debate me. Anywhere. Anytime."
- "Facts don't care about your feelings"
- "This is the most important election of our lifetime"

**Neglect reactions (any stage, triggered by low stats):**
- Hunger < 20: "You call this FREEDOM? I'm STARVING"
- Happiness < 20: "Even Ben Shapiro texts me back faster"
- Energy < 15: "I haven't slept since the Obama administration"
- Clout < 20: "I'm being CENSORED"
- Multiple low: "This is literally 1984"

These replace the current `msg` system for idle chatter. Action messages (feed, tweet, etc.) still override temporarily.

### 4. Mini-Game → "Debate Me, Coward"

**Current:** "Own the Libs" — move Kirk left/right, catch falling lib emojis for 10 seconds. Generic.

**New:** "Debate Me, Coward" — Kirk stands at a podium on one side. Lib arguments fly in as speech bubbles from the right side. Tap each bubble before it reaches Kirk to "destroy" it. 

- Arguments are short text in bubbles: "healthcare?", "climate!", "pronouns!", "tax the rich", "actually...", "source?", "cope", "ratio"
- Tapping a bubble pops it with a "DESTROYED" particle effect
- Missing a bubble = Kirk takes a hit (podium shakes, he flinches)
- 15 seconds, speed ramps up
- Score = bubbles destroyed
- End screen: "N ARGUMENTS DESTROYED" with rating (LOW ENERGY / BASED / ABSOLUTELY DESTROYED)
- Still gives stat boosts based on score

Same basic structure (timed, tap-based, gives rewards) but more thematic and funnier.

### 5. Face Slider — Cosmetic Only

**Current:** Tied to overall health (autoFS). Slider overrides but defaults back.

**New:** 
- Slider is purely cosmetic, always manual
- Defaults to 100% on new Kirk
- Kirk comments when you move it to extremes:
  - Below 40%: "My face is NORMAL SIZED"
  - Above 130%: "ENHANCE"
  - At exactly 69%: "Nice."
- Face size persists across sessions (saved with pet data)
- Face size applies everywhere: pet view, Kirkified memes, death memorial, mini-game

### 6. Storage Fix

**Current:** Uses `window.storage` which doesn't exist in a plain browser. The app can't save.

**New:** Use localStorage directly:
- `localStorage.getItem("kirk_v6")` / `localStorage.setItem("kirk_v6", ...)`
- Add `kirksHatched` counter in localStorage for the death screen lifetime stat

---

## Architecture

Single file: `kirkogotchi.jsx`. No build step, no dependencies beyond React 18 UMD + Babel standalone loaded in `index.html`.

New code sections to add/modify:
- `IDLE_DIALOGUE` — config object keyed by stage
- `NEGLECT_LINES` — config object keyed by stat
- `KIRKIFY_TEMPLATES` — array of SVG-rendering functions
- `MEMORIAL_QUOTES` — array of strings
- `weAreCharlieKirk()` — WebAudio function that plays the chiptune melody
- `DebateGame` component — replaces `Rally`
- `MemorialScreen` component — replaces current death overlay
- `KirkifyView` component — replaces current no-op kirkify action
- Modified `Kirkogotchi` main component — idle dialogue timer, storage fix, face slider decoupled from stats

## What We're NOT Changing

- The Kirk SVG face rendering (it's good)
- The Tamagotchi stat loop (hunger/happiness/energy/clout drain rates)
- The evolution stages and thresholds
- The "Dear Liberals" meme viewer
- The device shell styling
- The sound effect system (just adding to it)
- The star background
- The activity log

---

## Future Phase (not this build)

- Desktop pet mode: Kirk lives in corner of screen, sniper appears, defend with cursor
- Share API integration (Web Share API for mobile)
- More Kirkify templates
- Achievements / badges
