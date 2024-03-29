import {FC} from "react"
import styles from "./episodesCards.module.scss";
import { EpisodeCard } from "..";
import { EpisodesCardProps } from "../../interfaces/interfaces"

export const EpisodesCards:FC<EpisodesCardProps> = ({ episodes }: EpisodesCardProps) => (
  <section className={styles.cards}>
    {episodes.map((episode) => (
      <EpisodeCard episodeData={episode} key={episode.id} />
    ))}
  </section>
);
