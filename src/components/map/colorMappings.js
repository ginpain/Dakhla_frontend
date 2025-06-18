// colorMappings.js

// Define unique color palettes for each raster layer
const temperaturePalette = ['#30123b', '#4147ad', '#4777ef', '#38a5fb', '#1bd0d5', '#26eda6', '#64fd6a', '#a4fc3c', '#d3e835', '#f5c63a', '#fe992c', '#f36315', '#d93807', '#b01901', '#7a0403'];
const srtmPalette = ['#30123b', '#4147ad', '#4777ef', '#38a5fb', '#1bd0d5', '#26eda6', '#64fd6a', '#a4fc3c', '#d3e835', '#f5c63a', '#fe992c', '#f36315', '#d93807', '#b01901', '#7a0403'];
const slopePalette = ['#30123b', '#4147ad', '#4777ef', '#38a5fb', '#1bd0d5', '#26eda6', '#64fd6a', '#a4fc3c', '#d3e835', '#f5c63a', '#fe992c', '#f36315', '#d93807', '#b01901', '#7a0403'];
const ghiPalette = ['#30123b', '#4147ad', '#4777ef', '#38a5fb', '#1bd0d5', '#26eda6', '#64fd6a', '#a4fc3c', '#d3e835', '#f5c63a', '#fe992c', '#f36315', '#d93807', '#b01901', '#7a0403'];
const dhiPalette = ['#30123b', '#4147ad', '#4777ef', '#38a5fb', '#1bd0d5', '#26eda6', '#64fd6a', '#a4fc3c', '#d3e835', '#f5c63a', '#fe992c', '#f36315', '#d93807', '#b01901', '#7a0403'];
const bniPalette = ['#30123b', '#4147ad', '#4777ef', '#38a5fb', '#1bd0d5', '#26eda6', '#64fd6a', '#a4fc3c', '#d3e835', '#f5c63a', '#fe992c', '#f36315', '#d93807', '#b01901', '#7a0403'];
const ws10mPalette = ['#2c7bb6', '#5096c5', '#75b1d3', '#99cce2', '#b7dee3', '#cfe9d7', '#e7f4cb', '#ffffbf', '#fee8a4', '#fed189','#fdba6e', '#f89957', '#ed6e43', '#e24430', '#d7191c' ];
const pvProdPalette = ['#30123b', '#4147ad', '#4777ef', '#38a5fb', '#1bd0d5', '#26eda6', '#64fd6a', '#a4fc3c', '#d3e835', '#f5c63a', '#fe992c', '#f36315', '#d93807', '#b01901', '#7a0403'];

// General function to get color based on value and palette
function getColor(value, min, max, noDataValue, palette) {
    if (value === noDataValue) return 'rgba(0, 0, 0, 0)'; // Transparent for No-Data

    value = Math.max(min, Math.min(max, value)); // Clamp value within [min, max]
    const interval = (max - min) / 15;

    for (let i = 0; i < 15; i++) {
        if (value <= min + (i + 1) * interval) {
            return palette[i];
        }
    }

    return palette[14]; // Last color as default
}

// Functions for each raster layer using their specific palettes
export function getColorForTEMPERATURE(value) {
    const min = 21.3249876, max = 26.5749811;
    const noDataValue = -3.40282e+38;
    return getColor(value, min, max, noDataValue, temperaturePalette);
}

export function getColorForSRTM(value) {
    const min = 13, max = 362;
    const noDataValue = 65535;
    return getColor(value, min, max, noDataValue, srtmPalette);
}

export function getColorForSLOPE(value) {
    const min = 0.0540772, max = 1.7180929;
    const noDataValue = -3.40282e+38;
    return getColor(value, min, max, noDataValue, slopePalette);
}

export function getColorForGHI(value) {
    const min = 2177, max = 2292;
    const noDataValue = 65535;
    return getColor(value, min, max, noDataValue, ghiPalette);
}

export function getColorForDHI(value) {
    const min = 561, max = 646;
    const noDataValue = 65535;
    return getColor(value, min, max, noDataValue, dhiPalette);
}

export function getColorForBNI(value) {
    const min = 2130, max = 2457;
    const noDataValue = 65535;
    return getColor(value, min, max, noDataValue, bniPalette);
}

export function getColorForWS10m(value) {
    const min = 4.7567077, max = 6.9427237;
    const noDataValue = -3.40282e+38;
    return getColor(value, min, max, noDataValue, ws10mPalette);
}

export function getColorForPVPROD(value) {
    const min = 7220.0439389, max = 7597.1570926;
    const noDataValue = -3.40282e+38;
    return getColor(value, min, max, noDataValue, pvProdPalette);
}
