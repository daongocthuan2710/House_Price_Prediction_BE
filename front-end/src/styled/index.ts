import styled from "styled-components";
import { MARGIN_DEFAULT } from "../constants";

export const CustomContainer = styled.div<{ $isDarkMode: boolean }>`
  text-align: center;
  padding-top: ${MARGIN_DEFAULT};
  background-color: ${({ $isDarkMode }) =>
    $isDarkMode ? "rgb(16, 12, 42)" : "rgb(255,255,255)"};
`;

export const CustomFormWrapper = styled.div`
  width: 60%;
  margin-left: 20%;
`;

export const CustomChartWrapper = styled.div`
  width: 80%;
  margin-left: 10%;
  display: flex;
  gap: 50px;
  flex-direction: column;
`;

export const CustomDarkModeWrapper = styled.div<{ $isDarkMode: boolean }>`
  float: left;
  margin-bottom: ${MARGIN_DEFAULT};
  color: ${({ $isDarkMode }) => ($isDarkMode === true ? "white" : "black")};
`;

export const CustomTitle = styled.h2`
  overflow: hidden;
  font-weight: bold;
  font-size: 36px;
  line-height: 1.3;
  letter-spacing: 5px;
  background-image: linear-gradient(
    -45deg,
    #fff 20%,
    #6355a4 40%,
    #e89a3e 60%,
    #fff 80%
  );
  margin-top: 0;
  background-size: auto auto;
  background-clip: border-box;
  background-size: 200% auto;
  color: #fff;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: typing 3.5s steps(40, end), textclip 3s linear infinite;
  white-space: nowrap;
  bottom: 60px;

  @keyframes typing {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
  @keyframes textclip {
    to {
      background-position: 100% center;
    }
  }
`;
