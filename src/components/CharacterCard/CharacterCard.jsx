import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import styles from './characterCard.module.scss'

export function CharacterCard({ character }) {
  const { img, characterName, species } = character;
  return (
    <a href="#" className={styles.cardLink}>
    <article key={Date.now()}>
      <Card sx={{ maxWidth: 240 }}>
        <CardMedia
          component="img"
          alt={`${species} ${characterName}`}
          height="168"
          width="240"
          image={img}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {characterName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {species}
          </Typography>
        </CardContent>
      </Card>
    </article>
    </a>
  );
}
