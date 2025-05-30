const image = document.getElementById('landing');
let initialZoom = 1; // Initial scale factor
const zoomSpeed = 0.001; // Amount to increase scale on each scroll
var deltaY = 0;
var initY = 0;

if (image !== undefined && image !== null) {
    ['wheel', 'touchstart', 'touchmove'].forEach(function(event) {
        document.addEventListener(event, () => {
            if (event === "wheel"){
                deltaY = event.deltaY;
                console.log(deltaY);
            } else if (event === "touchstart") {
                initY = event.touches[0].pageY;
            } else {
                deltaY = start.y - event.touches[0].pageY;
            }
            const newZoom = initialZoom + deltaY * zoomSpeed;
            const newOpacity = initialZoom - deltaY * zoomSpeed;
            image.style.transform = `scale(${newZoom});\nopacity: ${newOpacity}`;
        });
    })
}