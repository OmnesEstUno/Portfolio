// This file contains variables and functions responsible for the animations 
// within my portfolio.
// Author: Elliot Warren
// linkedIn: https://www.linkedin.com/in/elliot-warren/

// **********Variable and constant section***********
const BODY = document.getElementById('body');
const IMAGE = document.getElementById('landing');
const HEADER = document.getElementById('header');
const EMAIL_LINK = document.getElementById('email-me');
const PRINT_LINK = document.getElementById('print-resume')
const ABOUT_LINK = document.getElementById('about-me');
const FIRST_NAME_TITLE = document.getElementById('first-name');
const LAST_NAME_TITLE = document.getElementById('last-name');
const RESUME = document.getElementById('resume');
const BUTTON = document.getElementById('scroll-button');
const BUTTON_EFFECT = document.getElementById('point-effect');
const BUTTON_ANIMATION_TIME = 1000; // Time for animation to take place in ms
var headerOpacity = 0; // tracker for header opacity on animation
const INITIAL_ZOOM = 1; // Initial scale factor
const ZOOM_SPEED = 0.005; // Amount to increase scale on each wheel event
var backgroundZoom = 0; // Value to set scale property to
const MIN_OPACITY = 0.1; // cap lower opacity at this value
const OPACITY_SPEED = 0.0005; // Amount to scale opacity on each wheel event
var backgroundOpacity = 0; // Value to set background opacity to
var linkOpacity = 0; // Value to set links opacity to
var resumeOpacity = 0; // Variable to set resume opacity to
var buttonOpacity = 0; // Variable to set button opacity to
var backgroundBlur = 0; // Value to set Blur to while zooming
var deltaY = 0; // Pixel distance "covered" per wheel event
const DT_DELTA_Y_MAX = 0; // Desktop deltaY max
const MB_DELTA_Y_MAX = 0; // Mobile deltaY max
var initY = 0; // Start location for reference on mobile
const FN_TARGET_X = 466; // Desktop X translation target
const FN_TARGET_Y = 160; // Desktop Y translation target
const LN_TARGET_X = 576; // Desktop X translation target
const LN_TARGET_Y = 206; // Desktop Y translation target
var transMtx = null;
var isAtTop = true;
var instDate = 0;
var ftrDate = 0;

// JS I want to be executed when the page loads
FIRST_NAME_TITLE.addEventListener("animationend", function() {
    BUTTON_EFFECT.classList.add("infinite-point-effect");
});

// *************Function section******************

/**
 * Handles when the screen is initially clicked,
 * namely applying the setInterval loop
 */
function autoScrollHandler() {
    removeOnClick();
    let id = null;
    instDate = Date.now();
    ftrDate = instDate + BUTTON_ANIMATION_TIME;
    clearInterval(id);
    id = setInterval(autoScroll, 1);
    function autoScroll() {
        if ((instDate < ftrDate) && isAtTop) {
            var percentComplete = 1 - (ftrDate - instDate) / BUTTON_ANIMATION_TIME;
            backgroundZoom = 1 + percentComplete * 3;
            backgroundOpacity = Math.max(MIN_OPACITY, 1-percentComplete);
            headerOpacity = percentComplete;
            linkOpacity = percentComplete;
            backgroundBlur = percentComplete * 3;
            resumeOpacity = percentComplete;
            buttonOpacity = 1-percentComplete
            transMtx = calcTranslate(1-percentComplete);
            setStyles();
            instDate = Date.now();
        } else {
            clearInterval(id);
            isAtTop = false;
        }
    }
}

/**
 * A handler function for setting styles to facilitate 
 * the animation that takes place when initially clicking 
 * the screen
 */
function setStyles() {
    HEADER.style.opacity = headerOpacity;
    IMAGE.style.transform = `scale(${backgroundZoom})`;
    IMAGE.style.opacity = backgroundOpacity;
    IMAGE.style.filter = `blur(${backgroundBlur}px)`
    EMAIL_LINK.style.display = "flex";
    PRINT_LINK.style.display = "flex";
    ABOUT_LINK.style.display = "flex";
    EMAIL_LINK.style.opacity = linkOpacity;
    PRINT_LINK.style.opacity = linkOpacity;
    ABOUT_LINK.style.opacity = linkOpacity;
    RESUME.style.opacity = resumeOpacity;
    BUTTON.style.opacity = buttonOpacity;
    if (transMtx.length === 5) {
        FIRST_NAME_TITLE.style.transform = `translate(${transMtx[0]}px, -${transMtx[1]}px)`;
        LAST_NAME_TITLE.style.transform = `translate(${transMtx[2]}px, -${transMtx[3]}px)`;
    }
    if (backgroundOpacity <= MIN_OPACITY) {
        RESUME.style.position = "sticky";
        RESUME.style.paddingBottom = "100vh";
        BUTTON.style.display = "none";
        BUTTON.style.removeProperty("cursor");
        BUTTON.style.animation = "pointer-animation"
    }
}

/**
 * Calculates the positions of my names to move across the screen smoothly
 * @param {*} opacity <- a 0-1 slider to measure the movements off of
 * @returns n=5 matrix containing transformation coordinates
 */
function calcTranslate(opacity) {
    let percent = 1 - (opacity / 1);
    let instXFN = percent * FN_TARGET_X; // x position for the title
    let instYFN = percent * FN_TARGET_Y; // y position for the title
    let instXLN = percent * LN_TARGET_X; // x position for the title
    let instYLN = percent * LN_TARGET_Y; // y position for the title
    return [instXFN, instYFN, instXLN, instYLN, percent];
}

/**
 * Prints my resume when the button is clicked
 */
function printResume() {
    var resume = window.open("assets/Elliot_Warren_Resume.pdf");
    resume?.print();
}

/**
 * removes the onClick handlers from the elements to prevent rapid clicking
 */
function removeOnClick() {
    BODY.removeAttribute("onClick");
    BUTTON.removeAttribute("onClick");
}