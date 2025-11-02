import CartIcon from "./cartIcon";

export default function Header () {
    return (
        <header>
            <div className="logo">
                <h2>Golem</h2>
            </div>
            <nav>
                <ul>
                    <li>Productos</li>
                    <li>Equipo</li>
                    <li>
                        <CartIcon/>
                    </li>
                </ul>
            </nav>
        </header>
    )
}