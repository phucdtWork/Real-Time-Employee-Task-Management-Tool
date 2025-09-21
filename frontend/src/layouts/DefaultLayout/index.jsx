import { Layout } from "antd";
import { AppHeader, AppSlideBar } from "../component";

const { Content } = Layout;

function DefaultLayout({ children }) {
  return (
    <div>
      <Layout>
        <AppHeader />
        <Content>
          <Layout
            style={{
              padding: "24px 0",
              minHeight: "calc(100vh - 64px)",
            }}
            className="bg-white m-4"
          >
            <AppSlideBar />
            <Content className="bg-white">{children}</Content>
          </Layout>
        </Content>
      </Layout>
    </div>
  );
}

export default DefaultLayout;
