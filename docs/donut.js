const screen_size = 40;
const theta_spacing = 0.07;
const phi_spacing = 0.02;
const illumination = ".,-~:;=!*#$@";

// Spinning donut based on https://gist.github.com/Denbergvanthijs/7f6936ca90a683d37216fd80f5750e9c

let A = 1;
let B = 1;
const R1 = 1;
const R2 = 2;
const K2 = 5;
const K1 = screen_size * K2 * 3 / (8 * (R1 + R2));

function renderFrame(A, B) {
    const cosA = Math.cos(A);
    const sinA = Math.sin(A);
    const cosB = Math.cos(B);
    const sinB = Math.sin(B);

    const output = Array(screen_size).fill(' ').map(() => Array(screen_size).fill(' '));
    const zbuffer = Array(screen_size).fill(0).map(() => Array(screen_size).fill(0));

    const cos_phi = Array.from({ length: Math.ceil(2 * Math.PI / phi_spacing) }, (_, i) => Math.cos(i * phi_spacing));
    const sin_phi = Array.from({ length: Math.ceil(2 * Math.PI / phi_spacing) }, (_, i) => Math.sin(i * phi_spacing));
    const cos_theta = Array.from({ length: Math.ceil(2 * Math.PI / theta_spacing) }, (_, i) => Math.cos(i * theta_spacing));
    const sin_theta = Array.from({ length: Math.ceil(2 * Math.PI / theta_spacing) }, (_, i) => Math.sin(i * theta_spacing));

    const circle_x = cos_theta.map(cosT => R2 + R1 * cosT);
    const circle_y = sin_theta.map(sinT => R1 * sinT);

    for (let i = 0; i < cos_theta.length; i++) {
        for (let j = 0; j < cos_phi.length; j++) {
            const x = circle_x[i] * (cosB * cos_phi[j] + sinA * sinB * sin_phi[j]) - circle_y[i] * cosA * sinB;
            const y = circle_x[i] * (sinB * cos_phi[j] - sinA * cosB * sin_phi[j]) + circle_y[i] * cosA * cosB;
            const z = K2 + cosA * circle_x[i] * sin_phi[j] + circle_y[i] * sinA;
            const ooz = 1 / z;

            const xp = Math.floor(screen_size / 2 + K1 * ooz * x);
            const yp = Math.floor(screen_size / 2 - K1 * ooz * y);

            const L1 = cos_phi[j] * cos_theta[i] * sinB - cosA * sin_phi[j] * cos_theta[i] - sinA * sin_theta[i];
            const L2 = cosB * (cosA * sin_theta[i] - sin_phi[j] * cos_theta[i] * sinA);
            const L = Math.floor((L1 + L2) * 8);

            if (L > 0 && ooz > zbuffer[xp][yp]) {
                zbuffer[xp][yp] = ooz;
                output[xp][yp] = illumination[L];
            }
        }
    }
    return output.map(row => row.join('')).join('\n');
}

function animate() {
    A += theta_spacing;
    B += phi_spacing;
    document.getElementById('donut').innerText = renderFrame(A, B);
    setTimeout(animate, 50); // Adjust the delay as needed
}

animate();
