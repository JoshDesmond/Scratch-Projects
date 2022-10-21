export function div2Add11(x) {
    if (x % 2 == 1) {
        x += 11;
    }

    x /= 2;

    if (x % 2 == 1) {
        x += 11;
    }

    return x;
}

/**
 * Generates a random yy digit.
 * @returns {Number} A number between 0 and 99
 */
export function getRandomYYInput() {
    return Math.floor(Math.random() * 100);
}

/**
 * Checks if the output is valid for the given input 
 * @param {Number} input 
 * @param {Number} output 
 * @returns 
 */
export function checkValidity(input, output) {
    if (input < 100 && input > 0) {
        return div2Add11(input) === output;
    } else {
        throw new TypeError(`Illegal input ${input}`);
    }
}