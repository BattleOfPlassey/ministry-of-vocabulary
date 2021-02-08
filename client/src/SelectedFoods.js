import React from "react";

export default function SelectedFoods(props) {
  const { foods } = props;

  const foodRows = foods.map((food, idx) => (
    <tr key={idx} onClick={() => props.onFoodClick(idx)}>
      <td>{food.Word}</td>
      <td>{food.Meaning}</td>
      <td>{food.Mneomonic}</td>
      <td>{food.Usage}</td>
     
    </tr>
  ));

  return (
    <table className="ui selectable structured compact unstackable table celled padded striped green">
      <thead>
        <tr>
          <th colSpan="4">
            <h3>Selected Word</h3>
          </th>
        </tr>
        <tr>
          <th>Word</th>
          <th className="eight wide">Meaning</th>
          <th className="eight wide">Mnemonic</th>
          <th className="eight wide">Usage</th>
   
        </tr>
      </thead>
      <tbody>
        {foodRows}
      </tbody>
      
    </table>
  );
}

