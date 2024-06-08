import React, { useState, useRef } from 'react';

interface ImageUploadState {
    preview: string;
    data: File | null;
}

const UploadImage: React.FC = () => {
    const [status, setStatus] = useState<string>('');
    const [image, setImage] = useState<ImageUploadState>({ preview: '', data: null });
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        displayLoader("show");
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            setImage({
                preview: URL.createObjectURL(file),
                data: file
            });
            setTimeout(function () {
                triggerSubmit();
            }, 2000);
        }
    };
    
    const triggerSubmit = () => {
        (refSubmitButton.current! as HTMLInputElement).click();
    };

    const displayLoader = (flag :String) => {
        let showHide = "hidden";
        if (flag === "show") {
          showHide = "visible";
        }
        (document.querySelector(".loader")! as HTMLInputElement).style.visibility = showHide;
      };

    const handleImageUpload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!image.data) {
            setStatus('Kein Bild ausgewählt');
            return;
        }
        const response = await fetch('http://keepitnative.xyz:4000/image', {
            method: 'POST',
            body: image.data
        });

        if (response.ok) {
            displayLoader("hide");
            const data = await response.text();
            const img = {
                preview: URL.createObjectURL(image.data),
                data: image.data,
            };
            setImage(img);
            setStatus(data);
        } else {
            displayLoader("hide");
            setStatus('Upload nicht erfolgreich');
        }
    };

    const refSubmitButton = useRef(null);

    return (
        <>
            <h1>Katzen & Hunde Erkennung</h1>
            <div id="preview">
                {image.preview && (
                    <img src={image.preview} width="100" height="100" />
                )}
            </div>
            <form onSubmit={handleImageUpload} id="form" encType="multipart/form-data">
                <label className="fileContainer">
                    Bild aufnehmen
                    <input
                        id="image-file-choose"
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={handleImageChange}
                    />
                </label>
                <button hidden={true} ref={refSubmitButton} type={"submit"} />
            </form>
            <div id="status">{status && <h4>{status}</h4>}</div>
        </>
    );
};

export default UploadImage;
