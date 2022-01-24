import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';

const PREFIX = 'LinkContentCard';

const classes = {
    card: `${PREFIX}-card`,
    cardDetails: `${PREFIX}-cardDetails`,
    cardMedia: `${PREFIX}-cardMedia`,
};

const StyledGrid = styled(Grid)({
    [`& .${classes.card}`]: {
        display: 'flex',
    },
    [`& .${classes.cardDetails}`]: {
        flex: 1,
    },
    [`& .${classes.cardMedia}`]: {
        width: 160,
    },
});

export const LinkContentCard: React.FC<{
    title: string;
    description: string;
    link: string;
    image?: string;
}> = ({ title, description, link }) => {
    return (
        <StyledGrid item xs={12} md={6}>
            <CardActionArea component="a" href={link}>
                <Card className={classes.card}>
                    <div className={classes.cardDetails}>
                        <CardContent>
                            <Typography component="h2" variant="h5">
                                {title}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="textSecondary"
                            >
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
        </StyledGrid>
    );
};

export default LinkContentCard;
