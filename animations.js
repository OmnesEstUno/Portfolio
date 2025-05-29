    const image = document.getElementsByClassName('landing');
    let initialZoom = 1; // Initial scale factor
    const zoomSpeed = 0.01; // Amount to increase scale on each scroll

    document.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const newZoom = initialZoom + scrollPosition * zoomSpeed;
        image.style.transform = `scale(${newZoom})`;
    });