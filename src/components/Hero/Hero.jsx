import styles from './hero.module.scss'
import { IMG_SOURCE } from "./constants";

export function Hero({type = "names"}) {
  const source = IMG_SOURCE[type] ? IMG_SOURCE[type] : IMG_SOURCE.names;
    return (
     <img alt={type} src={source} className={styles[type]}/>
    );
  }