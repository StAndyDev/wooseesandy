import React from "react";
import Svg, { Circle, Defs, G, LinearGradient, Path } from "react-native-svg";

const LogoSitrakaAndy = (props:any) => (
  <Svg
  viewBox="0 0 250 200"
  width={props.width || 150}
  height={props.height || 120}
  {...props}
>
    <Defs>
      <LinearGradient
        id="gradient"
        x1="39.691231"
        y1="104.16129"
        x2="209.69123"
        y2="104.16129"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(0,-208.32259)"
      >
      </LinearGradient>
    </Defs>

    <G>
      <Circle
        cx="124.69123"
        cy="-104.16129"
        r="85"
        stroke="url(#gradient)"
        strokeWidth={5}
        fill="none"
        transform="scale(1,-1)"
      />

      <Path
        d="M132.07603,75.883706 L148.04378,91.395231"
        fill="#0f7568"
      />

      <Path
        d="M123.3761,76.723883 L144.70391,95.499879 L164.46527,76.268706 L113.70657,31.151512 
           L62.164084,76.610083 L113.6986,121.99097 L103.66376,131.09447 L82.784,112.96724 
           L62.090279,131.05542 L113.698617,175.71255 L164.511637,130.95308 L113.939607,85.160808 Z"
        fill="#64fa84"
        fillOpacity={0.0625}
      />

      <Path
        d="M169.02995,70.637161 L124.7765,28.4367"
        fill="#0f7568"
      />

      <Path
        d="M133.72984,74.001794 L153.91763,92.820921 L172.6227,73.545573 L124.57717,28.324734 
           L75.789746,73.887738 L124.56963,119.37287 L115.07117,128.49728 L95.307465,110.32841 
           L75.71987,128.45815 L124.56963,173.21787 L172.66658,128.35557 L124.79774,82.458101 Z"
        fill="#8f9eb2"
      />

      <Path
        d="M124.63425,28.382562 L68.268701,80.90132 L11.902633,133.42007 L70.551766,133.49247 
           L124.63425,83.100719 L178.03099,133.62476 L235.93444,133.69656 L180.2846,81.039316 Z"
        fill="#8f9eb2"
        fillOpacity={0.5}
      />
    </G>
  </Svg>
);

export default LogoSitrakaAndy;