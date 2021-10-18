function getHello(): Promise<any> {
   return fetch('/hw').then(response => response.json());
}

export default getHello