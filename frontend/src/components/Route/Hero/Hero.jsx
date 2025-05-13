import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const styles = {
    container: {
      minHeight: "70vh",
      backgroundImage: "url('/background mrk.jpg')", // Image in public folder
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.3)", // Dark overlay to enhance text readability
    },
    content: {
      width: "90%",
      maxWidth: "800px",
      textAlign: "center",
      position: "relative", // Ensures content sits above the overlay
      zIndex: 2,
    },
    heading: {
      fontSize: "35px",
      lineHeight: "1.2",
      color: "rgba(255, 255, 255, 0.9)", // Nearly white for high contrast with the blue nav
      fontWeight: 700,
      fontFamily: "'Comic Sans MS', cursive, sans-serif", // Comic Sans font
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)", // Subtle shadow for readability
      marginBottom: "20px",
    },
    paragraph: {
      fontSize: "16px",
      color: "rgba(255, 255, 255, 0.85)", // Slightly transparent white
      fontFamily: "'Comic Sans MS', cursive, sans-serif", // Comic Sans font
      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
      marginBottom: "20px",
    },
    button: {
      marginTop: "20px",
      backgroundColor: "#007bff", // Blue button to match navigation
      padding: "10px 20px",
      borderRadius: "5px",
      color: "#fff",
      fontSize: "18px",
      fontFamily: "'Comic Sans MS', cursive, sans-serif", // Comic Sans font
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      {/* Overlay */}
      <div style={styles.overlay}></div>
      <style>
        {`
          @keyframes slideInLeft {
            0% {
              opacity: 0;
              transform: translateX(-100%);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .slide-in-left {
            animation: slideInLeft 1.5s ease-out;
          }
        `}
      </style>
      <div style={styles.content}>
        <h1 style={styles.heading} className="slide-in-left">
          MRK Engineering Works & Fabricators
        </h1>
        <p style={styles.paragraph}>
          We provide high-quality engineering and fabrication solutions for industrial and residential projects. Our services ensure durability, precision, and innovation. Experience top-notch craftsmanship and tailored solutions with MRK Engineering Works & Fabricators.
        </p>
        <Link to="/products" className="inline-block">
          <div style={styles.button}>
            <span>Shop Now</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
