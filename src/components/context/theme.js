/* eslint-disable react/prop-types */
import React, { createContext } from 'react'
export const theme = {
  light: {
    backgroundColor: 'white',
    color: 'black'
  },
  dark: {
    backgroundColor: 'black',
    color: 'white'
  }
}
const ThemeContext = createContext(theme.light)
const ThemeConsumer = ThemeContext.Consumer
const ThemeProvider = ThemeContext.Provider
export { ThemeConsumer, ThemeProvider }
export const consume = () => {
  let themeStyle
  const contextJsx = () => (
    <>
      <ThemeConsumer>
        {
        style => {
          themeStyle = style
        }
        }
      </ThemeConsumer>
    </>
  )
  contextJsx()
  return { themeStyle, contextJsx }
}
export const ProvideTheme = props => (
  <>
    <ThemeProvider value={props.style}>{props.children}</ThemeProvider>
  </>
)
