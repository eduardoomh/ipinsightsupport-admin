
export const colors = [
    "#01A2AE",
    "#7265e6",
    "#ff7f50",
    "#87d068",
    "#108ee9",
    "#13c2c2",
];

export const getColorForName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};