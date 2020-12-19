import React from "../src_furui/react";
import Container from "../src_furui/@material-ui/core/Container";
import { NextPage } from "../src_furui/next";
import { Typography, Grid, Box } from "../src_furui/@material-ui/core";
import LinkContentCard from "../../components/design/LinkContentCard";
import { withLogin } from "../../middlewares/withLogin";

const links = [
  {
    title: "ユーザ管理画面へ",
    description: "ユーザの一覧と支払い完了処理",
    link: "/admin/users",
  },
  {
    title: "管理者設定",
    description: "各種管理者専用の設定",
    link: "/admin/config",
  },
];

const Page: NextPage = () => {
  return (
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
  );
};

export default withLogin(Page);
