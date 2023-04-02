import { styled } from '@mui/material/styles';
import { NextPage } from 'next';
import { Grid, List, ListItem, ListItemText, Paper, TableContainer, Table, TableBody, TableRow, TableCell, Typography } from '@mui/material';
import LinkContentCard from 'components/design/LinkContentCard';
import { Alert, AlertTitle } from '@mui/material';
import { withLoginUser } from 'middlewares/withLoginUser';
import { nonNullOrThrow } from 'utils';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'features/currentUser';
import { NoSSR } from 'components/utils/NoSSR';

const PREFIX = 'index';

const classes = {
  paper: `${PREFIX}-paper`,
};

const StyledNoSSR = styled(NoSSR)(({ theme }) => ({
  [`& .${classes.paper}`]: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(2),
    },
  },
}));

interface LinkData {
  title: string;
  description: string;
  link: string;
  image?: string;
}

const linkData: Array<LinkData> = [
  {
    title: '公式サイト',
    description: 'MIS.Wの公式サイト',
    link: 'https://misw.jp/',
  },
  {
    title: '公式ブログ',
    description: 'MIS.Wの公式ブログ',
    link: 'https://blog.misw.jp/',
  },
  {
    title: 'Discord',
    description: 'MIS.Wの公式Discordサーバー',
    link: 'https://discord.com/channels/695145923843457104/',
  },
  {
    title: 'Twitter',
    description: 'MIS.Wの公式Twitterアカウント',
    link: 'https://twitter.com/misw_info/',
  },
  {
    title: 'YouTube',
    description: 'MIS.Wの公式YouTubeチャンネル',
    link: 'https://www.youtube.com/@miswvideo/',
  },
  {
    title: 'GitHub',
    description: 'MIS.Wの公式GitHub Organization',
    link: 'https://github.com/MISW/',
  },
  {
    title: 'MISWskey',
    description: 'サークル用のSNSインスタンス',
    link: 'https://misskey.misw.jp/',
  },
  {
    title: 'Kibela',
    description: 'サークル用の資料共有サイト',
    link: 'https://misw.kibe.la/',
  },
  {
    title: 'みすクラウド',
    description: 'サークル用のオンラインストレージ',
    link: 'https://cloud.misw.jp/',
  },
];

const paymentData = [
  ['銀行名', '株式会社みずほ銀行'],
  ['支店名', '高田馬場支店(店番号：064)'],
  ['口座', '普通預金'],
  ['口座番号', '0519948'],
  ['口座名義', 'ｹｲｴｲｼﾞﾖｳﾎｳｶﾞﾂｶｲ(MISW)'],
  ['振込依頼人名', '自分の名前'],
];

const Page: NextPage = () => {
  const currentUser = nonNullOrThrow(useSelector(selectCurrentUser));

  if (currentUser.role === 'not_member') {
    if (currentUser.emailVerified) {
      return (
        <StyledNoSSR>
          <div>
            <Paper className={classes.paper}>
              <Alert severity="warning">
                <AlertTitle>まだ会員登録は終わっていません！</AlertTitle>
                会費を払うことで会員として各種サービスを利用出来ます。
              </Alert>
              <div>
                <p>
                  指定の口座番号へ入会費
                  <strong>1500円</strong>
                  を振り込んでください。
                </p>
              </div>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableBody>
                    {paymentData.map((row) => (
                      <TableRow key={row[0]}>
                        <TableCell component="th" scope="row">
                          {row[0]}
                        </TableCell>
                        <TableCell>{row[1]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Alert severity="error">
                もし振込から1週間以上経っても会員になったことの確認が出来ない場合は
                <ul>
                  <li>メール info@misw.jp</li>
                  <li>Twitter @misw_info</li>
                </ul>
                のいずれかへその由を伝えてください。
              </Alert>
              <Alert severity="info">会費は部室の備品購入やコミケなどへの参加費用等に使われます。</Alert>
            </Paper>
          </div>
        </StyledNoSSR>
      );
    } else {
      return (
        <StyledNoSSR>
          <div>
            <Paper className={classes.paper}>
              <Alert severity="warning">
                <AlertTitle>まだメール認証が終わっていません！</AlertTitle>
                受信メール(や迷惑メールボックス)を確認してください。
              </Alert>
            </Paper>
          </div>
        </StyledNoSSR>
      );
    }
  }
  return (
    <NoSSR>
      <Typography variant="h2" align="center">
        Welcome to MIS.W!
      </Typography>
      <br />
      <Typography variant="h5">Getting Started</Typography>
      <List dense>
        <ListItem>
          <ListItemText primary="kibelaの自己紹介記事を書く" />
        </ListItem>
        <ListItem>
          <ListItemText primary="活動/ディスコードにてサークル員と交流する" />
        </ListItem>
        <ListItem>
          <ListItemText primary="新歓講座に参加する" />
        </ListItem>
        <ListItem>
          <ListItemText primary="発表会に参加する" />
        </ListItem>
        <ListItem>
          <ListItemText primary="企画に参加する/企画を立ち上げる" />
        </ListItem>
        <ListItem>
          <ListItemText primary="その他イベントに参加する/イベントを企画する" />
        </ListItem>
        <ListItem>
          <ListItemText primary="上記活動を通してインスピレーションを得て未来の創作につなげる" />
        </ListItem>
      </List>
      <br />
      <Typography variant="h5">Useful Links</Typography>
      <Grid container spacing={2}>
        {linkData.map((data, i) => (
          <LinkContentCard {...data} key={i} />
        ))}
      </Grid>
    </NoSSR>
  );
};

export default withLoginUser(Page);
