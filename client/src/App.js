import React, { Component } from "react";
import SelectedFoods from "./SelectedFoods";
import FoodSearch from "./FoodSearch";

// import ReactGA from 'react-ga';
// ReactGA.initialize('G-6K6TD38WSJ');
// ReactGA.pageview(window.location.pathname + window.location.search);

import logo from "./../images/Logo4.png";

// console.log(logo);
class App extends Component {
  state = {
    selectedFoods: [],
    visible: false,
  };

  componentDidMount() {
    if (localStorage.getItem("myValueInLocalStorage"))
      this.setState({
        selectedFoods: JSON.parse(
          localStorage.getItem("myValueInLocalStorage")
        ),
      });
  }

  removeFoodItem = (itemIndex) => {
    const filteredFoods = this.state.selectedFoods.filter(
      (item, idx) => itemIndex !== idx
    );
    // this.setState({ selectedFoods: filteredFoods });
    this.setState({ selectedFoods: filteredFoods }, () => {
      localStorage.setItem(
        "myValueInLocalStorage",
        JSON.stringify(this.state.selectedFoods)
      );
    });
  };

  addFood = (food) => {
    // console.log(food.Word);console.log(this.state.selectedFoods);
    var index = this.state.selectedFoods.findIndex((x) => x.Word === food.Word);
    if (index === -1) {
      // console.log("This item does not exists");
      const newFoods = this.state.selectedFoods.concat(food);
      this.setState({ selectedFoods: newFoods }, () => {
        localStorage.setItem(
          "myValueInLocalStorage",
          JSON.stringify(this.state.selectedFoods)
        );
      });
    }
  };

  render() {
    const { selectedFoods } = this.state;


    return (
      <div className="App">
        <div className="ui secondary  menu">
          <div className="right menu">
            <a
              className="ui item"
              href="https://github.com/lameguest21/ministry-of-vocabulary"
              target="blank"
            >
              <i className="github large icon"></i>
            </a>

          
          </div>
        </div>

        

        <div className="ui text container">
          <img className="image" src={logo} alt="MOV logo" />
        </div>
        {/* <h1>Ministry of Vocabulary</h1> */}
        <div className="rowTable">
          <div className="columnTable">
            <FoodSearch onFoodClick={this.addFood} />
          </div>
          <div className="columnTable">
            <SelectedFoods
              foods={selectedFoods}
              onFoodClick={this.removeFoodItem}
            />
          </div>
        </div>
        {/* <footer className="footercustom">
              <div>
              Ministry of Vocabulary is a guide to complex English words from Tharoorosaurus. <i className="india flag"></i>
              </div>
               <br></br>
               <div>
              A Project by <a target="blank" href="https://palashshrivastava.tech">Palash Shrivastava </a>
              </div>
                </footer> */}
      </div>
    );
  }
}

export default App;
