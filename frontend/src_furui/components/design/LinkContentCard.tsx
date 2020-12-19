import React from "../src_furui/react";
import { makeStyles } from "../src_furui/@material-ui/core/styles";
import Typography from "../src_furui/@material-ui/core/Typography";
import Grid from "../src_furui/@material-ui/core/Grid";
import Card from "../src_furui/@material-ui/core/Card";
import CardActionArea from "../src_furui/@material-ui/core/CardActionArea";
import CardContent from "../src_furui/@material-ui/core/CardContent";

const useStyles = makeStyles({
  card: {
    display: "flex",
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
});

export const LinkContentCard: React.FC<{
  title: string;
  description: string;
  link: string;
  image?: string;
}> = ({ title, description, link }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component="a" href={link}>
        <Card className={classes.card}>
          <div className={classes.cardDetails}>
            <CardContent>
              <Typography component="h2" variant="h5">
                {title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {link}
              </Typography>
              <Typography variant="subtitle1" paragraph>
                {description}
              </Typography>
            </CardContent>
          </div>
          {/* <Hidden xsDown>
            <CardMedia className={classes.cardMedia} image={image} />
          </Hidden> */}
        </Card>
      </CardActionArea>
    </Grid>
  );
};

export default LinkContentCard;
