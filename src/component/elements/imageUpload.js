import React, { forwardRef, useEffect, useRef, useState } from "react";
import "../../css/imageUpload.css";

const ImageUpload = forwardRef((props, canvasElement) => {
    const [banner, setBanner] = useState();
    const imageElement = useRef();
    const preViewImageElement = useRef();
    const imageEditElement = useRef();
    const imageScaleElement = useRef();
    const imageTopElement = useRef();
    const imageLeftElement = useRef();
    const bannerElement = new Image();

    useEffect(() => {
        imageElement.current.style.width = props.width + 'px';
        imageElement.current.style.height = props.height + 'px';
        preViewImageElement.current.style.width = props.width + 'px';
        preViewImageElement.current.style.height = props.height + 'px';
        canvasElement.current.width = parseFloat(props.width);
        canvasElement.current.height = parseFloat(props.height);
    }, []);

    const addImage = () => {
        imageEditElement.current.style.display = 'block';
    };

    const selectImage = (event) => {
        if (event.currentTarget.files.length > 0) {
            let imageFile = event.currentTarget.files[0];
            if (imageFile.size > 5 * 1024 * 1024) {
                event.currentTarget.value = null;
                alert("File quá lớn. Vui lòng chọn file có kích thước không quá 5MB!");
            }
            else {
                let fileReader = new FileReader();
                fileReader.onload = () => {
                    bannerElement.src = fileReader.result;
                };
                fileReader.readAsDataURL(imageFile);
            }
        }
    }

    const resizeImage = () => {
        let scale = parseFloat(imageScaleElement.current.value) / 100;
        let positionX = parseFloat(imageLeftElement.current.value);
        let positionY = parseFloat(imageTopElement.current.value);
        const ctx = canvasElement.current.getContext("2d");
        ctx.clearRect(0, 0, canvasElement.width/2, canvasElement.height/2);
        ctx.beginPath();
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(bannerElement, positionX, positionY, bannerElement.width / scale, bannerElement.width / parseFloat(props.width) * parseFloat(props.height) / scale, 0, 0, canvasElement.current.width, canvasElement.current.height);
    }

    const saveImage = () => {
        imageElement.current.style.backgroundImage = 'url("' + canvasElement.current.toDataURL() + '"';
        imageEditElement.current.style.display = "none";
    }

    const cancelImage = () => {
        imageEditElement.current.style.display = "none";
        document.getElementById("image-upload-preview-input-" + props.id).value = null;
    }

    return (
        <div id={props.id} className="image-upload">
            <div className="image-upload-label">{props.label}</div>
            <div id={"image-upload-image-" + props.id} className="image-upload-image"
                onClick={addImage}
                ref={imageElement}>
                <i class="bi bi-camera" style={{ scale: '2' }}></i>
            </div>
            <div id={"image-upload-edit-" + props.id}
                className="image-upload-edit"
                ref={imageEditElement}
                style={{ display: "none" }}>
                <div className="image-upload-edit-1">
                    <div className="image-upload-shape">
                        <label className="image-upload-size">
                            Scale(%)
                            <input id={"image-upload-scale" + props.id}
                                className="image-upload-scale"
                                defaultValue="100"
                                min="0"
                                max="1000"
                                type="number"
                                ref={imageScaleElement}
                                onChange={resizeImage} />
                        </label>
                        <label className="image-upload-position-left">
                            Left
                            <input id={"image-upload-positionX" + props.id}
                                className="image-upload-left"
                                defaultValue="0"
                                min="0"
                                type="number"
                                ref={imageLeftElement}
                                onChange={resizeImage} />
                        </label>
                        <label className="image-upload-position-top">
                            Top
                            <input id={"image-upload-positionY" + props.id}
                                className="image-upload-top"
                                defaultValue="0"
                                min="0"
                                type="number"
                                ref={imageTopElement}
                                onChange={resizeImage} />
                        </label>
                    </div>
                    <label id={"image-upload-preview-" + props.id}
                        className="image-upload-preview"
                        style={{ backgroundSize: "100%", backgroundPositionX: "0%", backgroundPositionY: "0%" }}
                        ref={preViewImageElement}>
                        <canvas id={"image-upload-preview-canvas-" + props.id}
                            className="image-upload-preview-canvas"
                            ref={canvasElement}></canvas>
                        <i class="bi bi-camera" style={{ scale: '2' }}></i>
                        <input id={"image-upload-preview-input-" + props.id} className="image-upload-input" type="file" onChange={selectImage} />
                    </label>
                    <div className="image-upload-edit-buttons">
                        <button className="image-upload-edit-save-button" type="button" onClick={saveImage}>Save</button>
                        <button className="image-upload-edit-cancel-button" type="button" onClick={cancelImage}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default ImageUpload;