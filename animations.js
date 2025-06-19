// This file contains variables and functions responsible for the animations 
// within my portfolio.
// Author: Elliot Warren
// linkedIn: https://www.linkedin.com/in/elliot-warren/

const IMAGE = document.getElementById('landing');
const NAME_TITLE = document.getElementById('name');
const RESUME = document.getElementById('resume');
const SECTION_TITLE = document.getElementById('sectionTitle');
const INITIAL_ZOOM = 1; // Initial scale factor
const ZOOM_SPEED = 0.005; // Amount to increase scale on each wheel event
var newZoom = 0; // Value to set scale property to
const OPACITY_SPEED = 0.0005 // Amount to scale opacity on each wheel event
var newOpacity = 0 // Value to set to opacity property to
var deltaY = 0; // Pixel distance "covered" per wheel event
var initY = 0; // Start location for reference on mobile
const TARGET_W = 15; // Additional width to grant the name space to be 1 ln
const TARGET_X = document.body.scrollWidth * 0.24; // Desktop X translation target
const TARGET_Y = 100; // Desktop Y translation target

if (IMAGE && NAME_TITLE && RESUME && SECTION_TITLE) {
    ['wheel', 'touchstart', 'touchmove'].forEach(function(event) {
        document.addEventListener(event, (event) => {
            // Comparitor for the type of device used 
            // extrapolated from the screen width.
            // decides how to record the deltaY
            if(newOpacity >= 0){
                if (event.type === "wheel"){
                    event.cancelable = false;
                    deltaY += event.deltaY;
                } else if (event.type === "touchstart") {
                    initY = event.touches[0].pageY;
                } else if (event.type === 'touchmove') {
                    // Calculate delta for touch move
                    deltaY += (initY - (event.touches[0]?.pageY || initY));
                }
            }

            // Clamp deltaY between 0 and the size of the IMAGE
            deltaY = Math.max(Math.min(deltaY, window.innerHeight * 4.5), 0);

            // Sets manipulation factor values where 0 is floor
            if (deltaY <= 0){ // Indicates negative overscrolling; clamp at "top"
                newZoom = 1;
                newOpacity = 1;
            } else {
                newZoom = INITIAL_ZOOM + deltaY * ZOOM_SPEED;
                //TODO: add blur effect
                newOpacity = INITIAL_ZOOM - deltaY * OPACITY_SPEED;
                // Confine opacity between 0 and 1
                newOpacity = Math.max(0, Math.min(1, newOpacity));
            }

            // Generate positional matrix to move title as deltaY changes
            let transMtx = calcTranslate(newOpacity);

            // Set styles based on deltaY
            IMAGE.style.transform = `scale(${newZoom})`;
            IMAGE.style.opacity = newOpacity;
            IMAGE.style.filter = `blur(${newZoom - 1}px)`
            RESUME.style.opacity = 1 - newOpacity;
            if (event.type === "wheel") {
                transMtx.length === 4 ? (NAME_TITLE.style.transform = `translate(${transMtx[1]}px, -${transMtx[2]}px)`, NAME_TITLE.style.width = `${transMtx[0]}rem`) :null;
            }
            if (newOpacity === 0) {
                RESUME.style.position = "sticky";
                RESUME.style.paddingTop = "16vh";
            } else {
                RESUME.style.position = "fixed"
                RESUME.style.paddingTop = "0";
            }

            if(SECTION_TITLE.getBoundingClientRect().y <= 110) {
                flyOutPrevTitle();
            }
        });
    })
}

function calcTranslate(opacity) {
    let percent = 1 - (opacity / 1);
    let instW = percent * TARGET_W; // width to allow the title to occupy one line
    let instX = percent * TARGET_X; // x position for the title
    let instY = percent * TARGET_Y; // y position for the title
    return [instW, instX, instY, percent];
}

function flyOutPrevTitle() {
    SECTION_TITLE.classList.add("fly-out");
    return null;
}