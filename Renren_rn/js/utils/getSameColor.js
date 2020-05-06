export default function getSameColor(val) {
    let color = val;
    let m = color.match(/[\da-z]{2}/g);
    for (let i = 0; i < m.length; i++) m[i] = parseInt(m[i], 16);
    let colors = [];
    for(let i=0; i< 10; i++) {
        colors[i] =
            Math.floor(m[0] + (Math.random() < 0.5 ? -1 : 1) * Math.random() * 20).toString(16) +
            Math.floor(m[1] + (Math.random() < 0.5 ? -1 : 1) * Math.random() * 20).toString(16) +
            Math.floor(m[2] + (Math.random() < 0.5 ? -1 : 1) * Math.random() * 20).toString(16);
    }
    return colors
}
