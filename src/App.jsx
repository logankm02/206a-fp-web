import EmberLogo from './components/EmberLogo.jsx'

const base = import.meta.env.BASE_URL

function LogoWindow() {
  return (
    <div className="flex items-center justify-center shrink-0">
      <EmberLogo size={150} />
    </div>
  )
}

function PageDivider() {
  return <div className="border-t border-[#D0D0D0] my-10" />
}

/* ── Hero ── */
function HeroContent() {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-8 items-center max-[680px]:grid-cols-1">
      <div>
        <div className="h-1 bg-gradient-to-r from-orange to-orange-dark mb-7" />
        <h1 className="font-pixel leading-[1.8] tracking-tight text-[clamp(16px,3vw,28px)] mb-8">
          C106A/206A<br />Final Project:<br />Ember Robotics
        </h1>
        <p className="font-mono text-sm leading-loose text-[#333]">
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
      <h2 className="font-pixel text-[clamp(13px,1.8vw,17px)] mb-7 text-center tracking-[1px]">Project Overview</h2>
      <div className="grid [grid-template-columns:1.2fr_0.8fr] gap-8 items-start max-[680px]:grid-cols-1">
        <div>
          <p className="font-mono text-[15px] leading-[1.9] mb-5">
            An industry project in collaboration with{' '}
            <strong>Ember Robotics</strong> to extend previous work on
            glass slide transfer — this time targeting{' '}
            <strong>silicon wafers</strong> with tighter tolerances and
            new perception challenges.
          </p>
          <ul className="list-disc pl-6 font-mono text-[15px] leading-loose">
            <li className="mb-1">Design a custom wafer gripper end-effector</li>
            <li className="mb-1">Write a computer vision module to detect wafer position inside storage trays</li>
            <li className="mb-1">Perform autonomous pick-and-place using inverse kinematics</li>
          </ul>
          <div className="mt-7 pt-7 border-t border-[#D0D0D0]">
            <p className="font-pixel text-[10px] text-[#666] mb-4 tracking-[1px] uppercase">Hardware</p>
            <div className="flex flex-wrap gap-1.5">
              {['Techman TM12 arm', 'RealSense D435i', 'Arduino gripper'].map(t => (
                <span key={t} className="inline-block bg-[#E0E0E0] border border-[#BDBDBD] font-mono text-xs px-2 py-0.5">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="img-frame">
          <img src={`${base}overview.png`} alt="Project overview" className="block w-full h-auto" />
        </div>
      </div>
    </div>
  )
}

/* ── Wafer Gripper ── */
function WaferGripperContent() {
  const future = [
    "Replace electrical tape with rubber or PEEK pads that won't damage wafer surfaces",
    'Re-manufacture in lightweight steel for production-grade durability',
    'Tighten gear mesh to reduce backlash below 0.1 mm',
  ]

  return (
    <div>
      <h2 className="font-pixel text-[clamp(13px,1.8vw,17px)] mb-7 text-center tracking-[1px]">Wafer Gripper</h2>
      <div className="grid grid-cols-2 gap-8 items-start max-[680px]:grid-cols-1">
        <div>
          <p className="font-pixel text-[9px] text-[#666] mb-3.5 tracking-[1px] uppercase">Design</p>
          <ul className="list-disc pl-6 font-mono text-[15px] leading-loose">
            <li className="mb-1">Total clearance ~5 mm between gripper fingers and wafer slot walls</li>
            <li className="mb-1">Reuses existing servo and attachment points to reduce mechanical risk</li>
            <li className="mb-1">3D-printed PLA body with gear-driven symmetric jaw closure</li>
            <li className="mb-1">Rigorous testing to eliminate drag and gear backlash</li>
            <li className="mb-1">Electrical tape on contact surfaces for grip (proof-of-concept)</li>
          </ul>
          <div className="mt-7 pt-7 border-t border-[#D0D0D0]">
            <p className="font-pixel text-[9px] text-[#666] mb-3.5 tracking-[1px] uppercase">Future Improvements</p>
            <ul className="list-none pl-0 space-y-1">
              {future.map((f, i) => (
                <li key={i} className="flex gap-3 font-mono text-sm leading-[1.9]">
                  <span className="text-orange shrink-0">●</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="img-frame">
            <model-viewer
              src={`${base}end-effector.glb`}
              alt="End effector CAD model"
              camera-controls
              auto-rotate
              rotation-per-second="12deg"
              style={{ height: '100%', width: '100%', aspectRatio: '1', background: '#2a2a2a' }}
            />
          </div>
          <div className="img-frame self-start">
            <img src={`${base}gripper.png`} alt="Gripper prototype" className="block w-auto max-w-full max-h-[300px] h-auto" />
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
      <h2 className="font-pixel text-[clamp(13px,1.8vw,17px)] mb-7 text-center tracking-[1px]">Computer Vision</h2>
      <div className="grid [grid-template-columns:1.2fr_0.8fr] gap-8 items-start max-[680px]:grid-cols-1">
        <div>
          <p className="font-pixel text-[9px] text-[#666] mb-3.5 tracking-[1px] uppercase">Detection Pipeline</p>
          <div className="flex flex-col gap-3 mb-6">
            {pipeline.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 bg-orange text-white flex items-center justify-center font-pixel text-[9px] shrink-0">{i + 1}</div>
                <div>
                  <strong className="font-pixel text-[9px] leading-loose block">{step.label}</strong>
                  <span className="font-mono text-[13px] text-[#333]">{step.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="img-frame mb-5">
            <img src={`${base}pick_place_result.jpg`} alt="Pick-place result with crosshair overlay" className="block w-full h-auto" />
          </div>
          <div className="img-frame">
            <img src={`${base}debug_contour.jpg`} alt="Contour debug output" className="block w-full h-auto" />
          </div>
        </div>
      </div>
      <div className="mt-7 pt-7 border-t border-[#D0D0D0]">
        <div className="grid grid-cols-2 gap-8 items-start max-[680px]:grid-cols-1">
          <div>
            <p className="font-pixel text-[9px] text-[#666] mb-3.5 tracking-[1px] uppercase">Challenges</p>
            {difficulties.map((d, i) => (
              <p key={i} className="border-l-[3px] border-[#C0C0C0] pl-4 my-1.5 font-mono text-sm leading-[1.9] text-[#333]">{d}</p>
            ))}
          </div>
          <div>
            <p className="font-pixel text-[9px] text-[#666] mb-3.5 tracking-[1px] uppercase">Future Improvements</p>
            <ul className="list-none pl-0 space-y-1">
              {future.map((f, i) => (
                <li key={i} className="flex gap-3 font-mono text-sm leading-[1.9]">
                  <span className="text-orange shrink-0">●</span>
                  <span>{f}</span>
                </li>
              ))}
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
      <h2 className="font-pixel text-[clamp(13px,1.8vw,17px)] mb-7 text-center tracking-[1px]">IK / Path Planning</h2>
      <div className="grid grid-cols-2 gap-8 items-start max-[680px]:grid-cols-1">
        <div>
          <p className="font-pixel text-[9px] text-[#666] mb-3.5 tracking-[1px] uppercase">Transfer Sequence</p>
          <div className="flex flex-col gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-4 px-3.5 py-2.5 border-l-4 border-orange bg-[#FAFAFA] font-mono text-sm">
                <span className="font-pixel text-[9px] text-orange-dark w-4 shrink-0">{i + 1}.</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p className="font-pixel text-[9px] text-[#666] mb-3.5 tracking-[1px] uppercase">Future Improvements</p>
            <ul className="list-none pl-0 space-y-1">
              {future.map((f, i) => (
                <li key={i} className="flex gap-3 font-mono text-sm leading-[1.9]">
                  <span className="text-orange shrink-0">●</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="img-frame">
            <img src={`${base}ik-screenshot.png`} alt="IK path planning screenshot" className="block w-full h-auto" />
          </div>
          {notes.map((n, i) => (
            <div key={i} className="border border-[#C0C0C0] p-3.5 bg-[#FAFAFA]">
              <div className="font-pixel text-[9px] mb-2.5 text-orange-dark leading-[1.7]">{n.title}</div>
              <div className="font-mono text-[13px] leading-[1.8] text-[#333]">{n.body}</div>
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

  const Kw = ({ children }) => (
    <span className="bg-[#F0F0F0] border border-[#CCC] px-1.5 py-px font-mono text-[13px]">{children}</span>
  )

  return (
    <div>
      <h2 className="font-pixel text-[clamp(13px,1.8vw,17px)] mb-7 text-center tracking-[1px]">Technical Deep Dive</h2>
      <p className="font-mono text-[15px] leading-[1.9] mb-5 text-[#444]">
        The system runs as a <Kw>ROS 2</Kw> workspace with modular nodes for perception,
        planning, and actuation. Detection uses{' '}
        <Kw>SAM2-tiny</Kw> + <Kw>Grounding DINO-tiny</Kw> on a Jetson Nano
        (GPU-constrained). Motion planning goes through{' '}
        <Kw>MoveIt 2</Kw> with the <Kw>tmr_arm</Kw> planning group.
      </p>
      <div className="grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4 mt-5">
        {modules.map((m, i) => (
          <div key={i} className="border border-[#C0C0C0] p-3.5 bg-[#FAFAFA]">
            <div className="font-pixel text-[9px] mb-2.5 text-orange-dark leading-[1.7]">{m.title}</div>
            <div className="font-mono text-[13px] leading-[1.8] text-[#333]">{m.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Video Demo ── */
function VideoDemoContent() {
  return (
    <div>
      <h2 className="font-pixel text-[clamp(13px,1.8vw,17px)] mb-7 text-center tracking-[1px]">Video Demo</h2>
      <div className="grid grid-cols-2 gap-8 items-start max-[680px]:grid-cols-1">
        <video controls className="w-full block border-2 border-[#404040]">
          <source src={`${base}IMG_2082.MOV.mp4`} type="video/mp4" />
        </video>
        <div>
          <p className="font-pixel text-[9px] text-[#666] mb-3.5 tracking-[1px] uppercase">What to Watch For</p>
          <ul className="list-disc pl-6 font-mono text-sm leading-loose">
            <li className="mb-1">Grounding DINO drawing tray bounding boxes live on the camera feed</li>
            <li className="mb-1">SAM2 refining the mask and highlighting occupied vs. empty slots</li>
            <li className="mb-1">TM12 arm approaching and lowering with the custom gripper</li>
            <li className="mb-1">Successful wafer lift from source tray and placement in destination</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ── Root ── */
export default function App() {
  return (
    <main className="px-4 py-8 pb-16">
      <div className="win">
        <div className="win-titlebar">
          <span className="font-pixel text-[8px] text-white tracking-[0.5px] truncate">C106A / 206A — Ember Robotics Final Project</span>
          <div className="flex gap-0.5">
            <span className="win-btn">_</span>
            <span className="win-btn">□</span>
            <span className="win-btn">✕</span>
          </div>
        </div>
        <div className="p-10 max-[680px]:p-5">
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
      <footer className="text-center font-pixel text-[8px] text-[#888] mt-4">
        C106A / 206A · Spring 2026 · Team 10 · Ember Robotics
      </footer>
    </main>
  )
}
