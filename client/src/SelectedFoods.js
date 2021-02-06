import React from "react";

export default function SelectedFoods(props) {
  const { foods } = props;

  const foodRows = foods.map((food, idx) => (
    <tr key={idx} onClick={() => props.onFoodClick(idx)}>
      <td>{food.Word}</td>
      <td>{food.Meaning}</td>
      <td>{food.Mneomonic}</td>
      <td>{food.Usage}</td>
      {/* <td className="right aligned">{food.carbohydrate_g}</td> */}
    </tr>
  ));

  return (
    <table className="ui selectable structured large table celled padded striped orange">
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
          {/* <th>NULL</th> */}
        </tr>
      </thead>
      <tbody>
        {foodRows}
      </tbody>
      {/* <tfoot>
        <tr>
          <th>Total</th>
          <th className="right aligned" id="total-kcal">
            {sum(foods, "kcal")}
          </th>
          <th className="right aligned" id="total-protein_g">
            {sum(foods, "protein_g")}
          </th>
          <th className="right aligned" id="total-fat_g">
            {sum(foods, "fat_g")}
          </th>
          <th className="right aligned" id="total-carbohydrate_g">
            {sum(foods, "carbohydrate_g")}
          </th>
        </tr>
      </tfoot> */}
    </table>
  );
}

// function sum(foods, prop) {
//   return foods
//     .reduce((memo, food) => parseInt(food[prop], 10) + memo, 0.0)
//     .toFixed(2);
// }
