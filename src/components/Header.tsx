import React from 'react';
import styled from 'styled-components';

const StyledHeader = styled.header`
  height: 60px;
  width: calc(100% - 200px);
  background-color: #fff;
  position: fixed;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 30px 0 10px;

  div[class*='container'] {
    width: 300px;
    margin-left: 15px;
  }

  @media only screen and (max-width: 800px) {
    width: calc(100% - 50px);
  }

  @media only screen and (max-width: 650px) {
    div[class*='container'] {
      width: 150px;
    }
  }
`;

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = (props) => {
  return <StyledHeader>{props.children}</StyledHeader>;
};

export default Header;
