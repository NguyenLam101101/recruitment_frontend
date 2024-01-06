import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "../../css/addressInput.css"
import { STATECONTEXT } from "../../App";

function AddressInput(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [provinces, setProvinces] = useState([]);
    const [filterDistricts, setFilterDistricts] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(props.defaultValue !== undefined && props.defaultValue.province);
    const [selectedDistrict, setSelectedDistrict] = useState(props.defaultValue !== undefined && props.defaultValue.district);

    useEffect(() => {
        if (globalState.provinces !== undefined){
            setProvinces(globalState.provinces);
            setFilterDistricts(globalState.provinces[0].districts);
        }
        else{
            axios.get(globalState.appServer + globalState.api.getProvinces)
            .then(response => (response.data !== undefined) ? response.data : [])
            .then(data => {
                setGlobalState({...globalState, provinces: data});
                setProvinces(data);
                setFilterDistricts(data[0].districts);
            });
        }
    }, []);

    const selectProvince = (event) => {
        setSelectedProvince(event.target.value);
        let filterDistricts1 = provinces.find(
            province => province.name === event.target.value).districts;
        setFilterDistricts(filterDistricts1);
        setSelectedDistrict(filterDistricts1[0]);
    };

    return (
        <div id={props.id} className="address-input">
            <div className="address-input-label">{props.label}</div>
            <div className="address-input-components">
                <div className="address-input-province">
                    <label>Tỉnh/Thành phố</label>
                    <select id={props.id + "-province"} className="address-input-province-options" 
                        name = {props.provinceName !== undefined ? props.provinceName : "province"}                        
                        onChange={selectProvince}
                        value={selectedProvince}>
                        {
                            provinces.map(
                                province => <option key={province.name} value={province.name}>{province.name}</option>
                            )
                        }
                    </select>
                </div>
                <div className="address-input-district">
                    <label>Quận/Huyện</label>
                    <select id={props.id + "-district"} 
                        className="address-input-district-options" 
                        name={props.districtName !== undefined ? props.districtName : "district"}
                        onChange={event => setSelectedDistrict(event.target.value)}
                        value={selectedDistrict}>
                            <option value=""></option>
                            {
                                filterDistricts.map(
                                    district => <option key={district} value={district}>{district}</option>
                                )
                            }
                    </select>
                </div>
            </div>
        </div>
    )
}

export default AddressInput;