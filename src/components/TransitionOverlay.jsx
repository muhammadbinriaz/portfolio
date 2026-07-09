// The fixed block overlay used for page transitions (ported markup from each HTML file).
export default function TransitionOverlay() {
  return (
    <div className="transition">
      <div className="transition-row row-1">
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
      </div>
      <div className="transition-row row-2">
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
      </div>
    </div>
  )
}
