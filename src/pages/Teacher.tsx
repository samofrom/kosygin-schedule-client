import React, { FC, useEffect, useState } from 'react';
import Page from '../components/Page';
import Header from '../components/Header';
import axios from 'axios';
import SelectInput from '../components/SelectInput';
import Select from 'react-select';
import styled from 'styled-components';
import {
  ActiveCouple,
  Class,
  Couple,
  CoupleNumber,
  Couples,
  DayOfWeek,
  DaySchedule,
  ICouple,
  IDayOfWeek,
  ISchedule,
  Lesson,
  LessonContent,
  LessonFooter,
  LessonHeader,
  LessonName,
  Lessons,
  LessonTime,
  LessonTimeEnd,
  LessonTimeStart,
  LessonType,
  StyledSchedule,
  TeacherBlock,
} from './Schedule';
import moment from 'moment/moment';
import { Switch } from 'antd';

const StyledSearch = styled.div``;

const Paper = styled.div`
  width: 50%;
  padding: 10px 15px;
  border-radius: 10px;
  background-color: #ffffff;
  div[class*='container'] {
    margin-bottom: 15px;
  }
`;

interface Option {
  value: string;
  label: string;
}

const getIsOdd = (dateNow: Date): boolean => {
  const firstDate = new Date(2022, 7, 28); //beginning of the semester - 1
  const dateDiff = (+dateNow - +firstDate) / 1000 / 60 / 60 / 24 / 7;
  return !Boolean(Math.ceil(dateDiff) % 2);
};

const addEmptyCouples = (data: ISchedule): ISchedule => {
  let maxCoupleNumber = 0;
  let emptyCouple: ICouple = [];

  data.schedule.forEach((dayOfWeek) => {
    if (
      Math.max(dayOfWeek.even.length, dayOfWeek.odd.length) > maxCoupleNumber
    ) {
      maxCoupleNumber = Math.max(dayOfWeek.even.length, dayOfWeek.odd.length);
      emptyCouple = [
        {
          lessonNumber: dayOfWeek.even[maxCoupleNumber - 1][0]?.lessonNumber,
          time: dayOfWeek.even[maxCoupleNumber - 1][0]?.time,
        },
        {
          lessonNumber: dayOfWeek.even[maxCoupleNumber - 1][1]?.lessonNumber,
          time: dayOfWeek.even[maxCoupleNumber - 1][1]?.time,
        },
      ];
    }
  });
  data.schedule.forEach((dayOfWeek) => {
    if (dayOfWeek.even.length < maxCoupleNumber) {
      dayOfWeek.even.push(emptyCouple);
    }
    if (dayOfWeek.odd.length < maxCoupleNumber) {
      dayOfWeek.odd.push(emptyCouple);
    }
  });
  return data;
};

type DayOfWeek = IDayOfWeek & {
  group: string;
};

type TeacherProps = {
  teacher?: string;
};

const Teacher: FC<TeacherProps> = ({ teacher }) => {
  const [teachers, setTeachers] = useState<Option[] | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Option | null>(null);
  const [schedule, setSchedule] = useState<DayOfWeek[] | null>(null);
  const [isOdd, setIsOdd] = useState<boolean>(getIsOdd(new Date()));

  useEffect(() => {
    (async () => {
      if (!teacher) {
        const response = await axios.get<string[]>(
          `http://176.57.214.18:80/api/lessons`
        );
        setTeachers(
          response.data.map((teacher, index) => ({
            label: teacher,
            value: teacher,
          }))
        );
      } else {
        const response = await axios.get<DayOfWeek[]>(
          `http://176.57.214.18:80/api/lessons/${teacher}`
        );

        setSchedule(response.data);
      }
    })();
    return () => {
      setSchedule(null);
    };
  }, [teacher]);

  const handleTeacherChange = async (option: Option | null) => {
    setSelectedTeacher(option);
    const response = await axios.get<DayOfWeek[]>(
      `http://176.57.214.18:80/api/lessons/${option?.label}`
    );
    setSchedule(response.data);
  };

  const formatTime = (time: string) => (time.length < 5 ? '0' + time : time);
  const formatClassroom = (classroom: string | undefined) =>
    Number(classroom) ? `Ауд. ${classroom}` : classroom;
  const formatFirstCapital = (type: string | undefined) =>
    type ? type.charAt(0).toUpperCase() + type.slice(1) : type;
  moment.locale('ru');
  const getDate = (dayOfWeek: string, index: number): string => {
    const _moment =
      getIsOdd(new Date()) === isOdd ? moment() : moment().add(7, 'days');
    return (
      dayOfWeek + ', ' + _moment.locale('ru').weekday(index).format('D MMMM')
    );
  };

  const hasOverflow = (ref: HTMLSpanElement | null): boolean => {
    return true;
  };

  return (
    <Page>
      <Header>
        {schedule && (
          <Switch
            checkedChildren="Нечетная"
            unCheckedChildren="Четная"
            defaultChecked={isOdd}
            onChange={() => setIsOdd((prevState) => !prevState)}
          />
        )}

        {!teacher && (
          <Select
            placeholder={'Преподаватель'}
            isLoading={!teachers?.length}
            loadingMessage={() => 'Загрузка'}
            options={teachers!}
            noOptionsMessage={() => 'Нет результатов'}
            onChange={(option: Option | null) => handleTeacherChange(option)}
            value={selectedTeacher}
          />
        )}
      </Header>
      <StyledSearch>
        {schedule && (
          <StyledSchedule>
            {schedule.map((dayOfWeek, dayOfWeekIndex) => {
              const currentWeek = isOdd ? dayOfWeek.odd : dayOfWeek.even;
              return (
                <DaySchedule key={dayOfWeekIndex}>
                  <DayOfWeek>
                    {getDate(dayOfWeek.dayOfWeek, dayOfWeekIndex)}
                  </DayOfWeek>
                  <Couples>
                    {currentWeek.map((couple, coupleIndex) => {
                      const isActive =
                        couple[0]?.lesson != null || couple[1]?.lesson != null;
                      return (
                        <Couple key={coupleIndex} isActive={isActive}>
                          <CoupleNumber>
                            {coupleIndex + 1}
                            <ActiveCouple isCoupleNow={false} />
                          </CoupleNumber>
                          <Lessons>
                            {couple.map((lesson, lessonIndex) => {
                              if (!lesson)
                                return (
                                  <Lesson key={lessonIndex} isActive={false}>
                                    <LessonTime>
                                      <LessonTimeStart></LessonTimeStart>
                                      <LessonTimeEnd></LessonTimeEnd>
                                    </LessonTime>
                                    <LessonContent>
                                      <LessonHeader>
                                        <LessonName
                                          ref={(ref) => hasOverflow(ref)}
                                        >
                                          Нет занятий
                                        </LessonName>
                                        <LessonType></LessonType>
                                      </LessonHeader>
                                      <LessonFooter>
                                        <Class></Class>
                                        <TeacherBlock></TeacherBlock>
                                      </LessonFooter>
                                    </LessonContent>
                                  </Lesson>
                                );
                              const isActive = lesson.lesson != null;
                              const timeStart = lesson.time.split('-')[0];
                              const timeEnd = lesson.time.split('-')[1];
                              // @ts-ignore
                              return (
                                <Lesson key={lessonIndex} isActive={isActive}>
                                  <LessonTime>
                                    <LessonTimeStart>
                                      {formatTime(timeStart)}
                                    </LessonTimeStart>
                                    <LessonTimeEnd>
                                      {formatTime(timeEnd)}
                                    </LessonTimeEnd>
                                  </LessonTime>
                                  <LessonContent>
                                    <LessonHeader>
                                      <LessonName
                                        ref={(ref) => hasOverflow(ref)}
                                      >
                                        {lesson.lesson
                                          ? lesson.lesson
                                          : 'Нет занятий'}
                                      </LessonName>
                                      <LessonType>
                                        {formatFirstCapital(lesson.lessonType)}
                                      </LessonType>
                                    </LessonHeader>
                                    <LessonFooter>
                                      <Class>
                                        {formatClassroom(lesson.classroom)}
                                      </Class>
                                      <TeacherBlock>
                                        {
                                          //@ts-ignore
                                          ' ' + lesson.group.toUpperCase()
                                        }
                                      </TeacherBlock>
                                    </LessonFooter>
                                  </LessonContent>
                                </Lesson>
                              );
                            })}
                          </Lessons>
                        </Couple>
                      );
                    })}
                  </Couples>
                </DaySchedule>
              );
            })}
          </StyledSchedule>
        )}
      </StyledSearch>
    </Page>
  );
};

export default Teacher;
