import {useNavigate, useParams} from 'react-router-dom';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import { LinkOutlined , RedoOutlined, HomeOutlined} from '@ant-design/icons';
import { base_url } from '../../App';
import styles from './resultButtonGroup.module.css';
function ResultButtonGroup(){
    const navigate = useNavigate();
    const [copiedText, copy] = useCopyToClipboard();
    const{tournamentId} = useParams();

    const onClickGoHomeButton = () => {
        navigate('/');
    }
    return(
        <div className={styles.mainDiv}>
            <div className={styles.titleDiv}>
                <h3 >링크를 복사하여 결과를 공유해주세요!</h3>
            </div>
            <div className={styles.upperDiv}>
                <button className={styles.button} onClick={() => {
                    navigate(`/${tournamentId}/match`);
                }}><RedoOutlined />&nbsp;뒤로가기</button>
                <button className={styles.button} onClick={() => {
                    copy(`${base_url}/${tournamentId}/match/result`);
                    alert("링크가 복사되었습니다.");
                }}><LinkOutlined />&nbsp;
                    링크복사
                </button>
                <button className={styles.button} onClick={onClickGoHomeButton}>
                    <HomeOutlined/>&nbsp;
                    홈으로
                </button>
            </div>
        </div>
    )
}
export default ResultButtonGroup;