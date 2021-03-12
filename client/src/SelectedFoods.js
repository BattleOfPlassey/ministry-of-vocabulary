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
    <table className="ui selectable unstackable table celled large green">
      <thead>
        <tr>
          <th colSpan="4">
            {/* <h3>Bookmarked Word</h3><span>(Click word to clear)</span> */}<a className="ui green ribbon label">Bookmarked Words</a>
          </th>
        </tr>
        <tr>
          <th>Word</th>
          <th className="">Meaning</th>
          <th className="">Mnemonic</th>
          <th className="">Usage</th>
   
        </tr>
      </thead>
      <tbody>
        {foodRows}
      </tbody>
      
    </table>
  );
}

