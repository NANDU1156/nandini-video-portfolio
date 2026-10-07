#!/usr/bin/env python3
"""Turn intro.mp4 into a seamless looping hero clip + portrait + OG image.
Usage: python3 scripts/build-hero-assets.py [intro.mp4] [--crop=W:H:X:Y]
Needs: ffmpeg, ffprobe, numpy.  Outputs to public/."""
import subprocess, sys, json, wave, tempfile, os
import numpy as np

SRC = next((a for a in sys.argv[1:] if not a.startswith("--")), "scripts/intro.mp4")
CROP = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--crop=")), None)
OUT, MAXLEN, FADE = "public", 10.0, 0.5
SR = 48000

def run(*a, **k): return subprocess.run(a, check=True, **k)

info = json.loads(run("ffprobe", "-v", "error", "-show_entries", "stream=width,height,duration",
                      "-select_streams", "v:0", "-of", "json", SRC, capture_output=True).stdout)["streams"][0]
W, H, DUR = int(info["width"]), int(info["height"]), float(info["duration"])
T = min(DUR, MAXLEN)

# 1. Detect the person: union of non-background pixels over sampled frames
raw = run("ffmpeg", "-v", "error", "-i", SRC, "-vf", "fps=3", "-f", "rawvideo", "-pix_fmt", "rgb24", "-",
          capture_output=True).stdout
frames = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3)
mask = (frames.min(axis=3) < 150).any(axis=0)          # dark pixels = clothing/hair/shoes
rows, cols = np.where(mask.sum(1) > 3)[0], np.where(mask.sum(0) > 3)[0]
top, bot, left, right = rows.min(), rows.max(), cols.min(), cols.max()
bh, cx = bot - top, (left + right) / 2
if CROP:
    cw, ch, cx0, cy0 = map(int, CROP.split(":"))
else:                                                    # aspect 768:960 = 0.8, centred on the person
    ch = min(H, int(bh * 1.06) // 2 * 2); cw = int(ch * 0.8) // 2 * 2
    cx0 = int(min(max(cx - cw / 2, 0), W - cw)); cy0 = int(min(max(top - bh * 0.03, 0), H - ch))
# Backdrop level: 5th percentile of the left/right edge strips (always background). The white point is
# set just under it so the whole backdrop clips to pure white and multiply-blends into the page.
strip = np.concatenate([frames[:, :, : int(W * 0.08)].reshape(-1, 3), frames[:, :, -int(W * 0.08):].reshape(-1, 3)])
bg = np.percentile(strip, 5, axis=0) / 255.0
WP = float(np.clip(bg.min() - 0.01, 0.80, 0.98))
LV = f"colorlevels=rimax={WP:.3f}:gimax={WP:.3f}:bimax={WP:.3f}"
print(f"backdrop level {bg.round(3)} -> white point {WP:.3f}")
print(f"person bbox y {top}-{bot}, x {left}-{right}; crop {cw}:{ch}:{cx0}:{cy0}")
base = f"crop={cw}:{ch}:{cx0}:{cy0},scale=768:960:flags=lanczos,{LV},fps=24"

tmp = tempfile.mkdtemp()
# 2. Audio cross-fade in numpy (equal-power, sample accurate). Output = x[F:T] with its tail blended into x[0:F]
pcm = run("ffmpeg", "-v", "error", "-i", SRC, "-t", str(T), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-",
          capture_output=True).stdout
x = np.frombuffer(pcm, np.float32).reshape(-1, 2)
n, f = int(T * SR), int(FADE * SR)
x = x[:n] if len(x) >= n else np.pad(x, ((0, n - len(x)), (0, 0)))
a = x[f:]
t = np.linspace(0, np.pi / 2, f)[:, None]
a = np.concatenate([a[:-f], a[-f:] * np.cos(t) + x[:f] * np.sin(t)])
wav = os.path.join(tmp, "loop.wav")
with wave.open(wav, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(a, -1, 1) * 32767).astype("<i2").tobytes())

# 3. Video cross-fade (same length as the audio: T - FADE)
fc = (f"[0:v]{base},split[a][b];[a]trim=start={FADE}:end={T},setpts=PTS-STARTPTS[a1];"
      f"[b]trim=start=0:end={FADE},setpts=PTS-STARTPTS[b1];"
      f"[a1][b1]xfade=transition=fade:duration={FADE}:offset={T - 2 * FADE},format=yuv420p[v]")
common = ["ffmpeg", "-v", "error", "-y", "-i", SRC, "-i", wav, "-filter_complex", fc, "-map", "[v]", "-map", "1:a", "-shortest"]
os.makedirs(f"{OUT}/hero", exist_ok=True)
run(*common, "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k",
    "-movflags", "+faststart", f"{OUT}/hero/hero.mp4")
run(*common, "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-c:a", "libopus", "-b:a", "80k", f"{OUT}/hero/hero.webm")

# 4. Portrait (head to shirt, 480x600) + OG image (1200x630) from the first frame
bust_h = int(bh * 0.30); bust_w = int(bust_h * 0.8)
px = int(min(max(cx - bust_w / 2, 0), W - bust_w)); py = int(max(top - bh * 0.035, 0))
lv = LV
run("ffmpeg", "-v", "error", "-y", "-i", SRC, "-frames:v", "1",
    "-vf", f"crop={bust_w}:{bust_h}:{px}:{py},scale=480:600:flags=lanczos,{lv}", f"{OUT}/portrait-bust.webp")
run("ffmpeg", "-v", "error", "-y", "-i", SRC, "-frames:v", "1",
    "-vf", f"crop={cw}:{ch}:{cx0}:{cy0},scale=-2:630:flags=lanczos,{lv},pad=1200:630:(ow-iw)/2:0:white", "-q:v", "3", f"{OUT}/og.jpg")
print("done")
