import React, { Component } from "react";
import SelectedFoods from "./SelectedFoods";
import FoodSearch from "./FoodSearch";

import logo from "./../images/LOGO.png"; 

// console.log(logo);
class App extends Component {
  state = {
    selectedFoods: []
  };

  componentDidMount() {
    // this.ele.focus();
    this.setState({ selectedFoods: JSON.parse(localStorage.getItem('myValueInLocalStorage')) });
  }
  removeFoodItem = itemIndex => {
    const filteredFoods = this.state.selectedFoods.filter(
      (item, idx) => itemIndex !== idx
    );
    // this.setState({ selectedFoods: filteredFoods });
    this.setState({ selectedFoods: filteredFoods }, () => {
      localStorage.setItem('myValueInLocalStorage', JSON.stringify(this.state.selectedFoods))
    });
  };

  addFood = food => {
    // console.log(food)
    const newFoods = this.state.selectedFoods.concat(food);
    this.setState({ selectedFoods: newFoods }, () => {
      localStorage.setItem('myValueInLocalStorage', JSON.stringify(this.state.selectedFoods))
    });
  };

  render() {
    const { selectedFoods } = this.state;

    return (
      <div className="App">
        
        <div className="ui text container">
        <img className="image" src={logo} alt="MOV logo" />
        {/* <h1>Ministry of Vocabulary</h1> */}
        <FoodSearch onFoodClick={this.addFood} />
          <SelectedFoods
            foods={selectedFoods}
            onFoodClick={this.removeFoodItem}
          />
           <footer className="footercustom">
              <div>
              Ministry of Vocabulary is dedicated to all the Tharoorosaurus fanatics to help increase vocabulary.
              </div>
               
               <div>
              A Project by <a target="blank" href="https://palashshrivastava.tech">Palash Shrivastava </a>
              </div>
                </footer>
        </div>
      </div>
    );
  }
}

export default App;
