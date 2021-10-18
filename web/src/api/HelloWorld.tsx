import React, { useEffect, useState } from 'react';
const HelloWorld = () => {
   const [aState, setA] = useState();

   useEffect(() => {
      // Run the first time this component renders
      fetch('/hw')
      .then(response => response.json())
      .then(data => setA(data))
   })
   return (
      <div>{JSON.stringify(aState)}</div>
   )
}
export default HelloWorld