import { NavLink } from "react-router-dom";

const items = [
  { to: "/dashboard", label: "Inicio", icon: "⌂" },
  { to: "/qr", label: "QR", icon: "▣" },
  { to: "/history", label: "Historial", icon: "≡" },
  { to: "/payments", label: "Pagos", icon: "$" },
  { to: "/legal", label: "Más", icon: "⋯" },
];

export default function BottomNav() {
  return (
    <nav className="ecobus-bottom-nav">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `ecobus-bottom-nav__item ${isActive ? "ecobus-bottom-nav__item--active" : ""}`
          }
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
