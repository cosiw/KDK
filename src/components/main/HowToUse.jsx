import React from "react";
import styles from "./howToUse.module.css"; // CSS 모듈을 사용하여 스타일링
import { Link } from "react-router-dom"; // react-router 사용 시

function HowToUse() {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>KDK 방식을 통한 테니스 경기 관리 사이트 이용 가이드</h1>
        <h2>KDK 방식이란?</h2>
            <p>
            KDK는 테니스 경기에서 조를 나누어 공정하고 효율적으로 경기를 진행할 수 있는 방식입니다.
            본 웹사이트는 이 KDK 방식을 기반으로 그룹별 참가자 구성, 경기 자동 편성, 결과 저장 및 공유 기능을 제공합니다.
            </p>
        <p className={styles.description}>
          이 웹사이트는 KDK 방식으로 테니스 경기를 쉽고 빠르게 관리할 수 있도록 도와주는 서비스입니다.
          아래 단계를 따라가며 경기를 생성하고, 결과를 공유해보세요!
        </p>
  
        
        <section className={styles.section}>
          <h2>1. 그룹 수 입력</h2>
          <img src="/images/main.png" alt="그룹 수 입력 화면" className={styles.image} />
          <p>
            처음 화면에서 원하는 <strong>그룹 수</strong>를 입력한 뒤, 입력 버튼을 눌러주세요.
          </p>
          <p>입력한 숫자만큼 그룹이 자동으로 생성됩니다. 최대 10개까지 가능합니다.</p>
        </section>
  
        <section className={styles.section}>
          <h2>2. 각 그룹의 참가자 수 설정</h2>
          <img src="/images/playerCount.png" alt="참가자 수 입력 화면" className={styles.image} />
          <p>
            생성된 각 그룹마다 <strong>참가자 수</strong>를 입력하고, 입력 버튼을 눌러주세요.
          </p>
          <p>참가자 수는 그룹당 5명부터 10명까지 가능합니다.</p>
        </section>
  
        <section className={styles.section}>
          <h2>3. 참가자 이름 입력</h2>
          <img src="/images/playerName.png" alt="참가자 이름 입력 화면" className={styles.image} />
          <p>
            각 그룹의 참가자 이름을 입력해주세요. 이름을 다 입력한 후에는 입력 버튼을 눌러 저장합니다.
          </p>
        </section>
  
        <section className={styles.section}>
          <h2>4. 경기 결과 입력</h2>
          <img src="/images/inputScore.png" alt="경기 점수 입력 화면" className={styles.image} />
          <p>
            자동 생성된 경기 리스트에 따라 실제 경기를 진행하고, <strong>각 경기의 점수</strong>를 입력해주세요.
          </p>
          <p>
            점수 입력 후 <strong>저장하기</strong> 버튼을 눌러야 입력된 정보가 저장됩니다.
          </p>
          <p>
            모든 경기를 입력한 후 <strong>결과 보기</strong> 버튼을 누르면, 결과 페이지로 이동합니다.
          </p>
          <p className={styles.tip}>※ 이 단계부터는 링크를 복사해 다른 사람과 공유할 수 있습니다.</p>
        </section>
  
        <section className={styles.section}>
          <h2>5. 경기 결과 확인 및 공유</h2>
          <img src="/images/gameResult.png" alt="경기 결과 화면" className={styles.image} />
          <p>
            결과 페이지에서는 <strong>그룹별 승점 및 순위</strong>를 확인할 수 있습니다.
          </p>
          <p>
            <strong>링크 복사</strong> 버튼을 사용해 결과를 손쉽게 공유해보세요!
          </p>
        </section>
  
        <div className={styles.ctaArea}>
          <a href="/" className={styles.ctaButton}>처음으로 돌아가기</a>
        </div>
      </div>
    );
  }

export default HowToUse;