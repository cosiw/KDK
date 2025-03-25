import React from 'react';
import {useState} from 'react';
import styles from './MainInput.module.css';
import {useNavigate} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function MainInput({setMode}) {

    const [groupCount, setGroupCount] = useState(0);
    // 조 개수 입력 값 업데이트
    const handleGroupChange = (event) => {
      setGroupCount(event.target.value);
    };
    
    

    const onButtonClick = () => {
      const tournamentId = uuidv4();
      localStorage.setItem('tournamentId', tournamentId);
      localStorage.setItem('groupCount', groupCount);
      setMode('people');
    }
    return <div>
        <img style={{width: "100%"}} src="/images/Table.png" alt="placeholder" />
        <h1>몇 개의 조인가요?</h1>
      <form>
      <div className = {styles.contentWrap}>
            <div className={styles.inputTitle}>
                조
            </div>
            <div className={styles.inputWrap}>
                <input className={styles.input} onChange={handleGroupChange}></input>
            </div>
        </div>
      </form>
      <div>
        <button className={styles.inputBtn} onClick={() => onButtonClick()}> 입력 </button>
      </div>
    </div>
}

export default MainInput;