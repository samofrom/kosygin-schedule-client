import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Page from '../components/Page';
import axios from 'axios';
import { ISchedule } from './Schedule';
import styled from 'styled-components';
import { Heading } from '../components/ui';
import { log } from 'node:util';

const StyledLessons = styled.div`
  padding-top: 70px;
`;

const Paper = styled.div`
  width: 50%;
  padding: 10px 15px;
  border-radius: 10px;
  background-color: #ffffff;
  div[class*='container'] {
    margin-bottom: 15px;
  }
`;

const LessonsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Lessons = () => {
  const [lessons, setLessons] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      if (localStorage.getItem('settingGroup')) {
        const settingGroup = JSON.parse(
          localStorage.getItem('settingGroup') || '{}'
        );
        const response = await axios.get<string[]>(
          `http://176.57.214.18:80/api/lessons/list/${settingGroup.selectedGroup.value}`
        );
        setLessons(response.data);
      }
    })();
  }, []);
  return (
    <Page>
      <Header />
      <StyledLessons>
        <Paper>
          <Heading>Дисциплины</Heading>
          <LessonsList>
            {lessons.map((lesson, index) => (
              <div key={index}>{lesson}</div>
            ))}
          </LessonsList>
        </Paper>
      </StyledLessons>
    </Page>
  );
};

export default Lessons;
