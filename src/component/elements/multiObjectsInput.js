import React, { useEffect, useState, useImperativeHandle, useRef } from "react";
import "../../css/multiObjectsInput.css"

const MultiObjectsInput = React.forwardRef((props, ref) => {
    const [selectedObjects, setSelectObjects] = useState([]);
    const multiObjectsInputOptions = useRef();
    const inputRefs = useRef([]);
    const currentScope = useRef();

    const addItem = (event) => {
        if(event.target.checked)
        {
            if(!selectedObjects.includes(event.target.value)){
                setSelectObjects([...selectedObjects, event.target.value]);
            }
        }
        else
        {
            if(selectedObjects.includes(event.target.value)){
                setSelectObjects(selectedObjects.filter(object => object !== event.target.value));
            }
        }
    }

    const deleteItem = (item) => {
        setSelectObjects(selectedObjects.filter(object => object !== item));
        for (var element of inputRefs.current){
            if (element.value === item){
                element.checked = false;
                break;
            }
        }
    }

    useImperativeHandle(ref, () => ({ getValue: () => selectedObjects, clear: () => setSelectObjects([])}), [selectedObjects]);


    useEffect(() => {
        document.addEventListener("click", (event) => {
            if (currentScope.current && !currentScope.current.contains(event.target)) {
                multiObjectsInputOptions.current.style.display = "none";
            }
        });
    }, []);


    useEffect(() => {
        if (props.defaultValue) {
            setSelectObjects(props.defaultValue);
            for (let input of inputRefs.current) {
                if (input && props.defaultValue.includes(input.value)) {
                    input.checked = true;
                }
            }
        }
    }, [props.defaultValue]);

    return (
        <div className="multi-objects-input" id={props.id} ref={currentScope} onClick={(event) => {

        }}>
            <label className="multi-objects-input-label">{props.label}</label>
            <div className="multi-objects-input-box" value={selectedObjects} ref={ref}
                onClick={() => { multiObjectsInputOptions.current.style.display = ""; }}
            >
                {
                    selectedObjects.map(
                        object => <div key={object} className="multi-objects-input-selected-object">
                                      {object}
                                      <i className="bi bi-x delete-selected-object" onClick={() => deleteItem(object)}></i>
                                  </div>
                    )
                }
            </div>
            <div className="multi-objects-input-options" ref={multiObjectsInputOptions} style={{ display: "none" }} >
                <div className="multi-objects-input-list">
                    {
                        props.objects.map(
                            (object, index) =>
                                <label key={object}>
                                    <input className="object-input"
                                        type="checkbox"
                                        name={props.name}
                                        value={object}
                                        onChange={(event) => addItem(event)}
                                        defaultChecked={props.defaultValue && props.defaultValue.includes(object)}
                                        ref={element => { inputRefs.current[index] = element }}
                                    />
                                    {object}
                                </label>
                        )
                    }
                </div>
            </div>
        </div>
    )
})

export default MultiObjectsInput;