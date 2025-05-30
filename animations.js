const image = document.getElementById('landing');
let initialZoom = 1; // Initial scale factor
const zoomSpeed = 0.001; // Amount to increase scale on each scroll

if (image !== undefined && image !== null) {
    document.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        console.log(scrollPosition);
        const newZoom = initialZoom + scrollPosition * zoomSpeed;
        image.style.transform = `scale(${newZoom})`;
    });
}