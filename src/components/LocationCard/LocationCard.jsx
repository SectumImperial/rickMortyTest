import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import styles from "./locationCard.module.scss";
import { Link } from "react-router-dom";

export function LocationCard({ location }) {
  const { name, type } = location;
  return (
    <Link href="#" className={styles.cardLink}>
      <Card
        sx={{
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
