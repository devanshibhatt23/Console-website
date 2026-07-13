// Codeforces-style rating color bands.
// Used to color a user's rating number based on their rank tier.
export const getCodeforcesRatingColor = (rating) => {
    const r = Number(rating) || 0;
    if (r >= 2400) return '#FF0000'; // red - grandmaster+
    if (r >= 2100) return '#FF8C00'; // orange - master
    if (r >= 1900) return '#AA00AA'; // violet/purple - candidate master
    if (r >= 1600) return '#0000FF'; // blue - expert
    if (r >= 1400) return '#03A89E'; // cyan - specialist
    if (r >= 1200) return '#008000'; // green - pupil
    return '#808080'; // grey - newbie
};

// Simplified "pink/violet/green/grey" scheme matching the requested reference design.
export const getRatingColor = (rating) => {
    const r = Number(rating) || 0;
    if (r >= 2400) return '#FF6B9D'; // pink
    if (r >= 2000) return '#B565F5'; // violet
    if (r >= 1600) return '#7C3AED'; // purple
    if (r >= 1200) return '#22C55E'; // green
    return '#9CA3AF'; // grey
};
