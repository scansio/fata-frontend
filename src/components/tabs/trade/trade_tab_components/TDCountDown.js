/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, {useEffect, useRef, useState} from 'react';

export default function TDCountDown(props) {
  const [counter, setCounter] = useState(props.second);
  const update = useRef(counter);

  useEffect(() => {
    let intervalId = setInterval(() => {
      if (update.current <= 0) {
        clearInterval(intervalId);
        intervalId = null;
        props?.setDone(true);
      } else {
        setCounter((previous) => {
          update.current = --previous;
          return update.current;
        });
      }
    }, 1000);
    return () => intervalId && clearInterval(intervalId);
  }, []);

  return (
    <>
      <span>
        {counter <= 0 ? (
          'Refreshing...'
        ) : (
          <>
            <i className={`fas fa-clock text-warning`}> </i> {counter}
          </>
        )}
      </span>
    </>
  );
}
