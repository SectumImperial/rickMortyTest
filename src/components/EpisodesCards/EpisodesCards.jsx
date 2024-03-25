import styles from "./episodesCards.module.scss";
import { EpisodeCard } from "..";

export function EpisodesCards({ episodes }) {
  return (
    <section className={styles.cards}>
      {episodes.map((episode) => (
        <EpisodeCard episodeData={episode} key={episode.id} />
      ))}
    </section>
  );
}
