const image = document.getElementById('landing');
let initialZoom = 1; // Initial scale factor
const zoomSpeed = 0.001; // Amount to increase scale on each scroll

if (image !== undefined && image !== null) {
    ['wheel', 'touchmove'].forEach(function(event) {
        document.addEventListener(event, () => {
            const scrollPosition = WheelEvent.deltaY;
            console.log(scrollPosition);
            const newZoom = initialZoom + scrollPosition * zoomSpeed;
            const newOpacity = initialZoom - scrollPosition * zoomSpeed;
            image.style.transform = `scale(${newZoom});\nopacity: ${newOpacity}`;
        });
    })
}