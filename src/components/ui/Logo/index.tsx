import React from "react"

function Logo() {
  return (
    <div className="font-primary text-2xl lg:text-3xl flex gap-2 text-white tracking-wide">
        <p>&#128013;</p> {/* 🐍 */}
        <p>Retro Snake</p>
    </div>
  )
}

export default React.memo(Logo)