import React from 'react'
import { db } from '../../config/firebase';
import { collection,doc, addDoc, setDoc, getDoc, getDocs,  query, where, orderBy } from 'firebase/firestore';
import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './inputResult.module.css';

function InputResult() {
  // const {groupCount,peopleCount,matchId} = useParams();
  // const [matchInfoList, setMatchInfoList] = useState();
  // const playerCount = peopleCount.split("-").map(Number);

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();
  const handleScoreChange = (groupIndex, matchIndex, scoreIndex, value) => {
    setGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      newGroups[groupIndex].matches[matchIndex].score[scoreIndex] = parseInt(value, 10) || 0;
      return newGroups;
    });

    console.log(groups);
  };

  const onSaveButtonClick = async () => {
    const tournamentId = localStorage.getItem('tournamentId');
    const groupCount = localStorage.getItem('groupCount');
  
    try{
      const tournamentDocRef = doc(db, "tournaments", tournamentId);
      await setDoc(tournamentDocRef, {
        tournamentId: tournamentId,
        groupCount : groupCount,
      });
      
      groups.forEach(async (group) => {
        const groupDocId = group.name;
        const groupDocRef = doc(db, `tournaments/${tournamentId}/groups`, groupDocId);
        console.log("groupDocId : ", groupDocId);
          await setDoc(groupDocRef, {
            name: group.name,
            peopleCount: group.peopleCount,
            people: group.people,
          }, {merge: true});

        group.matches.forEach(async (match) => {
          const matchGameId = String(match.game);
          const matchDocId = groupDocId + matchGameId;
          const matchDocRef = doc(db, `tournaments/${tournamentId}/matches`, matchDocId);
          console.log("matchDocId : ",matchDocId);

          await setDoc(matchDocRef, {
            game: match.game,
            team1: match.team1,
            team2: match.team2,
            score: match.score,
            groupName: group.name,
          }, {merge: true});
          
        });
      });

    }catch(error){
      console.error('결과를 저장하는데 실패했습니다.', error);
    }
    
  }

  const onResultButtonClick = () => {
    const tournamentId = localStorage.getItem('tournamentId');

    groups.map(group => {
      
      let resultBoard = group.people.map(player => {
        return{
        groupName : group.name,
        player : player,
        score : 0,
        win : 0,
        lose : 0,
        draw : 0,
        rank : 0
        }
        
      });

      console.log("resultBoard : ", resultBoard);

      group?.matches?.map(match => {
        
        if(match.score &&
          match.score.length > 1 &&
          parseInt(match?.score[0]) > parseInt(match?.score[1])){ 
            resultBoard.forEach(playerResult => {
              if (playerResult.player.includes(match.team1[0])) {
                playerResult.score = playerResult.score +  match.score[0];
                playerResult.win = playerResult.win + 1;
              }
              if (playerResult.player.includes(match.team1[1])) {
                playerResult.score = playerResult.score + match.score[0];
                playerResult.win = playerResult.win + 1;
              }
              if (playerResult.player.includes(match.team2[0])) {
                playerResult.score = playerResult.score + match.score[1];
                playerResult.lose = playerResult.lose + 1;
              }
              if (playerResult.player.includes(match.team2[1])) {
                playerResult.score = playerResult.score + match.score[1];
                playerResult.lose = playerResult.lose + 1;
              }
            });
        }else if(match.score &&
          match.score.length > 1 &&
          parseInt(match?.score[0]) < parseInt(match?.score[1])){
            resultBoard.forEach(playerResult => {
              if (playerResult.player.includes(match.team1[0])) {
                playerResult.score = playerResult.score +  match.score[0];
                playerResult.lose = playerResult.lose + 1;
              }
              if (playerResult.player.includes(match.team1[1])) {
                playerResult.score = playerResult.score + match.score[0];
                playerResult.lose = playerResult.lose + 1;
              }
              if (playerResult.player.includes(match.team2[0])) {
                playerResult.score = playerResult.score + match.score[1];
                playerResult.win = playerResult.win + 1;
              }
              if (playerResult.player.includes(match.team2[1])) {
                playerResult.score = playerResult.score + match.score[1];
                playerResult.win = playerResult.win + 1;
              }
            });
          }
          else{
            resultBoard.forEach(playerResult => {
              if (playerResult.player.includes(match.team1[0])) {
                playerResult.score = playerResult.score +  match.score[0];
                playerResult.draw = playerResult.draw + 1;
              }
              if (playerResult.player.includes(match.team1[1])) {
                playerResult.score = playerResult.score + match.score[0];
                playerResult.draw = playerResult.draw + 1;
              }
              if (playerResult.player.includes(match.team2[0])) {
                playerResult.score = playerResult.score + match.score[1];
                playerResult.draw = playerResult.draw + 1;
              }
              if (playerResult.player.includes(match.team2[1])) {
                playerResult.score = playerResult.score + match.score[1];
                playerResult.draw = playerResult.draw + 1;
              }
            });
          }
      })

      resultBoard.sort((a, b) => {
        if (a.win !== b.win) {
          return b.win - a.win; // win 기준 내림차순
        }
        return b.score - a.score; // win이 같을 경우 score 기준 내림차순
      });

      resultBoard = resultBoard.map((playerResult, index) => ({
        ...playerResult,
        rank: index + 1 // 인덱스는 0부터 시작하므로 1을 더해 순위를 매깁니다.
      }));

      try{

        resultBoard.forEach(async (result) => {
          const resultDocId = result.groupName + result.player;
          const resultDocRef = doc(db, `tournaments/${tournamentId}/results`, resultDocId);
          await setDoc(resultDocRef, {
            groupName : result.groupName,
              player: result.player,
              score: result.score,
              win: result.win,
              lose: result.lose,
              draw: result.draw,
              rank: result.rank
          }, {merge: true});
          
        })
      }catch(error){
        console.error('결과를 저장하는 데 실패하였습니다.', error);
      }

    })
    //navigate(`/${tournamentId}/match/result`)
    // player : "aa", score : 20, win : 3, lose : 1, draw : 1, rank : 1
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
    <button onClick={onSaveButtonClick}>저장하기</button>
    <button onClick={onResultButtonClick}>결과보기</button>
  </div>
);
}

export default InputResult