/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React from 'react';

function THeadRow(props) {
  const sortBy = props.sortBy;

  return (
    <tr style={{...props.style, fontSize: '11px'}} className="text-center">
      <th
        className={`utilityLink c-pointer`}
        {...(sortBy === 'status' ?
          {style: {cursor: 'pointer', borderBottom: '2px solid blue'}} :
          {})}
        onClick={() => props.setSortBy('status')}
      >
        <span
          className={`${sortBy === 'status' ? 'text-blue' : ''} gain-header`}
        >
          Status <i className="fas fa-sort"></i>
        </span>
      </th>
      <th
        className={`utilityLink c-pointer`}
        {...(sortBy === 'difference' ?
          {style: {cursor: 'pointer', borderBottom: '2px solid blue'}} :
          {})}
        onClick={() => props.setSortBy('difference')}
      >
        <span
          className={`${
            sortBy === 'difference' ? 'text-blue' : ''
          } gain-header`}
        >
          Difference <i className="fas fa-sort"></i>
        </span>
      </th>
      <th
        className={`utilityLink c-pointer`}
        {...(sortBy === 'buy' ?
          {style: {cursor: 'pointer', borderBottom: '2px solid blue'}} :
          {})}
        onClick={() => props.setSortBy('buy')}
      >
        <span className={`${sortBy === 'buy' ? 'text-blue' : ''} gain-header`}>
          Buy Here <i className="fas fa-sort"></i>
        </span>
      </th>
      <th
        className={`utilityLink c-pointer`}
        {...(sortBy === 'sell' ?
          {style: {cursor: 'pointer', borderBottom: '2px solid blue'}} :
          {})}
        onClick={() => props.setSortBy('sell')}
      >
        <span className={`${sortBy === 'sell' ? 'text-blue' : ''} gain-header`}>
          Sell At <i className="fas fa-sort"></i>
        </span>
      </th>
    </tr>
  );
}

export default THeadRow;
