import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface MainLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, ...rest }) => {
  return (
    <div {...rest}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
