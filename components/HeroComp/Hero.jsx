import React from 'react';
import styles from './hero.module.scss';

const Hero = (props) => {
  const Tag = props.tag;
  return (
      <div id={styles.hero}>
        {
          Tag ? 
          <Tag className={styles.heading}>{props.title}</Tag>
          :
          <h1 className={styles.heading}>{props.title}</h1>
        }
      </div>
  );
}

export default Hero
