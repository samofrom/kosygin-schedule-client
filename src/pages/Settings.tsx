import React, { FC, useEffect, useState } from 'react';
import Page from '../components/Page';
import Header from '../components/Header';
import { Heading } from '../components/ui';
import Select from 'react-select';
import axios from 'axios';
import styled from 'styled-components';
import { message, Switch } from 'antd';
import teacher from './Teacher';

const StyledSettings = styled.div`
  padding-top: 70px;
`;

export const GroupSelector = styled.div`
  width: 50%;
  padding: 10px 15px;
  border-radius: 10px;
  background-color: #ffffff;
  div[class*='container'] {
    margin-bottom: 15px;
  }
  @media only screen and (max-width: 730px) {
    width: 100%;
  }
`;

export const Button = styled.button`
  font-family: 'Roboto', sans-serif;
  color: #ffffff;
  padding: 5px 10px;
  outline: none;
  border: none;
  background-color: #0074fc;
  cursor: pointer;
  font-size: 15px;
  border-radius: 5px;
`;

interface Option {
  value: string;
  label: string;
}

interface InstituteResponse {
  instituteName: string;
  instituteId: string;
}

type SettingsProps = {
  setTeacher: (teacher: string) => void;
  setUser: (user: boolean) => void;
};

const Settings: FC<SettingsProps> = ({ setTeacher, setUser }) => {
  const [isTeacher, setIsTeacher] = useState<boolean>(
    Boolean(localStorage.getItem('teacher'))
  );

  const [teachers, setTeachers] = useState<Option[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Option | null>(null);

  const [institutes, setInstitutes] = useState<Option[]>([]);
  const [selectedInstitute, setSelectedInstitute] = useState<Option | null>(
    null
  );
  const [courses, setCourses] = useState<Option[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Option | null>(null);

  const [groups, setGroups] = useState<Option[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Option | null>(null);

  useEffect(() => {
    (async () => {
      if (localStorage.getItem('settingGroup')) {
        const settingGroup = JSON.parse(
          localStorage.getItem('settingGroup') || '{}'
        );
        setSelectedInstitute(settingGroup.selectedInstitute);
        setSelectedCourse(settingGroup.selectedCourse);
        setSelectedGroup(settingGroup.selectedGroup);

        setCourses(await fetchCourses(settingGroup.selectedInstitute.value));
        setGroups(
          await fetchGroups(
            settingGroup.selectedInstitute.value,
            settingGroup.selectedCourse.value
          )
        );
      } else {
        if (localStorage.getItem('teacher')) {
          const teacher = JSON.parse(localStorage.getItem('teacher') || '{}');
          setSelectedTeacher(teacher);
        }
      }
      setTeachers(await fetchTeachers());
      setInstitutes(await fetchInstitutes());
    })();
  }, []);

  const fetchTeachers = async () => {
    const response = await axios.get<string[]>(
      `http://176.57.214.18:80/api/lessons`
    );
    return response.data.map((teacher, index) => ({
      label: teacher,
      value: teacher,
    }));
  };

  const fetchInstitutes = async () => {
    const response = await axios.get<InstituteResponse[]>(
      'http://176.57.214.18:80/api/settings/getInstitutes'
    );
    const data = await response.data;
    return data.map((institute) => ({
      label: institute.instituteName,
      value: institute.instituteId,
    }));
  };

  const handleInstituteChange = async (option: Option | null) => {
    if (option) {
      setSelectedInstitute(option);
      setCourses(await fetchCourses(option.value));
      setSelectedCourse(null);
    }
  };

  const fetchCourses = async (instituteId: string) => {
    const response = await axios.get<string[]>(
      `http://176.57.214.18:80/api/settings/getCoursesByInstituteId/${instituteId}`
    );
    const data = await response.data;
    return data.map((course) => ({
      label: course,
      value: course,
    }));
  };

  const handleCourseChange = async (option: Option | null) => {
    if (option) {
      setSelectedCourse(option);
      if (selectedInstitute?.value && option?.value) {
        setGroups(await fetchGroups(selectedInstitute.value, option.value));
      }
      setSelectedGroup(null);
    }
  };

  const handleGroupChange = async (option: Option | null) => {
    if (option) {
      setSelectedGroup(option);
    }
  };

  const fetchGroups = async (instituteId: string, course: string) => {
    const response = await axios.get<string[]>(
      `http://176.57.214.18:80/api/settings/getGroups/${instituteId}/${course}`
    );
    const data = await response.data;
    return data.map((group) => ({
      label: group,
      value: group,
    }));
  };

  const handleSaveButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (!isTeacher) {
      localStorage.setItem(
        'settingGroup',
        JSON.stringify({
          selectedInstitute,
          selectedCourse,
          selectedGroup,
        })
      );
      setUser(true);
    } else {
      localStorage.setItem('teacher', JSON.stringify(selectedTeacher));
      setTeacher(selectedTeacher!.value);
    }
    message.success('Изменения сохранены', 1);
  };

  const handleTypeSwitch = () => {
    console.log(1);
    console.log(isTeacher);
    if (!isTeacher) {
      setUser(false);
      setSelectedInstitute(null);
      setSelectedCourse(null);
      setSelectedGroup(null);
      localStorage.removeItem('settingGroup');
      setIsTeacher(true);
    } else {
      setTeacher('');
      setIsTeacher(false);
      setSelectedTeacher(null);
      localStorage.removeItem('teacher');
    }
  };

  const handleTeacherChange = (option: Option | null) => {
    setSelectedTeacher(option);
  };

  return (
    <Page>
      <Header>
        {isTeacher ? (
          <Button onClick={handleTypeSwitch}>Я студент</Button>
        ) : (
          <Button onClick={handleTypeSwitch}>Я преподаватель</Button>
        )}
      </Header>
      <StyledSettings>
        <GroupSelector>
          {!isTeacher ? (
            <Heading>Выбор группы</Heading>
          ) : (
            <Heading>Выбор преподавателя</Heading>
          )}
          {!isTeacher ? (
            <div>
              <Select
                placeholder={'Институт'}
                isLoading={!institutes.length}
                loadingMessage={() => 'Загрузка'}
                options={institutes}
                noOptionsMessage={() => 'Нет результатов'}
                onChange={(option: Option | null) =>
                  handleInstituteChange(option)
                }
                value={selectedInstitute}
              />
              {selectedInstitute ? (
                <Select
                  placeholder={'Курс'}
                  isLoading={!courses.length}
                  loadingMessage={() => 'Загрузка'}
                  options={courses}
                  noOptionsMessage={() => 'Нет результатов'}
                  onChange={(option: Option | null) =>
                    handleCourseChange(option)
                  }
                  value={selectedCourse}
                />
              ) : null}
              {selectedCourse ? (
                <>
                  <Select
                    placeholder={'Группа'}
                    isLoading={!groups.length}
                    loadingMessage={() => 'Загрузка'}
                    options={groups}
                    noOptionsMessage={() => 'Нет результатов'}
                    onChange={(option: Option | null) =>
                      handleGroupChange(option)
                    }
                    value={selectedGroup}
                  />
                  <Button
                    disabled={!selectedGroup}
                    onClick={(event) => handleSaveButtonClick(event)}
                  >
                    Сохранить
                  </Button>
                </>
              ) : null}
            </div>
          ) : (
            <div>
              <Select
                placeholder={'Фамилия Имя Отчество'}
                isLoading={!teachers.length}
                loadingMessage={() => 'Загрузка'}
                options={teachers}
                noOptionsMessage={() => 'Нет результатов'}
                onChange={(option: Option | null) =>
                  handleTeacherChange(option)
                }
                value={selectedTeacher}
              />
              {selectedTeacher && (
                <Button onClick={handleSaveButtonClick}>Сохранить</Button>
              )}
            </div>
          )}
        </GroupSelector>
      </StyledSettings>
    </Page>
  );
};

export default Settings;
