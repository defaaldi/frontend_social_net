import { NavPriv } from "./NavPriv";

export const HeaderPriv = () => {
  return (
    <header className="layout__navbar">
      <div className="navbar__header">
        <a href="#" className="navbar__title" >B-270</a>
      </div>
      <NavPriv />
    </header>
  )
}
