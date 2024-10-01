import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import Schedule from './pages/Schedule';
import Teacher from './pages/Teacher';
import Lessons from './pages/Lessons';
import Settings from './pages/Settings';
import Classrooms from './pages/Classrooms';

const Content = styled.main`
  overflow-y: scroll;
  flex: 1 1 0;
`;

const App = () => {
  const [teacher, setTeacher] = useState<string>(
    localStorage.getItem('teacher')!
  );
  const [isUser, setUser] = useState<boolean>(
    Boolean(localStorage.getItem('settingGroup')!)
  );

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isUser && !Boolean(teacher) && location.pathname === '/') {
      navigate('/settings');
    }
  }, [isUser, location.pathname, navigate, teacher]);

  return (
    <>
      <Sidebar isUser={isUser} isTeacher={Boolean(teacher)} />
      <Content>
        <Routes>
          {teacher ? (
            <>
              <Route
                key={'index'}
                path={'/'}
                element={
                  <Teacher
                    teacher={
                      JSON.parse(localStorage.getItem('teacher')!).value!
                    }
                  />
                }
              />
              <Route key={'teacher'} path={'/teacher'} element={<Teacher />} />
              <Route path={'/classrooms'} element={<Classrooms />} />
              <Route
                path={'/settings'}
                element={
                  <Settings
                    setTeacher={(teacher) => setTeacher(teacher)}
                    setUser={(user) => setUser(user)}
                  />
                }
              />
            </>
          ) : isUser ? (
            <>
              <Route path={'/'} element={<Schedule />} />
              <Route key={'teacher'} path={'/teacher'} element={<Teacher />} />
              <Route path={'/lessons'} element={<Lessons />} />
              <Route
                path={'/settings'}
                element={
                  <Settings
                    setTeacher={(teacher) => setTeacher(teacher)}
                    setUser={(user) => setUser(user)}
                  />
                }
              />
            </>
          ) : (
            <>
              <Route key={'teacher'} path={'/teacher'} element={<Teacher />} />
              <Route
                path={'/settings'}
                element={
                  <Settings
                    setTeacher={(teacher) => setTeacher(teacher)}
                    setUser={(user) => setUser(user)}
                  />
                }
              />
            </>
          )}
        </Routes>
      </Content>
    </>
  );
};

export default App;
