import { useState } from "react";
import MainInput from "./MainInput";
import PeopleInput from "./PeopleInput";

function MainRenderer(){

    const [mode, setMode] = useState("group"); // group, people
    const [peopleCount, setPeopleCount] = useState([]);
    const groupCount = localStorage.getItem('groupCount');
    if(mode === "group"){
        return(
            <MainInput setMode={setMode}/>
        )
    }else if(mode === "people"){
        return(
            <PeopleInput setMode={setMode} groupCount={groupCount}/>
        )
    }else{
        return <div> 잘못된 페이지입니다! </div>
    }
}

export default MainRenderer;