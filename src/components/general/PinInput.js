/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useRef } from 'react'
import { Col, Row } from 'react-bootstrap'

function PinInput ({ setPin, setDone, length = 4 }) {
  const getRef = useRef(null)
  const inputsRef = useRef([])

  const inputElements = useMemo(() => {
    inputsRef.current = []
    const inputs = []
    length < 4 && (length = 4)

    for (let index = 0; index < length; index++) {
      const inputRef = getRef()
      inputs.push(
        <input
          ref={inputRef}
          onChange={(e) => inputChange(e, index)}
          type="number"
          min={1}
          max={1}
          className="text-center fw-bold pin-number"
          autoComplete="false"
        />
      )
      inputsRef.current.push(inputRef)
    }
    // inputs[0]?.focus();
    return inputs
  }, [length])

  useEffect(() => {
    if (inputsRef?.current?.length !== 0) {
      gen(0)
    }
  }, [inputsRef])

  function gen (index) {
    if (index < length) {
      inputsRef.current[index]?.current?.focus()
    } else {
      let pin = ''
      for (const { current } of inputsRef.current) {
        pin += current?.value || ''
      }

      setPin && setPin(pin)
      setDone && setDone(pin)
    }
    return inputsRef.current[index]?.current
  }

  function inputChange (e, index) {
    e.preventDefault()
    const val = e.target.value
    if ((val && Number.parseInt(val)) || val === 0 || val === '0') {
      gen(index + 1)
    } else {
      e.target.value = ''
    }
  }

  return (
    <Row>
      <Col xs="12" className="s-grid">
        {inputElements}
      </Col>
    </Row>
  )
}

export default PinInput
