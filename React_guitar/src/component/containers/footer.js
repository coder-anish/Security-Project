import React from "react";
import Footer from "../footer";
import Icon from "../icons";

export default function FooterContainer() {
  return (
    <Footer>
      <Footer.Wrapper>
        <Footer.Row>
          <Footer.Column>
            <Footer.Title>Melody</Footer.Title>
            <Footer.Link href="#">Green and Healthy Lifestyle</Footer.Link>
            <Footer.Link href="#">Dillibazar, KTM</Footer.Link>
          </Footer.Column>
        </Footer.Row>
      </Footer.Wrapper>
    </Footer>
  );
}
