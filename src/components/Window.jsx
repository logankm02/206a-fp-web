export default function Window({ children, extraClass = '' }) {
  return (
    <div className={`win ${extraClass}`}>
      <div className="win-titlebar">
        <span className="win-btn">_</span>
        <span className="win-btn">□</span>
        <span className="win-btn">✕</span>
      </div>
      <div className="win-body">
        {children}
      </div>
    </div>
  )
}
