import React, { FC } from 'react';
import styled from 'styled-components';

import logo from '../assets/img/logo.webp';
import {
  IoBookOutline,
  IoChevronBackOutline,
  IoEasel,
  IoReorderFourOutline,
  IoSearchOutline,
  IoSettingsOutline,
} from 'react-icons/io5';
import { Link, useLocation, Location } from 'react-router-dom';

const StyledSidebar = styled.aside`
  flex: 0 0 200px;

  @media only screen and (max-width: 800px) {
    flex: 0 0 50px;
  }
`;

const Header = styled.header`
  display: flex;
  height: 60px;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
`;

const Logo = styled.img`
  width: 30px;
`;

const Navigation = styled.nav`
  padding: 10px 10px;
`;

const SidebarItem = styled.div<{ active?: boolean }>`
  padding: 5px 10px;
  background-color: ${(props) => (props.active ? '#ffffff' : 'transparent')};
  border-radius: 10px;
  margin-bottom: 5px;
  &:hover {
    background-color: ${(props) =>
      props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'};
  }
`;

const Icon = styled.div`
  margin-right: 10px;
  @media only screen and (max-width: 800px) {
    margin-right: 0;
  }
`;

const Text = styled.span`
  @media only screen and (max-width: 800px) {
    display: none;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  line-height: 1;
  &:hover {
    color: inherit;
  }
`;

const isMatch = (location: Location, path: string): boolean =>
  location.pathname === path;

type SidebarProps = {
  isUser: boolean;
  isTeacher: boolean;
};

const Sidebar: FC<SidebarProps> = ({ isUser, isTeacher }) => {
  const location = useLocation();

  return (
    <StyledSidebar>
      <Header>
        <Logo src={logo} />
      </Header>
      <Navigation>
        {(isUser || isTeacher) && (
          <SidebarItem active={isMatch(location, '/')}>
            <StyledLink to={'/'}>
              <Icon>
                <IoReorderFourOutline size={30} />
              </Icon>
              <Text>Расписание</Text>
            </StyledLink>
          </SidebarItem>
        )}
        <SidebarItem active={isMatch(location, '/teacher')}>
          <StyledLink to={'/teacher'}>
            <Icon>
              <IoSearchOutline size={30} />
            </Icon>
            <Text>Преподаватель</Text>
          </StyledLink>
        </SidebarItem>
        {isUser && (
          <SidebarItem active={isMatch(location, '/lessons')}>
            <StyledLink to={'/lessons'}>
              <Icon>
                <IoBookOutline size={30} />
              </Icon>
              <Text>Дисциплины</Text>
            </StyledLink>
          </SidebarItem>
        )}
        {isTeacher && (
          <SidebarItem active={isMatch(location, '/classrooms')}>
            <StyledLink to={'/classrooms'}>
              <Icon>
                <IoEasel size={30} />
              </Icon>
              <Text>Аудитории</Text>
            </StyledLink>
          </SidebarItem>
        )}
        <SidebarItem active={isMatch(location, '/settings')}>
          <StyledLink to={'/settings'}>
            <Icon>
              <IoSettingsOutline size={30} />
            </Icon>
            <Text>Настройки</Text>
          </StyledLink>
        </SidebarItem>
      </Navigation>
    </StyledSidebar>
  );
};

export default Sidebar;
