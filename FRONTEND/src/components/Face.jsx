import React, { useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import "./Face.css";
import SpotlightCard from "./SpotlightCard"; // ✅ Make sure this file exists

function Face() {
  const [selected, setSelected] = useState(null);

  const handleSelect = (role) => setSelected(role);

  const cardStyle = (role) => ({
    ...styles.card,
    border:
      selected === role
        ? "2px solid #3182ce"
        : "1px solid rgba(16,24,40,0.04)",
    boxShadow:
      selected === role
        ? "0 4px 12px rgba(49,130,206,0.12)"
        : styles.card.boxShadow,
    cursor: "pointer",
  });

  return (
    <div className="signup-page">
      <Box
        className="signup-card"
        component="main"
        role="main"
        aria-labelledby="signup-heading"
      >
        <div className="brand">
          <div className="logo-box">
            <div className="gradient-text">
              <i>W</i>
            </div>
          </div>
          <div className="brand-text">
            <div className="brand-title">Washify</div>
            <div className="brand-sub">Connect · Book · Track</div>
          </div>
        </div>

        <header style={styles.header}>
          <nav style={styles.nav}>
            <Link to="/home" style={styles.homeLink}>
              Home
            </Link>
          </nav>
        </header>

        <main style={styles.main}>
          <h2 style={styles.subtitle}>Create an account</h2>

          <div style={styles.cards}>
            {/* ✅ Admin Card */}
            <SpotlightCard spotlightColor="rgba(45, 90, 239, 0.64)">
              <div
                
                onClick={() => handleSelect("admin")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSelect("admin")
                }
                aria-pressed={selected === "admin"}
              >
                <div style={styles.cardHeader}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 12a4 4 0 100-8 4 4 0 000 8z"
                      stroke="#2b6cb0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                      stroke="#2b6cb0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <h3 style={{ ...styles.cardTitle, color: "#ffffffff" }}>Admin Signup</h3><br></br>

                </div>
                <p style={styles.cardText}>
                  Register as an administrator to manage the system and users.
                </p><br></br>
                <Link
                  to="/admin"
                  style={{
                    ...styles.buttonPrimary,
                    opacity:
                      selected && selected !== "admin" ? 0.6 : 1,
                    pointerEvents:
                      selected && selected !== "admin"
                        ? "none"
                        : "auto",
                  }}
                >
                  Sign up as Admin
                </Link>
              </div>
            </SpotlightCard>

            {/* ✅ User Card */}
            <SpotlightCard spotlightColor="rgba(59, 169, 114, 0.69)">
              <div
               
                onClick={() => handleSelect("user")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSelect("user")
                }
                aria-pressed={selected === "user"}
              >
                <div style={styles.cardHeader}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5s-3 1.343-3 3 1.343 3 3 3z"
                      stroke="#2f855a"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 20v-2a4 4 0 014-4h4"
                      stroke="#2f855a"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <h3 style={{ ...styles.cardTitle, color: "#ffffffff" }}>User Signup</h3><br></br>
                </div>
                <p style={styles.cardText}>
                  Create a user account to request services and view your history.
                </p><br></br>
                <Link
                  to="/"
                  style={{
    ...styles.buttonPrimary,          // base styles
    background: "#2f855a",            // green background
    color: "#fff",                     // text color (white)
    opacity: selected && selected !== "user" ? 0.6 : 1,
    pointerEvents: selected && selected !== "user" ? "none" : "auto",
  }}
                >
                  Sign up as User
                </Link>
              </div>
            </SpotlightCard>
          </div>
        </main>
      </Box>
    </div>
  );
}

export default Face;

const styles = {
  header: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "20px 28px",
    borderBottom: "1px solid #e2e8f0",
    background: "#fff",
  },
  nav: {},
  homeLink: {
    textDecoration: "none",
    color: "#2b6cb0",
    fontWeight: 600,
    padding: "8px 12px",
    borderRadius: 6,
  },
  main: {
    maxWidth: 980,
    margin: "48px auto",
    padding: "0 20px",
  },
  subtitle: {
    margin: "0 0 20px 0",
    fontSize: 20,
    fontWeight: 600,
    color: "#2d3748",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(16,24,40,0.04)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    minHeight: 170,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  cardTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
  },
  cardText: {
    margin: 0,
    color: "#4a5568",
    fontSize: 14,
    flex: 1,
  },
  buttonPrimary: {
    display: "inline-block",
    textDecoration: "none",
    background: "#2b6cb0",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 8,
    fontWeight: 600,
    textAlign: "center",
  },
  buttonOutline: {
    display: "inline-block",
    textDecoration: "none",
    background: "transparent",
    color: "#2f855a",
    padding: "10px 14px",
    borderRadius: 8,
    fontWeight: 600,
    border: "1px solid #c6f6d5",
    textAlign: "center",
  },
cards: {
  display: "flex",          // use flex to place children side by side
  gap: "20px",              // space between cards
  justifyContent: "center", // center cards horizontally
  flexWrap: "wrap",         // wrap to next line on smaller screens
},


};
