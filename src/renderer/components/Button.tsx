/* eslint-disable react/require-default-props */
import { styled } from 'styled-components';

const ButtonContainer = styled.button`
  background-color: rgba(230, 38, 0, 0.17);
  border-radius: 4px;
  color: #e62600;
  cursor: pointer;
  border: none;

  &:focus {
    outline: none;
  }
`;

export default function Button({
  verticalPadding = '0px',
  horizontalPadding = '0px',
  placeholder = '',
  text = '',
  style = {},
}: {
  verticalPadding?: string;
  horizontalPadding?: string;
  placeholder?: string;
  text?: string;
  style?: object;
}) {
  return (
    <ButtonContainer
      style={{
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding,
        paddingTop: verticalPadding,
        paddingBottom: verticalPadding,
        ...style,
      }}
      placeholder={placeholder}
    >
      {text}
    </ButtonContainer>
  );
}
