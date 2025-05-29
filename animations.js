    const imageContainer = document.querySelector('landing');
    let initialZoom = 1; // Initial scale factor
    const zoomSpeed = 0.01; // Amount to increase scale on each scroll

    document.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const newZoom = initialZoom + scrollPosition * zoomSpeed;
        imageContainer.style.transform = `scale(${newZoom})`;
    });