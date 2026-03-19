import React from "react";
import { Container, LogoutBtn } from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Search",
      slug: "/search",
      active: true,
    },
    {
      name: "Notification",
      slug: "/notifications",
      active: true,
    },
    {
      name: "Follow",
      slug: "/follow",
      active: true,
    },
    {
      name: "Profile",
      slug: "/profile",
      active: true,
    },
  ];
  return (
    <section>
      <Container>
        <nav>
          <div>
            <Link to="/">{/* Logo */}</Link>
          </div>

          <ul>
            {navItems.map((item) => (
              <li key={item.name}>
                <button onClick={() => navigate(item.slug)}>{item.name}</button>
              </li>
            ))}
          </ul>

          {authStatus && (
            <li>
              <LogoutBtn />
            </li>
          )}
        </nav>
      </Container>
    </section>
  );
}

export default Sidebar;
