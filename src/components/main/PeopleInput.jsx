import React from 'react'
import styles from './peopleInput.module.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function PeopleInput({setMode, groupCount}) {
    
        // 참가자 수를 저장할 상태 (배열)
        const [peopleCount, setPeopleCount] = useState(Array(groupCount).fill(0));
        const [groupName, setGroupName] = useState(Array(groupCount).fill(0));
        const navigate = useNavigate();
        // 조 개수 입력 값 업데이트
        const handlePeopleChange = (index, value) => {

            const newPeople = [...peopleCount]
            newPeople[index] = parseInt(value, 10) || 0;
            setPeopleCount(newPeople);
        };

        const handleGroupNameChange = (index, value) => {
            const newGroup = [... groupName];
            newGroup[index] = value;;
            setGroupName(newGroup);
        }

        const onButtonClick = () => {
            const groups = [];
            
            for(let i = 0; i < groupCount; i++){
                if(peopleCount[i] < 5 || peopleCount[i] > 10){
                    alert("조당 인원수는 5 ~ 10명만 가능합니다.");
                    return;
                }
                groups.push({name: groupName[i], peopleCount: peopleCount[i], tournamentId: localStorage.getItem('tournamentId')});
            }
            localStorage.setItem('groups', JSON.stringify(groups));
            const tournamentId = localStorage.getItem('tournamentId');
            navigate(`/${tournamentId}`);
            
        }
    return <div>
        <img style={{width: "100%"}} src="/images/Table.png" alt="placeholder" />
        <h1>각 조의 사람은 몇 명인가요?</h1>
        <h3> 참가자 수는 5 ~ 10명만 가능합니다.</h3>
        {Array.from({ length : groupCount}, (_, index) => (
           <div key={index} className={styles.contentWrap}>
           {/* 조 이름 입력 */}
           <div className={styles.inputWrap}>
               <span className={styles.inputTitle}>조 이름:</span>
               <input 
                   className={styles.input} 
                   onChange={(e) => handleGroupNameChange(index, e.target.value)}
               />
           </div>
   
           {/* 조 참가자 수 입력 */}
            <div className={styles.inputWrap}>
                <span className={styles.inputTitle}>{index + 1}조 참가자 수:</span>
                <input
                    type="number" 
                    className={styles.input} 
                    onChange={(e) => handlePeopleChange(index, e.target.value)}
                />
            </div>
        </div>
        ))}
        
        
        <div>
        <button className={styles.inputBtn} onClick={() => onButtonClick()}> 입력 </button>
        </div>
    </div>
}

export default PeopleInput