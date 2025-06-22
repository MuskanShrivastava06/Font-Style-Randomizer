import React, { useState, useEffect } from "react";
import styles from "../Style/Textblock.module.css";

const Textblock = () => {
  const [fonts, setFonts] = useState([]);
  const [textBlocks, setTextBlocks] = useState([
    { id: 1, type: "Heading", text: "Hello from React", font: "", style: {}, fontSize: 18 },
    { id: 2, type: "Paragraph", text: "React is used for building user interfaces.", font: "", style: {}, fontSize: 18 },
    { id: 3, type: "Quote", text: "“Design is intelligence made visible.”", font: "", style: {}, fontSize: 18 }
  ]);
  const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {
    const getFonts = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyALgA_5cJhUAo7YncvLbjIHyuLwQYrr6bc`
        );
        const data = await response.json();
        setFonts(data.items.slice(0, 15));
      } catch (err) {
        console.error("Font Fetch Error", err);
      }
    };
    getFonts();

    const savedConfig = localStorage.getItem("fontRandomizerConfig");
    if (savedConfig) {
      setTextBlocks(JSON.parse(savedConfig));
    }
  }, []);


  useEffect(() => {
    const loadedFonts = new Set();
    textBlocks.forEach((block) => {
      if (block.font && !loadedFonts.has(block.font)) {
        const link = document.createElement("link");
        link.href = `https://fonts.googleapis.com/css2?family=${block.font.replace(/\s/g, "+")}&display=swap`;
        link.rel = "stylesheet";
        document.head.appendChild(link);
        loadedFonts.add(block.font);
      }
    });
  }, [textBlocks]);



  const handleFontChange = (id, font) => {
    const updated = textBlocks.map((block) =>
      block.id === id ? { ...block, font } : block
    );
    setTextBlocks(updated);
  };



  const handleStyleChange = (id, styleKey) => {
    const styleMap = {
      fontWeight: "bold",
      fontStyle: "italic",
      textDecoration: "underline"
    };
    const updated = textBlocks.map((block) => {
      if (block.id === id) {
        const isActive = block.style[styleKey] === styleMap[styleKey];
        const newStyle = {
          ...block.style,
          [styleKey]: isActive ? "normal" : styleMap[styleKey],
        };
        return { ...block, style: newStyle };
      }
      return block;
    });
    setTextBlocks(updated);
  };



  const handleReset = (id) => {
    const updated = textBlocks.map((block) =>
      block.id === id ? { ...block, style: {}, font: "", fontSize: 18 } : block
    );
    setTextBlocks(updated);
  };



  const handleRandomize = () => {
    const updated = textBlocks.map((block) => {
      const random = fonts[Math.floor(Math.random() * fonts.length)];
      return { ...block, font: random.family };
    });
    setTextBlocks(updated);
  };



  const handleFontSizeChange = (id, newSize) => {
    const updated = textBlocks.map((block) =>
      block.id === id ? { ...block, fontSize: newSize } : block
    );
    setTextBlocks(updated);
  };



  const handleTextChange = (id, newText) => {
    const updated = textBlocks.map((block) =>
      block.id === id ? { ...block, text: newText } : block
    );
    setTextBlocks(updated);
  };


  const handleSaveConfig = () => {
    localStorage.setItem("fontRandomizerConfig", JSON.stringify(textBlocks));
    alert("Font saved successfully!");
  };


  const handleClearConfig = () => {
    localStorage.removeItem("fontRandomizerConfig");
    alert("Font cleared!");
  };

  
  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      <h1 className={`${styles.title} ${darkMode ? styles.dark : ""}`}>Font Randomizer App</h1>

      <div className={styles.topControls}>
        <button className={`${styles.button} ${darkMode ? styles.dark : ""}`} onClick={handleRandomize}>🎲 Randomize Fonts</button>
        <button className={`${styles.button} ${darkMode ? styles.dark : ""}`} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button className={styles.button} onClick={handleSaveConfig}>💾 Save Font</button>
        <button className={styles.button} onClick={handleClearConfig}>🗑️ Remove</button>
      </div>

      {textBlocks.map((block) => (
        <div key={block.id} className={`${styles.textBlock} ${darkMode ? styles.dark : ""}`}>
          <textarea
            value={block.text}
            onChange={(e) => handleTextChange(block.id, e.target.value)}
            className={styles.textContent}
            style={{
              fontFamily: block.font || "sans-serif",
              fontWeight: block.style.fontWeight || "normal",
              fontStyle: block.style.fontStyle || "normal",
              textDecoration: block.style.textDecoration || "none",
              fontSize: `${block.fontSize}px`
            }}
          />

          <div className={styles.fontLabel}><strong>Font:</strong> {block.font || "Default"}</div>

          <select
            className={styles.dropdown}
            value={block.font}
            onChange={(e) => handleFontChange(block.id, e.target.value)}
          >
            <option value="">-- Select Font --</option>
            {fonts.map((font) => (
              <option key={font.family} value={font.family}>
                {font.family}
              </option>
            ))}
          </select>

          <div className={styles.sliderContainer}>
            <label className={styles.sliderLabel}><strong>Font Size:</strong> {block.fontSize}px</label>
            <input
              type="range"
              min="10"
              max="40"
              value={block.fontSize}
              className={styles.slider}
              onChange={(e) => handleFontSizeChange(block.id, Number(e.target.value))}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button className={`${styles.button} ${darkMode ? styles.dark : ""}`} onClick={() => handleStyleChange(block.id, "fontWeight")}>Bold</button>
            <button className={`${styles.button} ${darkMode ? styles.dark : ""}`} onClick={() => handleStyleChange(block.id, "fontStyle")}>Italic</button>
            <button className={`${styles.button} ${darkMode ? styles.dark : ""}`} onClick={() => handleStyleChange(block.id, "textDecoration")}>Underline</button>
            <button className={`${styles.button} ${darkMode ? styles.dark : ""}`} onClick={() => handleReset(block.id)}>Reset</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Textblock;








