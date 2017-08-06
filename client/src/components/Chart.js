import React from 'react';
import { Line } from 'react-chartjs-2';

const Chart = ({ code, labels, data, points }) => {
 
  const ratesData = {
    labels,
    datasets: [{
      label: code,
      data,
      fill: false,
      backgroundColor: 'white',
      borderColor: 'white',
      borderWidth: 2
    }]
  };
  const radius = points ? 3 : 0; 
  const options = {
    responsive: true, 
    // maintainAspectRatio: false,
    animation: false,
    legend: {
      display: false
    },
    scaleGridLineColor: "white",
    elements: {
      point: {
        radius,
        pointBackgroundColor: "white",
        pointStyle: 'circle'
      }
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          fontColor: 'white',
          maxTicksLimit: 6,
          stepSize: 0.5
        }
      }],
      yAxes: [{
        gridLines: {
          color: 'rgba(256, 256, 256, .4)',
          drawBorder: false
        },
        ticks: {
          fontColor: 'white',
          maxTicksLimit: 5
        }
      }]
    } 
  };
  return (
    <div>
      <Line data={ratesData} options={options} />
    </div>
  );
};

export default Chart;
