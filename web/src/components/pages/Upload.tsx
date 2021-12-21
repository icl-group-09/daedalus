import React from "react";
import { useState, createContext, useContext } from "react";

export function Upload(){

  const [selectedFile, setSelectedFile] = useState<File>();
	const [isFilePicked, setIsFilePicked] = useState(false);

	const changeHandler = (
    event: React.ChangeEvent<HTMLInputElement> 
  ) => {
		setSelectedFile(event.target.files![0]);
		setIsFilePicked(true);
	};

	const handleSubmission = () => {
    if (selectedFile == undefined) {
      // TODO: Tell user to make sure they've selected a file
      return;
    }
		const formData = new FormData();

		formData.append('images', selectedFile!);

		fetch(
			// 'https://freeimage.host/api/1/upload?key=<YOUR_API_KEY>',
      `/uploadTerrainData`,
			{
				method: 'POST',
				body: formData,
			}
		)
			.then((response) => response.json())
			.then((result) => {
				console.log('Success:', result);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

    return(
        <div>
                 <input type="file" name="file" onChange={changeHandler} />
                 <div>
                     <button onClick={handleSubmission}>Submit</button>
                 </div>
             </div>
         )
    }



export default Upload