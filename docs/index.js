import React from 'react'
import { getSmoothShadow } from '../lib/index.mjs'
import * as ReactDOMClient from 'react-dom/client'

function App() {
  const orangeIntensity = 0.45
  const greyIntensity = 0.2
  const sharpnessSharp = 0.9
  const sharpnessSoft = 0.1
  const orangeShadow = [192, 50, 0]
  const rightLight = [0.5, -0.5]
  const boxBaseProps = {
    height: '10vh',
    width: '10vw',
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 20,
    display: 'grid',
    alignContent: 'space-around'
  }
  const columnStyle = {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    alignContent: 'space-evenly',
    justifyContent: 'space-evenly'
  }
  const label = (str, num) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', justifyContent: 'space-between' }}>
      <div style={{ fontWeight: 'bold' }}>{str}</div>
      <div>{num}</div>
    </div>
  )
  const box = (...args) => (
    <div
      style={{
        ...boxBaseProps,
        boxShadow: getSmoothShadow({
          distance: args[0],
          intensity: args[1],
          sharpness: args[2],
          color: args[3],
          lightPosition: args[4]
        })
      }}
    >
      {label('distance', args[0])}
      {label('intensity', args[1])}
      {label('sharpness', args[2])}
      {args[3] && label('color', `(${args[3].join(',')})`)}
      {args[4] && label('light', `(${args[4].join(',')})`)}
    </div>
  )
  return (
    <div
      style={{
        height: '100vh',
        widht: '100vw',
        display: 'grid',
        gridAutoFlow: 'column',
        fontFamily: 'monospace',
        fontSize: 10,
        color: 'rgba(0,0,0,0.5)'
      }}
    >
      <div style={{ backgroundColor: 'rgb(255,165,0)', ...columnStyle }}>
        {box(50, orangeIntensity, sharpnessSharp, orangeShadow)}
        {box(50, orangeIntensity, sharpnessSoft, orangeShadow)}
        {box(100, orangeIntensity, sharpnessSharp, orangeShadow)}
        {box(100, orangeIntensity, sharpnessSoft, orangeShadow, rightLight)}
        {box(500, orangeIntensity, sharpnessSharp, orangeShadow)}
        {box(500, orangeIntensity, sharpnessSoft, orangeShadow)}
      </div>
      <div style={{ backgroundColor: 'rgb(0,0,0,0.1)', ...columnStyle }}>
        {box(50, greyIntensity, sharpnessSharp)}
        {box(50, greyIntensity, sharpnessSoft)}
        {box(100, greyIntensity, sharpnessSharp, [0, 0, 0], rightLight)}
        {box(100, greyIntensity, sharpnessSoft, [0, 0, 0])}
        {box(500, greyIntensity, sharpnessSharp)}
        {box(500, greyIntensity, sharpnessSoft)}
      </div>
    </div>
  )
}

const rootElement = document.getElementById('root')
const root = ReactDOMClient.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
