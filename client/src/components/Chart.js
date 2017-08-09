import React from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

const mainColor = '#D9B310';
// const secondColor = '#0B3C5D';

require('moment/locale/pl');
moment.locale('pl');

const Chart = ({ labels, code, data, display }) => {

  let monthData = data.slice(- (data.length / 12)),
    sixMonthsData = data.slice(- (data.length / 2)),
    yearData = data;

  let monthLabels = labels.slice(- (data.length / 12)).map(date => moment(date).format('DD MMM')),
    sixMonthsLabels = labels.slice(- (data.length / 2)).map(date => moment(date).format('DD MMM')) ,
    yearLabels = labels.map(date => moment(date).format('MMM \'YY'));

  let displayData = {
    'month': monthData,
    'six-months': sixMonthsData,
    'year': yearData
  };

  let displayLabels = {
    'month': monthLabels,
    'six-months': sixMonthsLabels,
    'year': yearLabels
  };

  const ratesData = (canvas) => {
    // const gradient = canvas.getContext('2d').createLinearGradient(0, 0, 250, 0);
    // gradient.addColorStop(1, mainColor);
    // gradient.addColorStop(0, secondColor);
    return {
      labels: displayLabels[display],
      datasets: [
        {
          label: code,
          data: displayData[display],
          fill: false,
          backgroundColor: mainColor,
          borderColor: mainColor,
          borderWidth: 2
        }
      ]
    };
  };
  const options = {
    responsive: true, 
    animation: false,
    legend: {
      display: false
    },
    scaleGridLineColor: "#3068A1",
    elements: {
      point: {
        radius: 0,
        pointBackgroundColor: "red",
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
          fontFamily: 'Saira Extra Condensed',
          fontSize: 14,
          maxTicksLimit: 12,
          // stepSize: 0.5
        }
      }],
      yAxes: [{
        gridLines: {
          color: 'rgba(256, 256, 256, .2)',
          drawBorder: false
        },
        ticks: {
          fontColor: 'white',
          fontFamily: 'Saira Extra Condensed',
          fontSize: 14,
          maxTicksLimit: 4,
          padding: 10
        }
      }]
    } 
  };
  return <Line data={ratesData} options={options} id="line-chart" />;
};

export default Chart;
