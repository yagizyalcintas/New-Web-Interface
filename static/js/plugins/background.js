/**
 * This plugin is used to set the background color of
 * the graph.
 */
const background = {
    id: 'custom_canvas_background_color',
    beforeDraw: (chart) => {
        const ctx = chart.canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = 'rgb(40, 47, 63)';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    }
};