import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Page from '../components/Page';
import axios from 'axios';
import { message, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/ru';

export const StyledSchedule = styled.div`
  padding: 70px 0 50px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  margin-right: 10px;

  .ant-switch {
    padding: 5px 10px;
  }

  @media only screen and (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }

  @media only screen and (max-width: 650px) {
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(6, 1fr);
  }
`;

export const DaySchedule = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
  border-radius: 10px;
  background-color: #ffffff;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  min-width: 0;
  line-height: 1.45;
`;

export const DayOfWeek = styled.h2`
  margin-bottom: 10px;
  line-height: 1;
`;

export const Couples = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
`;

export const Couple = styled.div<{ isActive: boolean }>`
  width: 100%;
  display: flex;
  overflow: hidden;
  min-width: 0;
  margin-bottom: 5px;
  opacity: ${(props) => (props.isActive ? '1' : '0.5')};
`;

export const CoupleNumber = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 1.2;
  position: relative;
`;

export const ActiveCouple = styled.div<{ isCoupleNow: boolean }>`
  position: absolute;
  top: 50%;
  right: -7px;
  height: 85%;
  transform: translateY(-50%);
  content: '';
  width: 2px;
  background-color: ${(props) =>
    props.isCoupleNow ? '#0074fc' : 'transparent'}; ;
`;

export const Lessons = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  width: 100%;
  min-height: 40px;
`;

export const Lesson = styled.div<{ isActive: boolean }>`
  display: flex;
  opacity: ${(props) => (props.isActive ? '1' : '0.5')};
  overflow: hidden;
  min-width: 0;
  flex-grow: 1;
  min-height: 41px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const LessonTime = styled.div`
  padding: 0 3px 0 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
  font-weight: 300;
  min-width: 47px;
`;

export const LessonTimeStart = styled.span`
  vertical-align: top;
`;
export const LessonTimeEnd = styled.span`
  min-width: 0;
`;

export const LessonContent = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow: hidden;
  padding-left: 5px;
`;
export const LessonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  min-width: 0;
`;

export const LessonName = styled.span`
  font-weight: 500;
  flex-grow: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  min-width: 0;
`;

export const LessonType = styled.span`
  margin-left: 5px;
  flex-shrink: 0;
  font-weight: 300;
`;

export const LessonFooter = styled.div`
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  min-width: 0;
`;
export const Class = styled.div`
  overflow: hidden;
  margin-right: 5px;
  flex-shrink: 0;
  font-weight: 300;
`;
export const TeacherBlock = styled.div`
  flex-shrink: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 300;
`;

export const ToolTip = styled.article`
  color: red;
`;

interface ILesson {
  lessonNumber: string;
  time: string;
  classroom?: string;
  lessonType?: string;
  teacher?: string;
  lesson?: string;
}

export interface ICouple extends Array<ILesson> {}

export interface IDayOfWeek {
  location: string;
  dayOfWeek: string;
  odd: ICouple[];
  even: ICouple[];
}

export interface ISchedule {
  group: string;
  schedule: IDayOfWeek[];
}

const getIsOdd = (dateNow: Date): boolean => {
  const firstDate = new Date(2023, 7, 28); //beginning of the semester - 1
  const dateDiff = (+dateNow - +firstDate) / 1000 / 60 / 60 / 24 / 7;
  console.log('isoDd' + Boolean(Math.ceil(dateDiff) % 2));
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

const Schedule = () => {
  const [data, setData] = useState<ISchedule | null>(null);
  const [isOdd, setIsOdd] = useState<boolean>(getIsOdd(new Date()));

  console.log(data);

  useEffect(() => {
    (async () => {
      if (localStorage.getItem('settingGroup')) {
        const settingGroup = JSON.parse(
          localStorage.getItem('settingGroup') || '{}'
        );
        if (settingGroup.selectedGroup.value) {
          let data = await fetchSchedule(settingGroup.selectedGroup.value);
          addEmptyCouples(data);
          setData(data);
        }
      }
    })();
  }, []);

  const fetchSchedule = async (group: string): Promise<ISchedule> => {
    const response = await axios.get<ISchedule>(
      `http://176.57.214.18:80/api/schedule/${group}`
    );

    return response.data;
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

  const isLessonNow = (
    dayOfWeek: number,
    timeStart: string,
    timeEnd: string
  ): boolean => {
    if (!timeStart || !timeEnd) {
      return false;
    }
    if (!timeEnd) {
      timeEnd = timeStart;
    } else if (!timeStart && !timeEnd) return false;
    const [startHour, startMinute] = timeStart.split('-')[0].split(':');
    const [endHour, endMinute] = timeEnd.split('-')[1].split(':');
    const timeNow =
      isOdd === getIsOdd(new Date()) ? moment() : moment().add(7, 'days');
    const lessonStart = moment();
    const lessonEnd = moment();
    lessonStart
      .day(dayOfWeek + 1)
      .hour(+startHour)
      .minute(+startMinute)
      .second(0);
    lessonEnd
      .day(dayOfWeek + 1)
      .hour(+endHour)
      .minute(+endMinute)
      .second(0);
    return timeNow.isBetween(lessonStart, lessonEnd);
  };

  const lessonNameRef = useRef<HTMLSpanElement | null>(null);
  const hasOverflow = (ref: HTMLSpanElement | null): boolean => {
    return true;
  };

  return (
    <Page>
      <Header>
        <Switch
          checkedChildren="Нечетная"
          unCheckedChildren="Четная"
          defaultChecked={isOdd}
          onChange={() => setIsOdd((prevState) => !prevState)}
        />
      </Header>
      <StyledSchedule>
        {data
          ? data.schedule.map((dayOfWeek, dayOfWeekIndex) => {
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
                            <ActiveCouple
                              isCoupleNow={isLessonNow(
                                dayOfWeekIndex,
                                couple[0]?.time,
                                couple[1]?.time
                              )}
                            />
                          </CoupleNumber>
                          <Lessons>
                            {couple.map((lesson, lessonIndex) => {
                              const isActive = lesson.lesson != null;
                              const timeStart =
                                lesson.time?.split('-')[0] || '';
                              const timeEnd = lesson.time?.split('-')[1] || '';
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
                                        {lesson.teacher}
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
            })
          : null}
      </StyledSchedule>
    </Page>
  );
};

export default Schedule;
