import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import Loader from './Loader';

const CITIES = [
  { id: 1, name: 'BANGALORE' },
  { id: 2, name: 'CHENNAI' },
  { id: 3, name: 'MUMBAI' },
  { id: 4, name: 'DELHI' },
  { id: 5, name: 'KOLKATTA' }
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCity: "BANGALORE",
      limit: 50,
      totalCount: 0,
      isLoading: true,
      filterBy: "branch",
      offset: 0,
      perPage: 50,
      cities: CITIES,
      limits: [50, 100, 150, 200],
      initialList: [],
      banks: []
    }
  }
  componentDidMount() {
    this.fetchCities();
  }

  componentDidUpdate(prevProps, prevState) {
    let { limit, selectedCity, offset } = this.state;

    if (prevState.offset !== offset || prevState.limit !== limit || prevState.selectedCity !== selectedCity) {
      this.fetchCities();
    }
  }

  fetchCities() {
    let { selectedCity, limit, offset } = this.state;
    // city = city || this.state.selectedCity;
    let url = `https://app.fyle.in/api/bank_branches?city=${selectedCity}&offset=${offset}&limit=${limit}`
    axios.get(url).then((response) => {
      let count = this.state.totalCount + response.data.length;
      this.setState({
        initialList: response.data,
        banks: response.data,
        totalCount: count,
        isLoading: false
      })
    }).catch((error) => {
      // show user error
    })
  }

  changeLimit(event) {
    this.setState({
      limit: event.target.value,
      totalCount: 0,
      isLoading: true
    });
    // this.fetchCities(event.target.value);
  }

  changeCity(event) {
    this.setState({
      selectedCity: event.target.value,
      totalCount: 0,
      isLoading: true
    });
    // this.fetchCities(event.target.value);
  }
  filterBanks(term) {
    let filteredBanks = this.state.initialList;
    let { filterBy } = this.state;
    if(term.target.value) {
      filteredBanks = this.state.initialList.filter((bank) => {
        return bank[filterBy].toLowerCase().indexOf(term.target.value.toLowerCase()) > -1;
      });
    }

    this.setState({
      banks: filteredBanks
    });
  }

  loadNextPage(value, event) {
    let offset = this.state.offset;
    offset =  value === 'next' ?  offset + 50 : offset - 50;
    this.setState({
      offset: offset
    });
  }
  render() {
    let { limits, cities, banks, offset } = this.state;
    return (
      <div className="container">
        <header>
          <h1 className="title">Welcome to Bank Finder</h1>
        </header>
        <p className="intro">
          Select a city or filter banks below
        </p>
        <div className="searchContainer">
          <select value={this.state.selectedCity} onChange={this.changeCity.bind(this)}>
            {
              cities.map((city) => {
                return <option key={city.id} value={city.name}>{city.name}</option>
              })
            }
          </select>
          <span>Filter By:</span>
          <select value={this.state.filterBy} onChange={(e) => this.setState({ filterBy: e.target.value })}>
            <option value="branch">BRANCH</option>
            <option value="bank_name">BANK NAME</option>
          </select>
          <input type="text" value={this.state.filterTerm} onKeyUp={this.filterBanks.bind(this)} placeholder="Filter banks" autoFocus/>
          <span>Limit:</span>
          <select className="" value={this.state.limit} onChange={this.changeLimit.bind(this)}>
            {
              limits.map((limit, index) => {
                return <option key={index} value={limit}>{limit}</option>
              })
            }
          </select>
          <div className="pagination">
            <span className={offset < 1 ? "prev disabled" : "prev" } onClick={this.loadNextPage.bind(this, 'prev')}>previos</span>
            <span className="next" onClick={this.loadNextPage.bind(this, 'next')}>next</span>
          </div>
        </div>
        <div>
        <table border="1">
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>IFSC</th>
              <th>Name</th>
              <th>Branch</th>
              <th>City</th>
              <th>Adress</th>
            </tr>
          </thead>
          <tbody>
            {
              banks.map((bank, index) => {
                return (
                  <tr key={bank.ifsc}>
                    <td>{index+1}</td>
                    <td>{bank.ifsc}</td>
                    <td>{bank.bank_name}</td>
                    <td>{bank.branch}</td>
                    <td>{bank.city}</td>
                    <td className="address">{bank.address}</td>
                  </tr>
                )
              })
            }

          </tbody>
        </table>
        </div>
        {
          this.state.isLoading ? <Loader /> : null
        }

      </div>
    );
  }
}

export default App;
