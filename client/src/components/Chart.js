import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';


class Chart extends Component {
  render() {
    const { labels, code, data } = this.props;
    const ratesData = (canvas) => {
      const gradient = canvas.getContext('2d').createLinearGradient(500, 0, 100, 0);
      gradient.addColorStop(0, "#c33764");
      gradient.addColorStop(1, "#1d2671");
      return {
        labels,
        datasets: [
          {
            label: code,
            data,
            fill: false,
            backgroundColor: gradient,
            borderColor: gradient,
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
            maxTicksLimit: 10,
            // stepSize: 0.5
          }
        }],
        yAxes: [{
          gridLines: {
            color: 'rgba(256, 256, 256, .1)',
            drawBorder: false
          },
          ticks: {
            fontColor: 'white',
            fontFamily: 'Saira Extra Condensed',
            fontSize: 14,
            maxTicksLimit: 4
          }
        }]
      } 
    };
    return (
      <div>
        <Line data={ratesData} options={options} id="line-chart" />
        {
           
        }
      </div>
    );
  }

  
}

export default Chart;
