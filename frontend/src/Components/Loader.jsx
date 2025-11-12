import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loaderContainer">
        <img src="/images/Logo.svg" alt="Sakthi Auto Logo" className="logo" />
        <div className="textWrapper">
          <p className="text">Sakthi Auto</p>
          <div className="invertbox" />
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  .loaderContainer {
    display: flex;
    align-items: center;
    gap: 1rem;
    height: fit-content;
  }

  .logo {
    height: 10rem;
    width: auto;
    object-fit: contain;
    flex-shrink: 0;
  }

  .textWrapper {
    height: fit-content;
    min-width: 3rem;
    width: fit-content;
    font-size: 10rem;
    font-weight: 700;
    letter-spacing: 0.25ch;
    position: relative;
    z-index: 0;
    color: white;
    display: flex;
    align-items: center;
  }

  .text {
    margin: 0;
    line-height: 1;
    height: 10rem;
    display: flex;
    align-items: center;
  }

  .invertbox {
    position: absolute;
    height: 100%;
    aspect-ratio: 1/1;
    left: 0;
    top: 0;
    border-radius: 20%;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: invert(100%);
    animation: move 2s ease-in-out infinite;
  }

  @keyframes move {
    50% {
      left: calc(100% - 3rem);
    }
  }
`;

export default Loader;
