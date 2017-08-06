import React from 'react';
import { Line } from 'react-chartjs-2';

const Chart = ({ code, labels, data }) => {
 
  const ratesData = {
    labels,
    datasets: [{
      label: code,
      data,
      backgroundColor: 'transparent',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 2
    }]
  }; 
  const options = {
    responsive: true, 
    maintainAspectRatio: false,
    animation: {
          duration: 1000,
          easing: 'easeInOutSine'
        },
        elements: {
          point: {
            radius: 0
          }
        },
        scales: {
          xAxes: [{
            display: true,
            ticks: {
              stepSize: 30
            },
            gridLines: {
              display: false
            }
          }]
        } 
  };
  return (
    <div>
      <Line data={ratesData} height={400} options={options} />
    </div>
  );
};

export default Chart;
