import React from "react";
// import Client from "./Client";
import Client from "./ClientMongo";
import debounce from "./components/Debouncing/debounce"

const MATCHING_ITEM_LIMIT = 25;

class FoodSearch extends React.Component {
  state = {
    foods: [],
    showRemoveIcon: false,
    searchValue: "",
    loading : false
  };

  debouncedLog = debounce(value=>{Client.search(value, foods => {
    // console.log(foods)
     this.setState({
      foods: foods.articles.slice(0, MATCHING_ITEM_LIMIT)
    });
    this.setState({loading:false});
  })},500)

  handleSearchChange = e => {
    this.setState({loading:true});
    const value = e.target.value;

    this.setState({
      searchValue: value
    });

    if (value === "") {
      this.setState({
        foods: [],
        showRemoveIcon: false,
        loading:false
      });
    } else {
      this.setState({
        showRemoveIcon: true
      });
      this.debouncedLog(value)
      // Client.search(value, foods => {
      //   // console.log(foods)
      //    this.setState({
      //     foods: foods.articles.slice(0, MATCHING_ITEM_LIMIT)
      //   });
      //   this.setState({loading:false});
      // });
    }
  };

  handleSearchCancel = () => {
    this.setState({
      foods: [],
      showRemoveIcon: false,
      searchValue: ""
    });
  };

  render() {
    const { showRemoveIcon, foods } = this.state;
    const removeIconStyle = showRemoveIcon ? {} : { visibility: "hidden" };

    const foodRows = foods.map((food, idx) => (
      <tr key={idx} onClick={() => this.props.onFoodClick(food)}>
        <td>{food.Word}</td>
        <td>{food.Meaning}</td>
        <td>{food.Mneomonic}</td>
        <td>{food.Usage}</td>
        {/* <td className="right aligned">{food.carbohydrate_g}</td> */}
      </tr>
    ));

    return (
      <div id="food-search">
        <table className="ui selectable  table celled large orange">
          <thead>
            <tr>
              <th colSpan="4">
                <div className="ui fluid search">
                  <div className="ui icon input">
                    <input
                      className="prompt"
                      type="text"
                      style={{width: "100%"}}
                      placeholder="Search for a Word"
                      value={this.state.searchValue}
                      onChange={this.handleSearchChange}
                      size="80px"
                    />
                    <i className="search icon" /> 
                  </div>
                  <i
                    className="remove icon"
                    onClick={this.handleSearchCancel}
                    style={removeIconStyle}
                  /> 
                </div>
                {(this.state.foods && this.state.foods.length > 0) && <span style={{'float': 'right','font-size': 'x-small' }}>*tap any to bookmark</span>}
              </th>
            </tr>
            {(this.state.foods && this.state.foods.length > 0) && <tr>
              <th>Word</th>
              <th className="">Meaning</th>
              <th className="">Mnemonic</th>
              <th className="">Usage</th>
              {/* <th>Carbs (g)</th> */}
            </tr>}
          </thead>
          <tbody>
            
            {foodRows}
          </tbody>
        </table>
        {this.state.loading && <div className="ui active centered inline loader"></div>}
      </div>
    );
  }
}

export default FoodSearch;
