import * as React from "react";
import dynamic from 'next/dynamic';


import './reveal/reset.css';
import './reveal/reveal.css';
import './reveal/theme/white.css';

const Reveal = dynamic(() => Promise.resolve(import('reveal.js')), { ssr: false, })

const Slide = ({ src }) => {
    React.useEffect(() => {
        // let deck = new Reveal({
        //     backgroundTransition: 'slide',
        //     transition: 'slide'
        //  })
        //  deck.initialize();
        //  console.log('initialized fool')
    },[])

    return (
        <iframe width="100%" height="600" marginheight="0" marginwidth="0" src={src}>
        Fallback text here for unsupporting browsers, of which there are scant few.
        </iframe>
    );
}

const MyComponent = dynamic(() => Promise.resolve(Slide), { ssr: false });

export default Slide