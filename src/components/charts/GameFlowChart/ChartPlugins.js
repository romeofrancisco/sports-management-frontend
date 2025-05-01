export const verticalLinePlugin = {
  id: "verticalLine",
  afterDraw(chart) {
    const tooltip = chart.tooltip;
    const xAxis = chart.scales.x;

    if (tooltip?._active?.length) {
      const ctx = chart.ctx;
      const index = tooltip._active[0].index;
      const x = xAxis.getPixelForTick(index);
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#888";
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.restore();
    }
  },
};