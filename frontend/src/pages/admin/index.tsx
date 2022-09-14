import Container from '@mui/material/Container';
import { NextPage } from 'next';
import { Typography, Grid, Box } from '@mui/material';
import LinkContentCard from 'components/design/LinkContentCard';
import { withLoginUser } from 'middlewares/withLoginUser';
import { NoSSR } from 'components/utils/NoSSR';

const links = [
  {
    title: 'ユーザ管理画面へ',
    description: 'ユーザの一覧と支払い完了処理',
    link: '/admin/users',
  },
  {
    title: '管理者設定',
    description: '各種管理者専用の設定',
    link: '/admin/config',
  },
];

const Page: NextPage = () => {
  return (
    <NoSSR>
      <Container fixed>
        <Box mb={4}>
          <Typography variant="h3">管理者画面</Typography>
        </Box>
        <Grid container spacing={4}>
          {links.map((data, i) => (
            <LinkContentCard {...data} key={i} />
          ))}
        </Grid>
      </Container>
    </NoSSR>
  );
};

export default withLoginUser(Page);
