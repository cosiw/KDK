import React from 'react'
import {GAMES} from '../../data/GAMES';
import { db } from '../../config/firebase';
import { collection, addDoc, getDocs,  query, where } from 'firebase/firestore';
import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

function InputResult() {
  // const {groupCount,peopleCount,matchId} = useParams();
  // const [matchInfoList, setMatchInfoList] = useState();
  // const playerCount = peopleCount.split("-").map(Number);

  const [groups, setGroups] = useState([]);

  const onSaveButtonClick = async () => {
    const gamesCollection = collection(db, 'games');
    
    for (const game of GAMES) {
      for(const match of game.matches){
        try{
          console.log('저장하려는 데이터 :', {
            nubmer: game.number,
            game: match.game,
            team1: match.team1,
            team2: match.team2
          });

          await addDoc(gamesCollection, {
            number: game.number,
            game: match.game,
            team1: match.team1,
            team2: match.team2
          });

          console.log(`번호 ${game.number}, 매치 저장 성공`);
        } catch (error){
          console.error(`게임 번호 ${game.number}, 매치 저장 실패:`, error);
        }
      }
    }
  };
  useEffect(() => {
    const storedGroups = localStorage.getItem('groups');
    if (storedGroups) {
      setGroups(JSON.parse(storedGroups)); // 저장된 데이터 파싱하여 상태 설정
    }
  }, []);
  
  useEffect(() =>{

    const fetchMatchInfo = async () => {
      console.log('groups:', groups);
      await Promise.all(groups.map(async group => {
        console.log('group:', group);
        const matchQuery =  query(
          collection(db, 'games'),
          where('number', '==', group.peopleCount));

        const matchSnapshot = await getDocs(matchQuery);

        const matchData = matchSnapshot.docs.map(doc => doc.data());
        
        
      }));
      
      
    }
    fetchMatchInfo();
   
  }, [groups]);

  return (
    <div>
      <h1>스코어를 입력하세요.</h1>

    </div>
    
  )
}

export default InputResult