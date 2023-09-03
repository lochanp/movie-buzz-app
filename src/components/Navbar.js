
import Logo from './navbar/Logo'

const Navbar = ({children}) => {

  return (
    <nav className="nav-bar">
        <Logo />
        {children}
    </nav>
  )
}

export default Navbar