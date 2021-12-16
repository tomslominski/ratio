const originalWidth = document.querySelector('#original-width');
const originalHeight = document.querySelector('#original-height');
const resizedWidth = document.querySelector('#resized-width');
const resizedHeight = document.querySelector('#resized-height');

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keyup', event => {
        if (originalWidth.value && originalHeight.value && (resizedWidth.value || resizedHeight.value)) {
            if (event.target === resizedWidth) { // Set resized height
                resizedHeight.value = Math.round(resizedWidth.value / originalWidth.value * originalHeight.value);
            } else { // Set resized width
                resizedWidth.value = Math.round(resizedHeight.value / originalHeight.value * originalWidth.value);
            }
        }
    });
});
