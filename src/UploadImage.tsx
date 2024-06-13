import React, { useState, useRef } from 'react';

interface ImageUploadState {
    preview: string;
    data: File | null;
}

const UploadImage: React.FC = () => {
    const [status, setStatus] = useState<string>('');
    const [image, setImage] = useState<ImageUploadState>({ preview: '', data: null });
    const refSubmitButton = useRef<HTMLButtonElement>(null);

    const resolvePromise = (file: File): Promise<ImageUploadState> => {
        const obj: ImageUploadState = {
            preview: URL.createObjectURL(file),
            data: file
        };
        return new Promise((resolve) => {
            resolve(obj);
        });
    }

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        displayLoader("show");
        const file = event.target.files?.[0];
        if (file) {
            const obj2 = await resolvePromise(file);
            setImage(obj2);
            setTimeout(triggerSubmit, 200);
        }
    };

    const triggerSubmit = () => {
        refSubmitButton.current?.click();
    };

    const displayLoader = (flag: string) => {
        const showHide = flag === "show" ? "visible" : "hidden";
        const loader = document.querySelector(".loader") as HTMLElement;
        loader.style.visibility = showHide;
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

        displayLoader("hide");

        if (response.ok) {
            const data = await response.text();
            setStatus(data);
        } else {
            setStatus('Upload nicht erfolgreich');
        }
    };

    return (
        <>
            <h1>Katzen & Hunde Erkennung</h1>
            <div id="preview">
                {image.preview && (
                    <img src={image.preview} width="100" height="100" alt="Preview" />
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
                <button hidden={true} ref={refSubmitButton} type="submit" />
            </form>
            <div id="status">{status && <h4>{status}</h4>}</div>
            <div className="loader" style={{ visibility: 'hidden' }}>Loading...</div>
        </>
    );
};

export default UploadImage;
