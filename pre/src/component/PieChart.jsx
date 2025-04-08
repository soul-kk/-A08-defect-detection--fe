import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const PieChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current);
    const option = {
      tooltip: { trigger: 'item' },
      legend: { top: '5%', left: 'center' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 20 } },
        data: data.map(item => ({
          value: item.value,
          name: item.label
        }))
      }]
    };

    myChart.setOption(option);

    // 响应式调整
    const resizeHandler = () => myChart.resize();
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [data]);

  return <div ref={chartRef} style={{ width: '600px', height: '400px' }} />;
};

export default PieChart;