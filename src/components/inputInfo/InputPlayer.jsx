import React from 'react'
import styles from './inputPlayer.module.css'
import {useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';


function InputPlayer() {
    const {groupCount, peopleCount} = useParams();
    const navigate = useNavigate();
    const playerCount = peopleCount.split("-").map(Number);
    const matchId = uuidv4();
    const [people, setPeople] = useState({}); 


    const onButtonClick = async () => {
        const matchCollection = collection(db, 'matches');
        for(let i =0; i<groupCount; i++){
            try{
                
                var matchData = {
                    matchId : matchId,
                    group : i+1,
                    people : people[`group${i+1}`],
                };


                for(let j=0; j<people[`group${i+1}`].length; j++){
                    matchData[`score${j + 1}`] = [0,0];
                }
                console.log('저장하려는 데이터 :', matchData);

                await addDoc(matchCollection, matchData);

                console.log(`$group${i+1} 성공`);
            }catch(error){
                console.error(`$group${i+1} 에러`, error );
            }
        }
        navigate(`/${groupCount}/${peopleCount}/${matchId}`);
    }


    const handlePeopleChange = (groupIndex, playerIndex, value) => {
        const newPeople = { ...people };
        if (!newPeople[`group${groupIndex + 1}`]) {
            newPeople[`group${groupIndex + 1}`] = [];
        }
        newPeople[`group${groupIndex + 1}`][playerIndex] = value;
        setPeople(newPeople);
    };

    return (
    <div>
    <h1> 선수 이름을 적어주세요. </h1>
    {Array.from({length : groupCount}, (_, groupIndex) => (
        <div key={groupIndex} className = {styles.contentWrap}>
            <h3>{groupIndex +1} 조</h3>
            {Array.from({length : playerCount[groupIndex]}, (_, playerIndex) => (
                <div key = {playerIndex}className={styles.nameDiv}>
                    <p>Player{playerIndex+1}</p> 
                    <input className={styles.input} onChange={(e) => handlePeopleChange(groupIndex, playerIndex, e.target.value)}></input>
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