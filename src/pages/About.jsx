import React from 'react';
import Content from '../components/content';
import { InformationCircleIcon } from '@heroicons/react/20/solid';

export const AboutPage = () => {
    return (
        <>

        <div className="max-w-4xl mx-auto mt-32">
            <video autoPlay muted loop className="w-full" controls>
                <source src="https://firebasestorage.googleapis.com/v0/b/miltzn-frontend.appspot.com/o/images%2Fcontent%2Fyarn-feeder.mp4?alt=media&token=056da936-637f-4f55-a637-8f31b126480f" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <figcaption className="mt-4 flex gap-x-2 text-sm leading-6 text-gray-500">
            <InformationCircleIcon className="mt-0.5 h-5 w-5 flex-none text-gray-300" aria-hidden="true" />
            Keep calm and wind yarn.
            </figcaption>
        </div>

        <Content
            title="Our Company"
            subtitle="About Us"
            paragraph={ 
                "At Miltzn Home, we believe that home is where the heart is. Wherever you go, we want our pillows and cushions to be a touch of your heart — to remind you that, wherever you are, you are home. \nWe are working on a line of tufted pillow and cushion products that will add joy and comfort to your life. Tufting is the process of embedding yarn strands into cloth. We tuft our designs and have them professionally sewn and finished into pillows and cushions. All our products are handmade to order with nothing but quality, robust material. \nAt the moment, we are just man and machine, working out of our home office. We are working to expand our operations in order to give you a better product at even better prices." 
            }
            bulletPoints={[
                "Made in the USA with imported and domestic materials",
                "Artisanal product at fair prices",
                "Small batch manufacturing to minimize waste",
            ]}
        />

    
        </>
    );
};
