import React, { Component } from 'react';
import moment from 'moment';
import Chart from './Chart';

require('moment/locale/pl');
moment.locale('pl');

class SingleCurr extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayChart: 'month' // six-months, year
    }
  }

  changeChart = (displayChart) => {
    this.setState({ displayChart });
    document.querySelectorAll('.chooseDisplay').forEach(p => p.classList.remove('active'));
    document.querySelector(`.${displayChart}`).classList.add('active');
  }

  render() {
    const { currency, code, rates, deleteCode } = this.props;
    const lastRate = rates[rates.length - 1].mid;
    const date = rates[rates.length - 1].effectiveDate;
    let labels = [], data = [];
    rates.forEach(rate => {
      labels.push(rate.effectiveDate);
      data.push(rate.mid);
    });

    return (
      <div className="currencyCard">
        <div className="currencyCard__header">
          <p className="currencyCard__header__currency">{currency}</p>
          <p className="currencyCard__header__code">1 {code}</p>
          <p className="currencyCard__header__rate"><span>{Number(lastRate).toFixed(4)}</span> PLN</p>
          <p className="currencyCard__header__delete" onClick={() => deleteCode(code)}>&#10005;</p>
        </div>
        <div className="currencyCard__chart">
        <div className="currencyCard__chart__date">
          <p>{moment(date).format('DD-MM-YYYY')}</p>
        </div>
          <div className="currencyCard__chart__choose">
            <p onClick={() => this.changeChart('month')} className="chooseDisplay month">miesiąc</p>
            <p onClick={() => this.changeChart('six-months')} className="chooseDisplay six-months">pół roku</p>
            <p onClick={() => this.changeChart('year')} className="chooseDisplay year active">rok</p>
          </div>
          <Chart code={code} labels={labels} data={data} display={this.state.displayChart} />
        </div>
      </div>
    );
  }
}

export default SingleCurr;
