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
            //REMOVE CLOG
            console.log(event);
            if (event.type === "wheel"){
                event.cancelable = false;
                // If value goes beyond 0 in negative, reset to 0
                let futureDeltaY = deltaY + event.deltaY;
                futureDeltaY >= 0 ? deltaY = futureDeltaY : deltaY = 0;
                //REMOVE CLOG
                console.log("delta Y: " + deltaY);
            } else if (event.type === "touchstart") {
                initY = event.touches[0].pageY;
            } else {
                let futureDeltaY = deltaY + initY - event.touches[0].pageY;
                futureDeltaY >= 0 ? deltaY = futureDeltaY : deltaY = 0;
            }
            newZoom = initialZoom + deltaY * zoomSpeed;
            newOpacity = initialZoom - deltaY * opacitySpeed;
            let transMtx = calcTranslate(newOpacity);
            //REMOVE CLOG
            console.log("new zoom: " + newZoom);
            image.style.transform = `scale(${newZoom});`;
            image.style.opacity = newOpacity;
            transMtx.length === 3 ? nameTitle.style.transform = `translate(${transMtx[1]}px, -${transMtx[2]}px);` :null;
        });
    })
}

function calcTranslate(opacity) {
    let targetW = 8;
    let targetX = 430;
    let targetY = 260;
    let percent = 1 - (opacity / 1);
    let instW = percent * targetW;
    let instX = percent * targetX;
    let instY = percent * targetY;
    return [instW, instX, instY];
}