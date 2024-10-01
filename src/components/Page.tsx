import React from 'react';
import styled from 'styled-components';

const StyledPage = styled.div``;

interface PageProps {
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = (props) => {
  return <StyledPage>{props.children}</StyledPage>;
};

export default Page;
