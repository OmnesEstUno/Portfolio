// This file contains variables and functions responsible for the animations 
// within my portfolio.

const image = document.getElementById('landing');
const nameTitle = document.getElementById('name');
let initialZoom = 1; // Initial scale factor
const zoomSpeed = 0.005; // Amount to increase scale on each scroll
var newZoom = 0;
const opacitySpeed = 0.0005
var newOpacity = 0
var deltaY = 0;
var initY = 0;

if (image !== undefined && image !== null && nameTitle !== undefined && nameTitle !== null) {
    ['wheel', 'touchstart', 'touchmove'].forEach(function(event) {
        document.addEventListener(event, (event) => {
            if (event.type === "wheel"){
                event.cancelable = false;
                // If value goes beyond 0 in negative, reset to 0
                let futureDeltaY = deltaY + event.deltaY;
                futureDeltaY >= 0 ? deltaY = futureDeltaY : deltaY = 0;
            } else if (event.type === "touchstart") {
                initY = event.touches[0].pageY;
            } else {
                let futureDeltaY = deltaY + initY - event.touches[0].pageY;
                futureDeltaY >= 0 ? deltaY = futureDeltaY : deltaY = 0;
            }
            newZoom = initialZoom + deltaY * zoomSpeed;
             let futureOpacity = initialZoom - deltaY * opacitySpeed;
            futureOpacity >= 0 ? newOpacity = futureOpacity : newOpacity = 0;
            let transMtx = calcTranslate(newOpacity);
            console.log(transMtx);
            image.style.transform = `scale(${newZoom});`;
            image.style.opacity = newOpacity;
            transMtx.length === 3 ? nameTitle.style.transform = `translate(${transMtx[1]}px, -${transMtx[2]}px);` :null;
        });
    })
}

function calcTranslate(opacity) {
    console.log("opacity inside fn: " + opacity);
    let targetW = 4;
    let targetX = 430;
    let targetY = 260;
    let percent = 1 - (opacity / 1);
    let instW = percent * targetW;
    let instX = percent * targetX;
    let instY = percent * targetY;
    return [instW, instX, instY];
}