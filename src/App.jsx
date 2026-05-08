import EmberLogo from './components/EmberLogo.jsx'

/* ── Logo in hero ── */
function LogoWindow() {
  return (
    <div className="logo-wrap">
      <EmberLogo size={150} />
    </div>
  )
}

function PageDivider() {
  return <div className="page-divider" />
}

/* ── Hero ── */
function HeroContent() {
  return (
    <div className="hero-layout">
      <div>
        <div className="accent-bar" />
        <h1 className="pixel-heading hero-title">
          C106A/206A<br />Final Project:<br />Ember Robotics
        </h1>
        <p className="hero-team">
          Team 10<br />
          Erik De Jesus Rodriguez Silva<br />
          Vardaan Tekriwal<br />
          Logan Kinajil-Moran<br />
          Daniel Wiley Richards<br />
          Santiago Rocha
        </p>
      </div>
      <LogoWindow />
    </div>
  )
}

/* ── Project Overview ── */
function OverviewContent() {
  return (
    <div>
      <h2 className="section-title">Project Overview</h2>
      <div className="two-col-wide">
        <div>
          <p className="mono-body" style={{ marginBottom: 20 }}>
            An industry project in collaboration with{' '}
            <strong>Ember Robotics</strong> to extend previous work on
            glass slide transfer — this time targeting{' '}
            <strong>silicon wafers</strong> with tighter tolerances and
            new perception challenges.
          </p>
          <ul className="bullet-list">
            <li>Design a custom wafer gripper end-effector</li>
            <li>Write a computer vision module to detect wafer position inside storage trays</li>
            <li>Perform autonomous pick-and-place using inverse kinematics</li>
          </ul>
          <div className="sub-section">
            <p className="sub-section-title">Hardware</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Techman TM12 arm', 'RealSense D435i', 'Arduino gripper', 'ROS 2'].map(t => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="img-frame">
          <img src="/robot_arm.jpg" alt="TM12 robot arm" onError={e => { e.target.style.display = 'none' }} />
          <div style={{
            aspectRatio: '3/4',
            background: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, color: '#555', textAlign: 'center', lineHeight: 2, padding: 16 }}>
              Techman TM12<br />Collaborative Arm
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Wafer Gripper ── */
function WaferGripperContent() {
  return (
    <div>
      <h2 className="section-title">Wafer Gripper</h2>
      <div className="two-col">
        {/* Design */}
        <div>
          <p className="sub-section-title" style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, color: '#666', marginBottom: 14, letterSpacing: 1 }}>DESIGN</p>
          <ul className="bullet-list">
            <li>Total clearance ~5 mm between gripper fingers and wafer slot walls</li>
            <li>Reuses existing servo and attachment points to reduce mechanical risk</li>
            <li>3D-printed PLA body with gear-driven symmetric jaw closure</li>
            <li>Rigorous testing to eliminate drag and gear backlash</li>
            <li>Electrical tape on contact surfaces for grip (proof-of-concept)</li>
          </ul>

          <div className="sub-section">
            <p className="sub-section-title" style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, color: '#666', marginBottom: 14, letterSpacing: 1 }}>FUTURE IMPROVEMENTS</p>
            <ul className="diff-list">
              <li>Replace electrical tape with rubber or PEEK pads that won't damage wafer surfaces</li>
              <li>Re-manufacture in lightweight steel for production-grade durability</li>
              <li>Tighten gear mesh to reduce backlash below 0.1 mm</li>
            </ul>
          </div>
        </div>

        {/* Renders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="img-frame">
            <img src="/gripper_photo.jpg" alt="Gripper prototype" onError={e => e.target.style.display='none'} />
            <div style={{ aspectRatio: '1', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: '#444', textAlign: 'center', lineHeight: 2, padding: 12 }}>
                3D-Printed<br />Gripper Prototype
              </span>
            </div>
          </div>
          <div className="img-frame">
            <img src="/gripper_cad.jpg" alt="CAD render" onError={e => e.target.style.display='none'} />
            <div style={{ aspectRatio: '1', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: '#555', textAlign: 'center', lineHeight: 2, padding: 12 }}>
                CAD Render
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Computer Vision ── */
function ComputerVisionContent() {
  const pipeline = [
    { label: 'Grounding DINO', desc: 'Detects both plastic trays from the RGB frame using the text prompt "plastic tray." — returns bounding boxes.' },
    { label: 'SAM2', desc: 'Refines each bounding box into a precise segmentation mask with 25 sampled interior rows.' },
    { label: 'Slot Occupancy', desc: 'Per row: Rule 1 — column brightness < 42 (dark silicon). Rule 2 — mean hue 70–100 and brightness < 90 (greenish wafer tint). Occupied if either rule fires.' },
    { label: 'Target Selection', desc: 'Source = tray with most occupied slots. PICK = first occupied slot (top→bottom). PLACE = first empty slot in destination tray.' },
    { label: 'Pose Export', desc: 'Tray tilt angle extracted via cv2.minAreaRect on the SAM2 mask, encoded as Z-axis yaw for gripper alignment.' },
  ]

  const difficulties = [
    'Thin silicon wafers not detected by RealSense depth sensor — falls back to RGB analysis',
    'Shadows inside the tray cast the same dark hue as wafer edges, causing false positives',
    'Varying tray angle relative to camera shifts HSV parameters significantly',
    'Jetson Nano GPU memory limits model size → SAM2-tiny and DINO-tiny only',
  ]

  const future = [
    'Dedicated wafer-detection model trained on synthetic renders',
    'More robust slot segmentation using depth + RGB fusion',
    'Orientation-invariant detection (works for any tray angle)',
    'Multi-wafer parallel pick planning',
  ]

  return (
    <div>
      <h2 className="section-title">Computer Vision</h2>

      <div className="two-col-wide">
        <div>
          <p className="sub-section-title" style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, color: '#666', marginBottom: 14, letterSpacing: 1 }}>DETECTION PIPELINE</p>
          <div className="pipeline">
            {pipeline.map((step, i) => (
              <div key={i} className="pipeline-step">
                <div className="pipeline-step-num">{i + 1}</div>
                <div>
                  <strong style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, lineHeight: 2 }}>{step.label}</strong>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#333', marginTop: 2 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="img-frame" style={{ marginBottom: 20 }}>
            <img src="/pick_place_result.jpg" alt="Pick-place result with crosshair overlay" />
          </div>
          <div className="img-frame">
            <img src="/debug_contour.jpg" alt="Contour debug output" />
          </div>
        </div>
      </div>

      <div className="sub-section">
        <div className="two-col">
          <div>
            <p className="sub-section-title" style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, color: '#666', marginBottom: 14, letterSpacing: 1 }}>CHALLENGES</p>
            {difficulties.map((d, i) => <p key={i} className="diff-block">{d}</p>)}
          </div>
          <div>
            <p className="sub-section-title" style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, color: '#666', marginBottom: 14, letterSpacing: 1 }}>FUTURE IMPROVEMENTS</p>
            <ul className="diff-list">
              {future.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── IK / Path Planning ── */
function PathPlanningContent() {
  const steps = [
    'Approach above source slot',
    'Lower to grasp height',
    'Close gripper & lift',
    'Move above destination tray',
    'Lower to place height',
    'Open gripper & retreat',
  ]

  const notes = [
    { title: 'IK Seeding', body: 'Each solve is seeded with the previous joint state to keep the arm in a consistent, collision-free configuration throughout the transfer.' },
    { title: 'Gripper Orientation', body: 'End-effector constrained to point straight down and yawed to match tray orientation from vision. Flange-to-pad offset: 208 mm.' },
    { title: 'Velocity Scaling', body: 'Z-axis velocity scaled to 0.2× during approach/descent; XY velocity at 0.4× for stability near tight tray slots.' },
  ]

  const future = [
    'Replace pointwise joint commands with full continuous trajectory planning for smoother motion',
    'Add obstacle and joint-limit constraints plus automatic replanning on unreachable poses',
    'Improve orientation handling so gripper stays aligned even on tilted or noisy tray detections',
  ]

  return (
    <div>
      <h2 className="section-title">IK / Path Planning</h2>

      <div className="two-col">
        <div>
          <p className="sub-section-title" style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, color: '#666', marginBottom: 14, letterSpacing: 1 }}>TRANSFER SEQUENCE</p>
          <div className="ik-steps">
            {steps.map((s, i) => (
              <div key={i} className="ik-step">
                <span className="ik-step-num">{i + 1}.</span>
                <span>{s}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <p className="sub-section-title" style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, color: '#666', marginBottom: 14, letterSpacing: 1 }}>FUTURE IMPROVEMENTS</p>
            <ul className="diff-list">
              {future.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {notes.map((n, i) => (
            <div key={i} className="tech-card">
              <div className="tech-card-title">{n.title}</div>
              <div className="tech-card-body">{n.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Technical Deep Dive ── */
function TechDeepDiveContent() {
  const modules = [
    { title: 'pick_and_place.py', body: '1,681 lines · ROS 2 node · WaferPickPlace service · MoveIt integration · gripper control + GSAM orchestration' },
    { title: 'gsam_slide_detect.py', body: '~1,000 lines · SAM2 + Grounding DINO · RGB hue rules · depth thresholding · TF frame publisher' },
    { title: 'ik.py', body: '~250 lines · wraps MoveIt /compute_ik and /plan_kinematic_path · tmr_arm planning group · link_6 end-effector' },
    { title: 'gripper_server.py', body: '~180 lines · Arduino serial at 115200 baud · /gripper/control (SetBool) · NO-OP fallback if hardware absent' },
    { title: 'slide_detector.py', body: '~200 lines · TF frame monitor · tracks picked / unpicked state per tray slot' },
    { title: 'hsv_tune.py', body: 'Interactive trackbar tool for tuning HSV thresholds live against RealSense stream' },
  ]

  return (
    <div>
      <h2 className="section-title">Technical Deep Dive</h2>
      <p className="mono-body" style={{ marginBottom: 20, color: '#444' }}>
        The system runs as a <span className="kw">ROS 2</span> workspace with modular nodes for perception,
        planning, and actuation. Detection uses{' '}
        <span className="kw">SAM2-tiny</span> + <span className="kw">Grounding DINO-tiny</span> on a Jetson Nano
        (GPU-constrained). Motion planning goes through{' '}
        <span className="kw">MoveIt 2</span> with the <span className="kw">tmr_arm</span> planning group.
      </p>
      <div className="tech-grid">
        {modules.map((m, i) => (
          <div key={i} className="tech-card">
            <div className="tech-card-title">{m.title}</div>
            <div className="tech-card-body">{m.body}</div>
          </div>
        ))}
      </div>

      <div className="sub-section">
        <p className="sub-section-title" style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, color: '#666', marginBottom: 14, letterSpacing: 1 }}>SYSTEM ARCHITECTURE</p>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.9, background: '#111', color: '#00FF41', padding: 20, border: '2px solid #404040' }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{`pick_and_place.py  (MAIN NODE)
  ├─ IKPlanner          ─── MoveIt /compute_ik
  ├─ SlideDetector      ─── TF frame monitor
  ├─ GSAMSlideDetect    ─── /detect_slides service
  │    ├─ SAM2-tiny     ─── segmentation
  │    └─ DINO-tiny     ─── bounding box
  └─ GripperServer      ─── Arduino serial

Camera: RealSense D435i  (1280×720 @ 30 fps)
Robot:  Techman TM12     (6-DOF collaborative)
Serial: /dev/ttyCH341USB0 @ 115200 baud`}</pre>
        </div>
      </div>
    </div>
  )
}

/* ── Video Demo ── */
function VideoDemoContent() {
  return (
    <div>
      <h2 className="section-title">Video Demo</h2>
      <div className="two-col">
        <div className="video-placeholder">
          <div className="video-placeholder-text">
            [ DEMO VIDEO ]<br />
            <span style={{ fontSize: 9 }}>coming soon</span>
          </div>
        </div>
        <div>
          <p className="sub-section-title" style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, color: '#666', marginBottom: 14, letterSpacing: 1 }}>WHAT TO WATCH FOR</p>
          <ul className="bullet-list" style={{ fontSize: 14 }}>
            <li>Grounding DINO drawing tray bounding boxes live on the camera feed</li>
            <li>SAM2 refining the mask and highlighting occupied vs. empty slots</li>
            <li>TM12 arm approaching and lowering with the custom gripper</li>
            <li>Successful wafer lift from source tray and placement in destination</li>
          </ul>

          <div className="sub-section">
            <div className="img-frame">
              <img src="/robot_demo.jpg" alt="Robot demo photo" onError={e => e.target.style.display='none'} />
              <div style={{ aspectRatio: '4/3', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: '#444', textAlign: 'center', lineHeight: 2, padding: 12 }}>
                  TM12 with wafer gripper<br />over target tray
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Root ── */
export default function App() {
  return (
    <main>
      <div className="win page-win">
        <div className="win-titlebar page-titlebar">
          <span className="page-title-text">C106A / 206A — Ember Robotics Final Project</span>
          <div style={{ display: 'flex', gap: 2 }}>
            <span className="win-btn">_</span>
            <span className="win-btn">□</span>
            <span className="win-btn">✕</span>
          </div>
        </div>
        <div className="win-body page-body">
          <HeroContent />
          <PageDivider />
          <OverviewContent />
          <PageDivider />
          <WaferGripperContent />
          <PageDivider />
          <ComputerVisionContent />
          <PageDivider />
          <PathPlanningContent />
          <PageDivider />
          <TechDeepDiveContent />
          <PageDivider />
          <VideoDemoContent />
        </div>
      </div>
      <footer style={{ textAlign: 'center', fontFamily: 'var(--font-pixel)', fontSize: 8, color: '#888', marginTop: 16 }}>
        C106A / 206A · Spring 2026 · Team 10 · Ember Robotics
      </footer>
    </main>
  )
}
