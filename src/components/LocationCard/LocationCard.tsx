import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import styles from "./locationCard.module.scss";
import { Link } from "react-router-dom";
import { LocationCardProps } from "../../interfaces/interfaces";

export function LocationCard({ location }: LocationCardProps) {
  const { name, type, id } = location;
  const locationsLink = `/locations/${id}`;

  return (
    <Link to={locationsLink} className={styles.cardLink}>
      <Card
        sx={{
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
            {name}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary">
            {type}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
