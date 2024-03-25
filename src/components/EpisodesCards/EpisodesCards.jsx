import styles from "./episodesCards.module.scss";
import { EpisodeCard } from "..";

export function EpisodesCards({ episodes }) {
  const episodesArray = episodes.map((episode) => (
    <EpisodeCard
      episodeData={episode}
      key={`${episode.episode}${Date.now()}`}
    />
  ));
  return <section className={styles.cards}>{episodesArray}</section>;
}
