import React from "react";
import { useState } from "react";

export function Upload(){

  const [terrainFile, setTerrainFile] = useState<File>();
  const [heightFile, setHeightFile] = useState<File>();

	const terrainChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement> 
  ) => {
		setTerrainFile(event.target.files![0]);
	};

	const heightChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement> 
  ) => {
		setHeightFile(event.target.files![0]);
	};

	const handleSubmission = () => {
    if (terrainFile === undefined && heightFile === undefined) {
      // TODO: Tell user to make sure they've selected a file
      return;
    }
		const formData = new FormData();

		formData.append('images', terrainFile!);
		formData.append('images', heightFile!);

		fetch(
      `/uploadTerrainData`,
			{
				method: 'POST',
				body: formData,
			}
		)
			.then((response) => response.json())
			.then((result) => {
				console.log('Success:', result);
        // TODO: Tell the user they succeeded
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

    return(
        <div>
                 <input type="file" name="terrainFile" onChange={terrainChangeHandler} />
                 <input type="file" name="heightFile" onChange={heightChangeHandler} />
                 <div>
                     <button onClick={handleSubmission}>Submit</button>
                 </div>
             </div>
         )
    }



export default Upload