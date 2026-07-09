// Presentational sidebar menu. Items + lowerClass differ per page.
export default function Sidebar({ lowerClass = 'lower', items = [] }) {
  return (
    <div className="full">
      <div className="naver">
        <h4>Muhammad Bin Riaz</h4>
        <h4 className="cross hover-underline">
          <span>CLOSE</span>
        </h4>
      </div>
      <div className="content">
        <div className="content-div">
          {items.map((it, i) => (
            <h1 key={i}>
              <a className={it.cls} href={it.href}>
                {it.label}
              </a>
            </h1>
          ))}
        </div>
      </div>
      <div className="daba">
        <div className="acc">
          <h3>linkedin</h3>
          <h3>x/twitter</h3>
          <h3>instagram</h3>
          <h3>youtube</h3>
        </div>
        <div className={lowerClass}>
          <h3>&copy; 2025</h3>
          <h3>12:05 PM ET</h3>
        </div>
      </div>
    </div>
  )
}
