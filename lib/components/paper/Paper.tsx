import React from 'react';
type PaperProps = {
  children: string | React.JSX.Element | React.JSX.Element[]
  style?: React.CSSProperties | undefined;
  className?:string | undefined
}
import styles from "./paper.module.scss"

const Paper:React.FC<PaperProps> = ({children,style,className}) => {
  return (
    <section style={style} className={ `${styles["paper"]} ${className ? styles[className] : ''}`}>
      {children}
    </section>
  );
};

export default Paper;