// This file contains variables and functions responsible for the animations 
// within my portfolio.
// Author: Elliot Warren
// linkedIn: https://www.linkedin.com/in/elliot-warren/

const image = document.getElementById('landing');
const nameTitle = document.getElementById('name');
let initialZoom = 1; // Initial scale factor
const zoomSpeed = 0.005; // Amount to increase scale on each wheel event
var newZoom = 0; // Value to set scale property to
const opacitySpeed = 0.0005 // Amount to scale opacity on each wheel event
var newOpacity = 0 // Value to set to opacity property to
var deltaY = 0; // pixel distance "covered" per wheel event
var initY = 0; // Start location for reference on mobile
const targetW = 4; // Additional width to grant the name space to be 1 ln
const targetX = 430; // Desktop X translation target
const targetY = 260; // Desktop Y translation target

if (image && nameTitle) {
    ['wheel', 'touchstart', 'touchmove'].forEach(function(event) {
        document.addEventListener(event, (event) => {
            // Comparitor for the type of device used 
            // extrapolated from the screen width.
            // decides how to record the deltaY
            console.log("deltaY: " + deltaY);
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

            // Sets manipulation factor values where 0 is floor
            if (deltaY <= 0){
                newZoom = 1;
                newOpacity = 1;
            } else {
                newZoom = initialZoom + deltaY * zoomSpeed;
                newOpacity = initialZoom - deltaY * opacitySpeed;
                newOpacity = Math.max(0, Math.min(1, newOpacity));
            }
            console.log("newZoom: " + newZoom);
            console.log("newOpacity: " + newOpacity);

            let transMtx = calcTranslate(newOpacity);
            console.log(transMtx);
            console.log("Computed transform:", getComputedStyle(image).transform);
            console.log(`scale(${newZoom});`);
            image.style.transform = `scale(${newZoom});`;
            image.style.opacity = newOpacity;
            transMtx.length === 3 ? nameTitle.style.transform = `translate(${transMtx[1]}px, -${transMtx[2]}px);` :null;
        });
    })
}

function calcTranslate(opacity) {
    console.log("opacity inside fn: " + opacity);
    let percent = 1 - (opacity / 1);
    let instW = percent * targetW;
    let instX = percent * targetX;
    let instY = percent * targetY;
    return [instW, instX, instY];
}