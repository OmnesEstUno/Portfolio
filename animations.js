// This file contains variables and functions responsible for the animations 
// within my portfolio.
// Author: Elliot Warren
// linkedIn: https://www.linkedin.com/in/elliot-warren/

const image = document.getElementById('landing');
const nameTitle = document.getElementById('name');
const resume = document.getElementById('resume');
let initialZoom = 1; // Initial scale factor
const zoomSpeed = 0.005; // Amount to increase scale on each wheel event
var newZoom = 0; // Value to set scale property to
const opacitySpeed = 0.0005 // Amount to scale opacity on each wheel event
var newOpacity = 0 // Value to set to opacity property to
var deltaY = 0; // pixel distance "covered" per wheel event
var initY = 0; // Start location for reference on mobile
const targetW = 15; // Additional width to grant the name space to be 1 ln
const targetX = 300; // Desktop X translation target
const targetY = 260; // Desktop Y translation target

if (image && nameTitle && resume) {
    ['wheel', 'touchstart', 'touchmove'].forEach(function(event) {
        document.addEventListener(event, (event) => {
            // Comparitor for the type of device used 
            // extrapolated from the screen width.
            // decides how to record the deltaY
            console.log(document.documentElement.scrollHeight);
            if(newOpacity >= 0 && event.deltaY <= document.documentElement.scrollHeight){
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

            // Sets manipulation factor values where 0 is floor
            if (deltaY <= 0){
                newZoom = 1;
                newOpacity = 1;
            } else {
                newZoom = initialZoom + deltaY * zoomSpeed;
                newOpacity = initialZoom - deltaY * opacitySpeed;
                // Confine opacity between 0 and 1
                newOpacity = Math.max(0, Math.min(1, newOpacity));
            }

            // Generate positional matrix to move title as deltaY changes
            let transMtx = calcTranslate(newOpacity);

            // Set styles based on deltaY
            image.style.transform = `scale(${newZoom})`;
            image.style.opacity = newOpacity;
            resume.style.opacity = 1 - newOpacity;
            transMtx.length === 4 ? (nameTitle.style.transform = `translate(${transMtx[1]}px, -${transMtx[2]}px)`, nameTitle.style.width = `${transMtx[0]}rem`) :null;
        });
    })
}

function calcTranslate(opacity) {
    let percent = 1 - (opacity / 1);
    let instW = percent * targetW; // width to allow the title to occupy one line
    let instX = percent * targetX; // x position for the title
    let instY = percent * targetY; // y position for the title
    return [instW, instX, instY, percent];
}