import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import styles from "./episodeCard.module.scss";

export function EpisodeCard({ episodeData }) {
  const { series, date, episode } = episodeData;
  return (
    <a href="#" className={styles.cardLink}>
      <Card
        sx={{
          maxWidth: 240,
          minWidth: 240,
          minHeight: 128,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
        className={styles.card}
      >
        <CardContent>
          <Typography
            sx={{ fontSize: 20, marginBottom: 0 }}
            color="black"
            gutterBottom
          >
            {series}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary">
            {date}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" fontWeight="bold" textTransform="uppercase" paddingTop="5px"> 
            {episode}
          </Typography>
        </CardContent>
      </Card>
    </a>
  );
}
