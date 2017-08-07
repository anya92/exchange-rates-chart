import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

class Chart extends Component {
  componentWillMount() {
      
  }

  render() {
    const { labels, code, data, points } = this.props;
    const ratesData = (canvas) => {
      const gradient = canvas.getContext('2d').createLinearGradient(500, 0, 100, 0);
      // gradient.addColorStop(0, 'rgba(48, 104, 161, 1)');
      // gradient.addColorStop(0.5, 'rgba(48, 104, 161, 0.5)');
      // gradient.addColorStop(1, 'rgba(48, 104, 161, 0.25)');
      gradient.addColorStop(0, "#1d2671");
      gradient.addColorStop(1, "#c33764");
       // gradient.addColorStop(0, "#89253e");
      // gradient.addColorStop(1, "#3a6186");
      return {
        labels,
        datasets: [
          {
            label: code,
            data,
            fill: false,
            backgroundColor: gradient,
            borderColor: gradient,
            borderWidth: 3
          }
        ]
      };
    };
    const radius = points ? 3 : 0; 
    const options = {
      responsive: true, 
      // maintainAspectRatio: false,
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
        // line: {
          // tension: 2
        // }
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
            color: 'rgba(256, 256, 256, .1)',
            drawBorder: false
          },
          ticks: {
            fontColor: 'white',
            maxTicksLimit: 6
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
