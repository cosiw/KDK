import React from 'react'
import {GAMES} from '../../data/GAMES';
import { db } from '../../config/firebase';
import { collection,doc, addDoc, setDoc, getDoc,  query, where, orderBy } from 'firebase/firestore';
import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import styles from './inputResult.module.css';

function InputResult() {
  // const {groupCount,peopleCount,matchId} = useParams();
  // const [matchInfoList, setMatchInfoList] = useState();
  // const playerCount = peopleCount.split("-").map(Number);

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태

  const handleScoreChange = (groupIndex, matchIndex, scoreIndex, value) => {
    setGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      newGroups[groupIndex].matches[matchIndex].score[scoreIndex] = parseInt(value, 10) || 0;
      return newGroups;
    });

    console.log(groups);
  };

  const onResultButtonClick = async () => {
    const tournamentId = localStorage.getItem('tournamentId');
    const groupCount = localStorage.getItem('groupCount');
    const tournamentCollection = collection(db, `tournaments`);
    const groupCollection = collection(db, `tournaments/${tournamentId}/groups`);
    const matchCollection = collection(db, `tournaments/${tournamentId}/matches`);
    try{
      await addDoc(tournamentCollection, {
        tournamentId: tournamentId,
        groupCount : groupCount,
      });
      
      groups.forEach(async (group) => {
        const groupDoc = doc(db, "tournaments", tournamentId, "groups", group.name);
        const groupRef = await getDoc(groupDoc);
        if(groupRef.exists()){
          await setDoc(groupCollection, {
            name: group.name,
            peopleCount: group.peopleCount,
            people: group.people,
          }, {merge: true});
          console.log("group update!!");
        }else{
          await addDoc(groupCollection, {
            name: group.name,
            peopleCount: group.peopleCount,
            people: group.people,
          })
          console.log("group insert!!");
        }
        
        group.matches.forEach(async (match) => {
          const matchDoc = doc(db, "tournaments", tournamentId, "matches", match.game);
          const matchRef = await getDoc(matchDoc);
          if(matchRef.exists()){
            await setDoc(matchCollection, {
              game: match.game,
              team1: match.team1,
              team2: match.team2,
              score: match.score,
              groupName: group.name,
            }, {merge: true});
            console.log("match update!!");
          }else{
            await addDoc(matchCollection, {
              game: match.game,
              team1: match.team1,
              team2: match.team2,
              score: match.score,
              groupName: group.name,
            });    
            console.log("match insert!!");
          }
          
        });
      });

    }catch(error){
      console.error('결과를 저장하는데 실패했습니다.', error);
    }
  }



  useEffect(() => {
    const storedGroups = localStorage.getItem('groups');
    if (storedGroups) {
      setGroups(JSON.parse(storedGroups)); // 저장된 데이터 파싱하여 상태 설정
    }
  }, []);
  
  useEffect(() =>{
    if(groups.length === 0) return;

    const fetchMatchInfo = async () => {
      try{
        const updatedGroups = await Promise.all(
          groups.map(async (group) => {
          const matchQuery =  query(
            collection(db, 'games'),
            where('number', '==', group.peopleCount),
            orderBy('game')
          );
  
          const matchSnapshot = await getDocs(matchQuery);
          const matchData = matchSnapshot.docs.map(doc => doc.data());
          
          const updatedMatches = matchData.map(data => {
            return {
              ...data,
              team1: data.team1.map((index) => group.people[index - 1]), // 사람 이름으로 변경
              team2: data.team2.map((index) => group.people[index - 1]),
              groupName: group.name,
              score: [0, 0],
            }
          });
          
          return {
            ...group,
            matches: updatedMatches
          }
        })
      );
      setGroups(updatedGroups);
      setLoading(false);
      }catch(error){
        console.error('매치 정보를 불러오는데 실패했습니다.', error);
      }
      
    }
    fetchMatchInfo();
  }, [groups.length]);

  useEffect(() => {
    console.log("현재 groups 상태:", groups);
  }, [groups]);

  if(loading){
    return <div>로딩중...</div>;
  }
  return (
    <div className={styles.container}>
    {groups.map((group, groupIndex) => (
      <div key={groupIndex} className={styles.groupContainer}>
        <h2>{group.name}</h2>
        {group.matches.map((match, matchIndex) => (
          <div key={matchIndex} className={styles.match}>
            <div className={styles.title}>
              <span>{match.game}게임</span>
            </div>
            <div className={styles.teams}>
              <span>{match.team1.join(", ")}</span> vs <span>{match.team2.join(", ")}</span>
            </div>
            <div className={styles.scoreInputs}>
              <input
                type="number"
                min="0"
                value={match.score[0]}
                onChange={(e) => handleScoreChange(groupIndex, matchIndex, 0, e.target.value)}
              />
              :
              <input
                type="number"
                min="0"
                value={match.score[1]}
                onChange={(e) => handleScoreChange(groupIndex, matchIndex, 1, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    ))}
    <button onClick={onResultButtonClick}>결과보기</button>
  </div>
);
}

export default InputResult