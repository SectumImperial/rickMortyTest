import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import styles from "./characterCard.module.scss";
import { Link } from "react-router-dom";
import { CharacterCardProps } from "../../interfaces/interfaces"


export function CharacterCard({ character }: CharacterCardProps) {
  if (Array.isArray(character)) return;
  const { id, image, name, species } = character;
  const characterLink = `/characters/${id}`;

  return (
    <Link to={characterLink} className={styles.cardLink}>
      <Card sx={{ maxWidth: 312 }}>
        <CardMedia
          component="img"
          alt={`${species} ${name}`}
          height="168"
          width="240"
          image={image}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {species}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
