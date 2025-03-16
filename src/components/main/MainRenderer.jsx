import { useState } from "react";
import MainInput from "./MainInput";
import PeopleInput from "./PeopleInput";

function MainRenderer(){

    const [mode, setMode] = useState("group"); // group, people
    const [groupCount, setGroupCount] = useState(0);
    const [peopleCount, setPeopleCount] = useState([]);

    if(mode === "group"){
        return(
            <MainInput setMode={setMode} setGroupCount={setGroupCount}/>
        )
    }else if(mode === "people"){
        return(
            <PeopleInput setMode={setMode} groupCount={groupCount} setPeopleCount={setPeopleCount}/>
        )
    }else{
        return <div> 잘못된 페이지입니다! </div>
    }
}

export default MainRenderer;