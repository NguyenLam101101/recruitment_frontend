import axios from "axios";
import React from "react";
// import TestService from "../service/testService";

class TestComponent extends React.Component{
    constructor(props){
        super(props)
        this.state = {countries:[]}
    }

    componentDidMount(){
        // TestService.getCountry()
        axios.get("http://localhost:8080/employee/country")
        .then((response)=>{this.setState({countries:response.data})})
    }

    render(){
        return(
            <div>
                <h1>All the countries is</h1>
                {
                    this.state.countries.map(
                        country => 
                        <div>{country.name}</div>
                    )
                }
            </div>
        )
    }
}

export default TestComponent;