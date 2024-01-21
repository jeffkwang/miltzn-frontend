import React, { useEffect, useRef } from 'react';
import BlazeSlider from 'blaze-slider';

function useBlazeSlider(config) {
    const sliderRef = useRef();
    const elRef = useRef();
  
    useEffect(() => {
      if (!sliderRef.current) {
        sliderRef.current = new BlazeSlider(elRef.current, config);
      }
    }, [config]);
  
    return elRef;
  }

export const Carousel = ({children}) => {
    const elRef = useBlazeSlider({
        all: {
          slidesToShow: 3,
          slideGap: '20px',
          enablePagination: true,

          transitionDuration: 500,
          transitionTimingFunction: 'ease',
        },
        '(max-width: 768px)': {
          slidesToShow: 2,
          enablePagination: false,
        },
        '(max-width: 320px)': {
          slidesToShow: 1,
          enablePagination: false,
        },
      })

    

  return (
    <div className="blaze-slider" ref={elRef}>
        <div className="blaze-container">
            <div className="blaze-track-container">
                <div className="blaze-track">
                    {children}
                </div>
            </div>
            <div>
                <button className="blaze-prev" aria-label="Go to previous slide">previous</button>
                <div className="blaze-pagination">
                </div>
                <button className="blaze-next" aria-label="Go to next slide">next</button>
            </div>            
        </div>
    </div>
  );
};
