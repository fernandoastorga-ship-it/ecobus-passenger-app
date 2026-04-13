import { NavLink } from "react-router-dom";

const moreUrl = "https://ecobus.cl/qr";

const items = [
  { to: "/dashboard", label: "Inicio", icon: "⌂", type: "route" },
  { to: "/qr", label: "QR", icon: "▣", type: "route" },
  { to: "/history", label: "Historial", icon: "≡", type: "route" },
  { to: "/payments", label: "Pagos", icon: "$", type: "route" },
  { to: moreUrl, label: "Más", icon: "⋯", type: "external" },
];

export default function BottomNav() {
  return (
    <nav className="ecobus-bottom-nav">
      {items.map((item) => {
        if (item.type === "external") {
          return (
            <a
              key={item.label}
              href={item.to}
              target="_blank"
              rel="noreferrer"
              className="ecobus-bottom-nav__item"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          );
        }

        return (
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
        );
      })}
    </nav>
  );
}
