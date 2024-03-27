import styles from "./episodesCards.module.scss";
import { EpisodeCard } from "..";

export const EpisodesCards = ({ episodes }) => (
  <section className={styles.cards}>
    {episodes.map((episode) => (
      <EpisodeCard episodeData={episode} key={episode.id} />
    ))}
  </section>
);
