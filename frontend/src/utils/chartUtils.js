import { CHART_COLORS } from './constants';

// Generate chart colors
export const generateColors = (count) => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'
  ];
  
  if (count <= colors.length) {
    return colors.slice(0, count);
  }
  
  // Generate additional colors
  const additionalColors = [];
  for (let i = colors.length; i < count; i++) {
    additionalColors.push(generateRandomColor());
  }
  
  return [...colors, ...additionalColors];
};

// Generate random color
const generateRandomColor = () => {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
};

// Format chart data
export const formatChartData = (data, labelKey, valueKey) => {
  return {
    labels: data.map(item => item[labelKey]),
    datasets: [{
      data: data.map(item => item[valueKey]),
      backgroundColor: generateColors(data.length),
      borderWidth: 1
    }]
  };
};

// Format line chart data
export const formatLineChartData = (data, labelKey, datasets) => {
  const colors = generateColors(datasets.length);
  
  return {
    labels: data.map(item => item[labelKey]),
    datasets: datasets.map((dataset, index) => ({
      label: dataset.label,
      data: data.map(item => item[dataset.key]),
      borderColor: colors[index],
      backgroundColor: colors[index] + '20',
      tension: 0.4,
      fill: dataset.fill || false
    }))
  };
};

// Format bar chart data
export const formatBarChartData = (data, labelKey, datasets) => {
  const colors = generateColors(datasets.length);
  
  return {
    labels: data.map(item => item[labelKey]),
    datasets: datasets.map((dataset, index) => ({
      label: dataset.label,
      data: data.map(item => item[dataset.key]),
      backgroundColor: colors[index],
      borderColor: colors[index],
      borderWidth: 1
    }))
  };
};

// Format pie/doughnut chart data
export const formatPieChartData = (data, labelKey, valueKey) => {
  return {
    labels: data.map(item => item[labelKey]),
    datasets: [{
      data: data.map(item => item[valueKey]),
      backgroundColor: generateColors(data.length),
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };
};

// Default chart options
export const getDefaultChartOptions = (type = 'line') => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      }
    }
  };

  const typeSpecificOptions = {
    line: {
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    },
    bar: {
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    },
    pie: {
      plugins: {
        legend: {
          position: 'right'
        }
      }
    },
    doughnut: {
      plugins: {
        legend: {
          position: 'right'
        }
      },
      cutout: '70%'
    }
  };

  return {
    ...baseOptions,
    ...typeSpecificOptions[type]
  };
};

// Calculate chart statistics
export const calculateChartStats = (data) => {
  if (!data || data.length === 0) return null;

  const values = data.map(item => typeof item === 'object' ? Object.values(item)[0] : item);
  const sum = values.reduce((acc, val) => acc + val, 0);
  const avg = sum / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);

  return { sum, avg, max, min, count: values.length };
};

// Group data by period
export const groupByPeriod = (data, dateKey, period = 'day') => {
  const grouped = {};

  data.forEach(item => {
    const date = new Date(item[dateKey]);
    let key;

    switch (period) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'year':
        key = String(date.getFullYear());
        break;
      default:
        key = date.toISOString().split('T')[0];
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });

  return grouped;
};

// Generate trend data
export const generateTrendData = (data, valueKey) => {
  if (data.length < 2) return { trend: 'neutral', percentage: 0 };

  const values = data.map(item => item[valueKey]);
  const latest = values[values.length - 1];
  const previous = values[values.length - 2];
  
  const difference = latest - previous;
  const percentage = (difference / previous) * 100;

  return {
    trend: difference > 0 ? 'up' : difference < 0 ? 'down' : 'neutral',
    percentage: Math.abs(percentage).toFixed(2),
    difference
  };
};

// Export chart as image
export const exportChartAsImage = (chartRef, filename = 'chart.png') => {
  if (!chartRef || !chartRef.toBase64Image) return;

  const base64Image = chartRef.toBase64Image();
  const link = document.createElement('a');
  link.href = base64Image;
  link.download = filename;
  link.click();
};

export default {
  generateColors,
  formatChartData,
  formatLineChartData,
  formatBarChartData,
  formatPieChartData,
  getDefaultChartOptions,
  calculateChartStats,
  groupByPeriod,
  generateTrendData,
  exportChartAsImage
};
