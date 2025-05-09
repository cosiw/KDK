import React from 'react';
import {useState} from 'react';
import styles from './mainInput.module.css';
import {useNavigate} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import KakaoAdfit from '../KakaoAdfit';
import CoupangDynamicBanner from '../CoupangDynamicBanner';
import { Link } from 'react-router-dom';
function MainInput({setMode}) {

    const [groupCount, setGroupCount] = useState(0);
    // 조 개수 입력 값 업데이트
    const handleGroupChange = (event) => {
      setGroupCount(event.target.value);
    };
    
    

    const onButtonClick = () => {
      const tournamentId = uuidv4();
      if(groupCount === 0){
        alert("조를 입력해주세요.");
        return;
      }
      if(groupCount < 1 || groupCount > 10){
        alert("조는 1 ~ 10개만 가능합니다.");
        return;
    }
      localStorage.setItem('tournamentId', tournamentId);
      localStorage.setItem('groupCount', groupCount);
      setMode('people');
    }
    return <div>
        <img style={{width: "100%"}} src="/images/Table.png" alt="placeholder" />
        <Link to="/how-to-use" className={styles.guideButton}>
          이용 가이드
        </Link>
        <h1>몇 개의 조인가요?</h1>

      <form>
      <div className = {styles.contentWrap}>
            <div className={styles.inputTitle}>
                
            </div>
            <div className={styles.inputWrap}>
                <input className={styles.input} type="number" onChange={handleGroupChange}></input>
            </div>
        </div>
      </form>

      <div>
        <button className={styles.inputBtn} onClick={() => onButtonClick()}> 입력 </button>
      </div>
      <div style={{marginTop: "20px"}}>
      
      <KakaoAdfit />
      <CoupangDynamicBanner unit={"introBanner"} />
      </div>
    </div>
}

export default MainInput;