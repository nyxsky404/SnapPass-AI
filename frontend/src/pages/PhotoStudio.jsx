import React, { useState, useRef } from "react";
import "./PhotoStudio.css";
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

function PhotoStudio() {
    const { language } = useLanguage();
    const t = translations[language];
    const [imageSrc, setImageSrc] = useState(null);
    const [fileName, setFileName] = useState("edited-photo.png");

    // Adjustment states
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);

    const fileInputRef = useRef(null);

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageSrc(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Reset adjustments
    const handleReset = () => {
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
    };

    // Export and download the edited image
    const handleDownload = () => {
        if (!imageSrc) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            // Apply the exact same filters used in the CSS preview
            ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Trigger download
            const link = document.createElement("a");
            link.download = `edited-${fileName}`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        };
        img.src = imageSrc;
    };

    // The CSS filter string for real-time preview
    const filterStyle = {
        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
    };

    return (
        <div className="photo-studio-page">
            <div className="studio-header">
                <h1 className="section-title">{t.photoStudio.split(' ')[0]} <span className="text-highlight">{t.photoStudio.split(' ')[1]}</span></h1>
                <p className="section-subtitle">{t.photoStudioSubtitle}</p>
            </div>

            <div className="studio-workspace">
                <div className="studio-preview-panel">
                    {!imageSrc ? (
                        <div className="upload-placeholder" onClick={() => fileInputRef.current.click()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upload-icon">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            <p>{t.clickUploadPhoto}</p>
                            <span className="upload-hint">{t.uploadFormats}</span>
                        </div>
                    ) : (
                        <div className="image-container">
                            <img src={imageSrc} alt="Preview" style={filterStyle} className="preview-image" />
                            <button className="btn-secondary change-photo-btn" onClick={() => fileInputRef.current.click()}>
                                {t.changePhoto}
                            </button>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        style={{ display: "none" }}
                    />
                </div>

                <div className="studio-controls-panel">
                    <div className="controls-card">
                        <h3 className="controls-title">{t.adjustments}</h3>

                        <div className="slider-group">
                            <div className="slider-header">
                                <label>{t.brightness}</label>
                                <span>{brightness}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="200"
                                value={brightness}
                                onChange={(e) => setBrightness(e.target.value)}
                                className="slider"
                                disabled={!imageSrc}
                            />
                        </div>

                        <div className="slider-group">
                            <div className="slider-header">
                                <label>{t.contrast}</label>
                                <span>{contrast}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="200"
                                value={contrast}
                                onChange={(e) => setContrast(e.target.value)}
                                className="slider"
                                disabled={!imageSrc}
                            />
                        </div>

                        <div className="slider-group">
                            <div className="slider-header">
                                <label>{t.saturation}</label>
                                <span>{saturation}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="200"
                                value={saturation}
                                onChange={(e) => setSaturation(e.target.value)}
                                className="slider"
                                disabled={!imageSrc}
                            />
                        </div>

                        <div className="controls-actions">
                            <button className="btn-outline" onClick={handleReset} disabled={!imageSrc}>
                                {t.reset}
                            </button>
                            <button className="btn-primary" onClick={handleDownload} disabled={!imageSrc}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                {t.download}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PhotoStudio;