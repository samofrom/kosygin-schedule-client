import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const InputGroup = styled.div`
  display: inline-block;
  position: relative;
`;
const Label = styled.label<{ isFocus: boolean }>`
  position: absolute;
  left: 12px;
  top: ${(props) => (props.isFocus ? '0px' : '21px')};
  font-size: ${(props) => (props.isFocus ? '13px' : '15px')};
  font-weight: ${(props) => (props.isFocus ? '300' : '400')};
  transform: translateY(-50%);
  background-color: ${(props) => (props.isFocus ? '#f2f2f2' : 'transparent')};
  padding: ${(props) => (props.isFocus ? '2px 4px' : '0')};
  user-select: none;
  transition: all 0.1s ease-out;
`;
const Input = styled.input`
  width: 300px;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  padding: 10px 15px;
  z-index: 1000;
  background-color: #f2f2f2;
  outline: none;
  border-radius: 5px;
  border: 2px solid #0174fa;
`;

const Select = styled.div<{ isVisible: boolean }>`
  width: 300px;
  margin-top: 5px;
  border-radius: 10px;
  position: absolute;
  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};
  background-color: #ffffff;
`;
const SelectItem = styled.div`
  width: 100%;
  padding: 5px 15px;
  line-height: 1.15;
  cursor: pointer;
`;

interface AutocompleteInputProps {
  label: string;
  name: string;
  data: string[];
}

const SelectInput: React.FC<AutocompleteInputProps> = (props) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [showSelect, setShowSelect] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (event.target.value !== '' && isFocus) setShowSelect(true);
  };

  const handleLabelClick = (event: React.MouseEvent<HTMLLabelElement>) => {
    inputRef.current?.focus();
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocus(true);
    setShowSelect(true);
  };
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (inputValue !== '') setIsFocus(true);
    else setIsFocus(false);

    // setTimeout(() => {
    //   setShowSelect(false);
    // }, 80);
  };

  return (
    <InputGroup>
      <Label
        htmlFor={props.name}
        onClick={(event) => handleLabelClick(event)}
        isFocus={isFocus}
      >
        {props.label}
      </Label>
      <Input
        value={inputValue}
        name={props.name}
        ref={inputRef}
        onChange={(event) => handleInputChange(event)}
        onFocus={(event) => handleFocus(event)}
        onBlur={(event) => handleBlur(event)}
      />
      <Select isVisible={showSelect}>
        {props.data
          .filter((selectItem) =>
            selectItem.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((selectItem) => (
            <SelectItem
              key={selectItem}
              onClick={() => {
                setInputValue(selectItem);
                setIsFocus(true);
                inputRef.current?.focus();
              }}
            >
              {selectItem}
            </SelectItem>
          ))}
      </Select>
    </InputGroup>
  );
};

export default SelectInput;
