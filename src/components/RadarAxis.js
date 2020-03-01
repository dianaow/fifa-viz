import React from "react"
import PropTypes from "prop-types"
import * as d3 from 'd3'
import { angleSlice } from "./consts"

export const max = Math.max;
export const sin = Math.sin;
export const cos = Math.cos;
export const HALF_PI = Math.PI / 2;

const invisibleArc = (axis, radius) => {

  var arc = d3.arc()
      .innerRadius(radius)
      .outerRadius(radius+5)
      .startAngle(angleSlice*(axis-1))
      .endAngle(angleSlice*(axis))

  //Search pattern for everything between the start and the first capital L
  var firstArcSection = /(^.+?)L/;  

  //Grab everything up to the first Line statement
  var newArc = firstArcSection.exec( arc() )[1];

  //Replace all the comma's so that IE can handle it
  newArc = newArc.replace(/,/g , " ");
    
  //If the end angle lies beyond a quarter of a circle (90 degrees or pi/2) 
  //flip the end and start position
  if (axis === 3 || axis === 4) {
    var startLoc  = /M(.*?)A/,    //Everything between the first capital M and first capital A
      middleLoc   = /A(.*?)0 0 1/,  //Everything between the first capital A and 0 0 1
      endLoc    = /0 0 1 (.*?)$/; //Everything between the first 0 0 1 and the end of the string (denoted by $)
    //Flip the direction of the arc by switching the start en end point (and sweep flag)
    //of those elements that are below the horizontal line
    var newStart = endLoc.exec( newArc )[1];
    var newEnd = startLoc.exec( newArc )[1];
    var middleSec = middleLoc.exec( newArc )[1];
    
    //Build up the new arc notation, set the sweep-flag to 0
    newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;

  }//if

  return newArc
}

const Axis = ({ data, scale, keyAccessor, ...props }) => {

  return (
    <g className="Axis">
      <path
        className="Axis__invisible_arc"
        id={"Axis__arc_label"}
        d={invisibleArc(1, window.innerWidth*0.22-15)}
        strokeOpacity={0}
        fill='none'
      />
      <text 
        className="Axis__arcText"
        fill={props.textColor}
        fontSize={9}
      >
        <textPath
          startOffset="50%"
          textAnchor={props.textAnchor}
          xlinkHref={"#Axis__arc_label"}
        >
         OVERALL SCORE
        </textPath>
      </text>
      <text 
        className="Axis__line_label"
        fill={props.textColor}
        fontSize={9}
        textAnchor={props.textAnchor}
        transform="translate(0,-150)rotate(-90)"
      >
        CATEGORY SCORE
      </text>
      {d3.range(0, data.length).map((axis, i) => (
        <g key={keyAccessor(axis, i)}>
          <line
            className="Axis__line"
            x1={0}
            y1={0}
            x2={scale(0) * cos(angleSlice * i - HALF_PI)}
            y2={scale(0) * sin(angleSlice * i - HALF_PI)}
            stroke={props.stroke}
            strokeWidth={props.strokeWidth}
            strokeOpacity={props.strokeOpacity}
          />
          <path
            className="Axis__invisible_arc"
            id={"Axis__arc_" + i}
            d={invisibleArc(axis, window.innerWidth*0.22)}
            strokeOpacity={0}
            fill='none'
          />
          <text 
            className="Axis__arcText"
            fill={props.textColor}
            fontSize={props.fontSize}
          >
            <textPath
              startOffset="50%"
              textAnchor={props.textAnchor}
              xlinkHref={"#Axis__arc_" + i}
            >
            { data[i] }
            </textPath>
          </text>
        </g>    
      ))}
    </g>
  )
}

Axis.propTypes = {
  data: PropTypes.array,
  scale: PropTypes.func
}

Axis.defaultProps = {
  scale: null,
  stroke: 'white',
  strokeWidth: '2px',
  strokeOpacity: 0.2,
  textColor: 'white',
  textAnchor: 'middle',
  fontSize: '11px',
  labelFactor: 1.1
}

export default Axis

