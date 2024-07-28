import React from 'react';

// const rtl = document.getElementsByTagName('html')[0].getAttribute('dir');
const wrapProps = (Component) => (props) => <Component {...props} />;

export default wrapProps;
// export { rtl };
