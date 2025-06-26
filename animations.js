// This file contains variables and functions responsible for the animations 
// within my portfolio.
// Author: Elliot Warren
// linkedIn: https://www.linkedin.com/in/elliot-warren/

const IMAGE = document.getElementById('landing');
const FIRST_NAME_TITLE = document.getElementById('firstName');
const LAST_NAME_TITLE = document.getElementById('lastName');
const RESUME = document.getElementById('resume');
const SECTION_TITLE = document.getElementById('sectionTitle');
const BUTTON = document.getElementById('scrollButton');
const BUTTON_ANIMATION_TIME = 1000; // Time for animation to take place in ms
const INITIAL_ZOOM = 1; // Initial scale factor
const ZOOM_SPEED = 0.005; // Amount to increase scale on each wheel event
var backgroundZoom = 0; // Value to set scale property to
const OPACITY_SPEED = 0.0005 // Amount to scale opacity on each wheel event
var backgroundOpacity = 0 // Value to set background opacity to
var resumeOpacity = 0; // Variable to set resume opacity to
var buttonOpacity = 0; // Variable to set button opacity to
var backgroundBlur = 0; // Value to set Blur to while zooming
var deltaY = 0; // Pixel distance "covered" per wheel event
const DT_DELTA_Y_MAX = 0; // Desktop deltaY max
const MB_DELTA_Y_MAX = 0; // Mobile deltaY max
var initY = 0; // Start location for reference on mobile
const FN_TARGET_X = 466; // Desktop X translation target
const FN_TARGET_Y = 100; // Desktop Y translation target
const LN_TARGET_X = 576; // Desktop X translation target
const LN_TARGET_Y = 146; // Desktop Y translation target
var transMtx = null;
var isAtTop = true;
var instDate = 0;
var ftrDate = 0;

function autoScrollHandler() {
    console.log("button clicked")
    let id = null;
    instDate = Date.now();
    ftrDate = instDate + BUTTON_ANIMATION_TIME;
    clearInterval(id);
    id = setInterval(autoScroll, 1);
    function autoScroll() {
        if ((instDate < ftrDate) && isAtTop) {
            var percentComplete = 1 - (ftrDate - instDate) / BUTTON_ANIMATION_TIME;
            backgroundZoom = 1 + percentComplete * 3;
            backgroundOpacity = 1-percentComplete;
            backgroundBlur = backgroundZoom;
            resumeOpacity = percentComplete;
            buttonOpacity = backgroundOpacity
            transMtx = calcTranslate(backgroundOpacity);
            setStyles();
            instDate = Date.now();
        } else {
            clearInterval(id);
            isAtTop = false;
        }
    }
}

function setStyles() {
    console.log("setting styles...");
    // Set styles based on deltaY or button press
    IMAGE.style.transform = `scale(${backgroundZoom})`;
    IMAGE.style.opacity = backgroundOpacity;
    IMAGE.style.filter = `blur(${backgroundBlur}px)`
    RESUME.style.opacity = resumeOpacity;
    BUTTON.style.opacity = buttonOpacity;
    if (transMtx.length === 5) {
        FIRST_NAME_TITLE.style.transform = `translate(${transMtx[0]}px, -${transMtx[1]}px)`;
        LAST_NAME_TITLE.style.transform = `translate(${transMtx[2]}px, -${transMtx[3]}px)`;
    }
    if (backgroundOpacity <= 0.005) {
        RESUME.style.position = "sticky";
        RESUME.style.paddingTop = "16vh";
        RESUME.style.paddingBottom = "100vh";
        BUTTON.style.display = "none";
        BUTTON.style.removeProperty("cursor");
    } else {
        RESUME.style.position = "fixed"
        RESUME.style.paddingTop = "0";
        BUTTON.style.removeProperty("display");
    }
}

function calcTranslate(opacity) {
    let percent = 1 - (opacity / 1);
    let instXFN = percent * FN_TARGET_X; // x position for the title
    let instYFN = percent * FN_TARGET_Y; // y position for the title
    let instXLN = percent * LN_TARGET_X; // x position for the title
    let instYLN = percent * LN_TARGET_Y; // y position for the title
    return [instXFN, instYFN, instXLN, instYLN, percent];
}

function flyOutPrevTitle() {
    SECTION_TITLE.classList.add("fly-out");
    return null;
}