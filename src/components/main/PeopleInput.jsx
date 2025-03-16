import React from 'react'
import styles from './peopleInput.module.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function PeopleInput({setMode, groupCount, setPeopleCount}) {
    
        // 참가자 수를 저장할 상태 (배열)
        const [people, setPeople] = useState(Array(groupCount).fill(0));
        const navigate = useNavigate();
        // 조 개수 입력 값 업데이트
        const handlePeopleChange = (index, value) => {
            const newPeople = [...people]
            newPeople[index] = parseInt(value, 10) || 0;
            setPeople(newPeople);
        };

        const onButtonClick = () => {
            setPeopleCount(people);
            const peopleString = people.join("-");
            navigate(`${groupCount}/${peopleString}`);
            
        }
    return <div>
        <img style={{width: "100%"}} src="/images/Table.png" alt="placeholder" />
        <h1>각 조의 사람은 몇 명인가요?</h1>
        {Array.from({ length : groupCount}, (_, index) => (
        <div key={index} className = {styles.contentWrap}>
            <div key={index} className={styles.inputTitle}>
                {index + 1 }조 참가자 수
            </div>
            <div className={styles.inputWrap}>
                <input className={styles.input} onChange={(e) => handlePeopleChange(index, e.target.value)}></input>
            </div>
        </div>
        ))}
        
        
        <div>
        <button className={styles.inputBtn} onClick={() => onButtonClick()}> 입력 </button>
        </div>
    </div>
}

export default PeopleInput