import React from 'react'
import styles from './inputPlayer.module.css'
import {useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function InputPlayer() {
    const {groupCount, peopleCount} = useParams();
    const navigate = useNavigate();
    const playerCount = peopleCount.split("-").map(Number);
    
    const onButtonClick = () => {
        navigate(`/${groupCount}/${peopleCount}/score`);
    }
  return (
    <div>
    <h1> 선수 이름을 적어주세요. </h1>
    {Array.from({length : groupCount}, (_, groupIndex) => (
        <div key={groupIndex} className = {styles.contentWrap}>
            <h3>{groupIndex +1} 조</h3>
            {Array.from({length : playerCount[groupIndex]}, (_, playerIndex) => (
                <div key = {playerIndex}className={styles.nameDiv}>
                    <p>Player{playerIndex+1}</p> 
                    <input className={styles.input}></input>
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