import type { NextPage } from "next";
import Head from "next/head";
import LoginPage from "@/modules/login/LoginPage";

const LoginRoute: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login | cv2CEO Resume Builder</title>
        <meta name="description" content="Login Page" />
        <link rel="icon" type="image/png" href="/icons/resume-icon.png" />
      </Head>

      <LoginPage />
    </>
  );
};

export default LoginRoute;
