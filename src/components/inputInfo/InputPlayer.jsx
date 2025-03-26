import React from 'react'
import styles from './inputPlayer.module.css'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';



function InputPlayer() {
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    const onButtonClick = ()=> {
        localStorage.setItem('groups', JSON.stringify(groups));
        const tournamentId = localStorage.getItem('tournamentId');
        navigate(`/${tournamentId}/match`);
    }

    useEffect(() => {
        const storedData = localStorage.getItem('groups');
        const parsedData = storedData ? JSON.parse(storedData) : [];
        setGroups(parsedData);
    }, []);

    const handlePeopleChange = (groupIndex, playerIndex, value) => {
        setGroups(prevGroups => {
            const newGroups = [...prevGroups];

            // group.people 배열이 없는 경우 초기화
            if (!newGroups[groupIndex].people) {
                newGroups[groupIndex].people = [];
            }
            newGroups[groupIndex].people[playerIndex] = value;
            return newGroups;
        });
    };



    return (
    <div>
    <h1> 선수 이름을 적어주세요. </h1>
    {groups.map((group, groupIndex) => (
        <div key={groupIndex} className = {styles.contentWrap}>
            <h3>{group.name}</h3>
            {Array.from({length : group.peopleCount}, (_, playerIndex) => (
                <div key = {playerIndex} className={styles.nameDiv}>
                    <p>Player{playerIndex+1}</p> 
                    <input 
                        className={styles.input}
                        onChange={(e) => handlePeopleChange(groupIndex, playerIndex, e.target.value)}></input>
                </div>
            ))}
        </div>
    ))}
        <div>
        <button onClick={() => onButtonClick()}>입력</button>        
        </div>
    </div>
  )
  
}

export default InputPlayer