import React, { Component } from "react";
import SelectedFoods from "./SelectedFoods";
import FoodSearch from "./FoodSearch";

// import ReactGA from 'react-ga';
// ReactGA.initialize('G-6K6TD38WSJ');
// ReactGA.pageview(window.location.pathname + window.location.search);
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userLogoutRequest } from './store/actions/usersActions';
import logo from "./../images/Logo4.png";
var myHeaders = new Headers();
myHeaders.append("Access-Control-Allow-Origin", "*");
myHeaders.append("Access-Control-Allow-Credentials", "true");
myHeaders.append("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
myHeaders.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");


var requestOptions = {
  method: 'OPTIONS',
  headers: myHeaders,
  redirect: 'follow'
};

class App extends Component {
  state = {
    selectedFoods: [],
    visible: false,
  };

  componentDidMount() {
    document.title = "Ministry Of Vocabulary | Home";
    // fetch("https://ministry-of-vocabulary.herokuapp.com",requestOptions);
    fetch("http://localhost:3000",requestOptions);


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
    const userLinks = (
      <NavLink className="ui item" to='/' onClick={this.props.userLogoutRequest}><i className="sign out large icon"></i>Logout</NavLink>
  );
  const guestLinks = (
    
    <NavLink className="ui item" to="/login"><i className="sign in alternate alternate large icon"></i>Login</NavLink>
    // <Link className="ui item" to='/signup'>Signup</Link>
  );

    return (
      <div className="App">
        <div className="ui secondary  menu">
          <div className="right menu">
            <a
              className="ui item"
              href="https://github.com/lameguest21/ministry-of-vocabulary"
              target="blank"
            >
              <i className="github large icon"></i>Contribute
            </a>
            {this.props.isAuthenticated && <NavLink className="ui item" to='/home'><i className="newspaper outline large icon"></i>Dashboard</NavLink>}
            <div>{this.props.isAuthenticated ? userLinks : guestLinks}</div>
          </div>
        </div>

        <div className="ui text container">
          <img className="image" src={logo} alt="MOV logo" />
        </div>

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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      isAuthenticated: state.users.isAuthenticated,
      authenticatedUsername: state.users.authenticatedUsername
  };
}

const mapDispatchToProps = dispatch => {
  return {
      userLogoutRequest: () => dispatch(userLogoutRequest())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

// export default App;
