// This file contains variables and functions responsible for the animations 
// within my portfolio.

const image = document.getElementById('landing');
let initialZoom = 1; // Initial scale factor
const zoomSpeed = 0.001; // Amount to increase scale on each scroll

if (image !== undefined && image !== null) {
    ['wheel', 'touchstart', 'touchmove'].forEach(function(event) {
        document.addEventListener(event, (event) => {
            var deltaY = 0;
            var initY = 0;
            console.log("event: " + event);
            if (event.type === "wheel"){
                event.cancelable = false;
                deltaY = event.deltaY;
                console.log("delta Y: " + deltaY);
            } else if (event.type === "touchstart") {
                initY = event.touches[0].pageY;
            } else {
                deltaY = initY - event.touches[0].pageY;
            }
            const newZoom = initialZoom + deltaY * zoomSpeed;
            const newOpacity = initialZoom - deltaY * zoomSpeed;
            console.log("new zoom: " + newZoom)
            image.style.transform = `scale(${newZoom});\nopacity: ${newOpacity}`;
        });
    })
}