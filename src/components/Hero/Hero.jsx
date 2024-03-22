import styles from './hero.module.scss'
import { IMG_SOURCE } from "./constants";

export function Hero({type = "names"}) {
  const source = IMG_SOURCE[type] || IMG_SOURCE.names;
  const imageClassName = styles[type] || styles.heroImage; 

  return (
    <img alt={type} src={source} className={imageClassName}/>
  );
}
