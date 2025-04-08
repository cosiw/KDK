import React from 'react'
import { db } from '../../config/firebase';
import { collection,doc, addDoc, setDoc, getDoc, getDocs,  query, where, orderBy, deleteDoc } from 'firebase/firestore';
import {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './inputResult.module.css';
import ScoreInput from './ScoreInput';
import { eventSenderGA } from '../../tools/tools';

function InputResult() {
  // const {groupCount,peopleCount,matchId} = useParams();
  // const [matchInfoList, setMatchInfoList] = useState();
  // const playerCount = peopleCount.split("-").map(Number);

  const [groups, setGroups] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();
  const storageGroups = localStorage.getItem('groups');
  const{tournamentId} = useParams();
  
  useEffect(() => {
        
        const findData = async () => {
          const q = query(collection(db, `tournaments/${tournamentId}/groups`));
          const querySnapshot = await getDocs(q);
          if(querySnapshot.empty){
            alert("해당 대회가 없습니다.")
            navigate('/');
        }
          let data = [];
          querySnapshot.forEach((doc) => {
              data.push({id: doc.id, ...doc.data()});
          });
          return data;
        }
        const fetchData = async () => {
          let storedData = localStorage.getItem('groups');
          if(storedData) {
              storedData = JSON.parse(storedData);
          } else {
              const fetchedData = await findData();
              localStorage.setItem('groups', JSON.stringify(fetchedData));
              storedData = fetchedData;
          }
          
          setGroups(storedData);
        };
        
        fetchData();
    }, [tournamentId]);

    const findMatchData = async () => {
      let data = [];
      for(const group of groups) {
        const matchesRef = collection(db, `tournaments/${tournamentId}/groups/${group.name}/matches`);
        const queryMatchesSnapshot = await getDocs(matchesRef);

        for(const doc of queryMatchesSnapshot.docs) {
          data.push({id: doc.id, ...doc.data()});
        };
      }
      return data;

    }

    const fetchMatchInfo = async () => {
      try{
        const fetchedData = await findMatchData();
        if(storageGroups.length > 0 && fetchedData.length == 0){
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
                team1N: data.team1.map((index) => group.people[index - 1]), // 사람 이름으로 변경
                team2N: data.team2.map((index) => group.people[index - 1]),
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
        } else {
          
          const groupsMappingData = groups.map((group) => {
            const matches = fetchedData.filter(match => match.groupName === group.name).map(match => {
              
              return {
                game: match.game,
                team1: match.team1,
                team2: match.team2,
                team1N : match.team1.map((index) => group.people[index - 1]), // 사람 이름으로 변경
                team2N : match.team2.map((index) => group.people[index - 1]), // 사람 이름으로 변경
                score: match.score,
              }
            });
            return {
              ...group,
              matches: matches
            }
          });
          
          setGroups(groupsMappingData);
        }

      setLoading(false);
      }catch(error){
        console.error('매치 정보를 불러오는데 실패했습니다.', error);
      }
      
    }
  useEffect(() =>{
    if(groups.length === 0) return;
    fetchMatchInfo();

  }, [groups.length]);

  useEffect(() => {
    
  }, [groups]);

  const handleScoreChange = (groupIndex, matchIndex, scoreIndex, value) => {
    setGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      newGroups[groupIndex].matches[matchIndex].score[scoreIndex] = parseInt(value, 10) || 0;
      return newGroups;
    });

  };

  const onSaveButtonClick = async () => {
    try{
      
      groups.forEach(async (group) => {
        const groupDocId = group.name;
        const groupDocRef = doc(db, `tournaments/${tournamentId}/groups`, groupDocId);

        group.matches.forEach(async (match) => {
          const matchGameId = String(match.game);
          const matchDocId = groupDocId + matchGameId;
          const matchDocRef = doc(db, `tournaments/${tournamentId}/groups/${groupDocId}/matches`, matchDocId);
          

          await setDoc(matchDocRef, {
            game: match.game,
            team1: match.team1,
            team1N : match.team1N,
            team2: match.team2,
            team2N : match.team2N,
            score: match.score,
            groupName: group.name,
          }, {merge: true});
          
        });
      });

      alert("저장되었습니다.");
    }catch(error){
      console.error('결과를 저장하는데 실패했습니다.', error);
    }
    
  }
  
  const onBackButtonClick = () => {
    navigate(`/${tournamentId}`);
  }
  const onResultButtonClick = async () => {

  const deleteResultsCollection = async() => { 
    try{
      for(const group of groups) {
        const resultsRef = collection(db, `tournaments/${tournamentId}/groups/${group.name}/results`);
        const deleteQuerySnapshot = await getDocs(resultsRef);
        

        for(const doc of deleteQuerySnapshot.docs) {
          
          await deleteDoc(doc.ref);
        };
      }
      console.log("문서 삭제 완료:", tournamentId);
    }catch (error) {
        console.error("문서 삭제 실패:", error);
      }
    }

    const saveResult = () => {
      eventSenderGA("Paging", "Result", "InputResult");
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
  
        group?.matches?.map(match => {
          if(match.score &&
            match.score.length > 1 &&
            parseInt(match?.score[0]) > parseInt(match?.score[1])){ 
              resultBoard.forEach(playerResult => {
                if (playerResult.player.includes(match.team1N[0])) {
                  playerResult.score = playerResult.score +  match.score[0];
                  playerResult.win = playerResult.win + 1;
                }
                if (playerResult.player.includes(match.team1N[1])) {
                  playerResult.score = playerResult.score + match.score[0];
                  playerResult.win = playerResult.win + 1;
                }
                if (playerResult.player.includes(match.team2N[0])) {
                  playerResult.score = playerResult.score + match.score[1];
                  playerResult.lose = playerResult.lose + 1;
                }
                if (playerResult.player.includes(match.team2N[1])) {
                  playerResult.score = playerResult.score + match.score[1];
                  playerResult.lose = playerResult.lose + 1;
                }
              });
          }else if(match.score &&
            match.score.length > 1 &&
            parseInt(match?.score[0]) < parseInt(match?.score[1])){
              resultBoard.forEach(playerResult => {
                if (playerResult.player.includes(match.team1N[0])) {
                  playerResult.score = playerResult.score +  match.score[0];
                  playerResult.lose = playerResult.lose + 1;
                }
                if (playerResult.player.includes(match.team1N[1])) {
                  playerResult.score = playerResult.score + match.score[0];
                  playerResult.lose = playerResult.lose + 1;
                }
                if (playerResult.player.includes(match.team2N[0])) {
                  playerResult.score = playerResult.score + match.score[1];
                  playerResult.win = playerResult.win + 1;
                }
                if (playerResult.player.includes(match.team2N[1])) {
                  playerResult.score = playerResult.score + match.score[1];
                  playerResult.win = playerResult.win + 1;
                }
              });
            }
            else{
              resultBoard.forEach(playerResult => {
                if (playerResult.player.includes(match.team1N[0])) {
                  playerResult.score = playerResult.score +  match.score[0];
                  playerResult.draw = playerResult.draw + 1;
                }
                if (playerResult.player.includes(match.team1N[1])) {
                  playerResult.score = playerResult.score + match.score[0];
                  playerResult.draw = playerResult.draw + 1;
                }
                if (playerResult.player.includes(match.team2N[0])) {
                  playerResult.score = playerResult.score + match.score[1];
                  playerResult.draw = playerResult.draw + 1;
                }
                if (playerResult.player.includes(match.team2N[1])) {
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
            const groupDocId = result.groupName;
            const resultDocRef = doc(db, `tournaments/${tournamentId}/groups/${groupDocId}/results`, resultDocId);
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
    } 

    await deleteResultsCollection();
    await onSaveButtonClick();
    saveResult();
    navigate(`/${tournamentId}/match/result`)
    // player : "aa", score : 20, win : 3, lose : 1, draw : 1, rank : 1
  }



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
              {/* <span>{match.team1N.join(", ")}</span> vs <span>{match.team2N.join(", ")}</span> */}
              <span>{match.team1N[0]}({match.team1[0]}) {match.team1N[1]}({match.team1[1]})</span> vs 
              <span>{match.team2N[0]}({match.team2[0]}) {match.team2N[1]}({match.team2[1]})</span>
            </div>
            <div className={styles.scoreInputs}>
            <ScoreInput
                type="number"
                min="0"
                max="6"
                value={match.score[0]}
                onChange={(newScore) => handleScoreChange(groupIndex, matchIndex, 0, newScore)}
                />
              :
              <ScoreInput
                min= '0'
                max= "6"
                value={match.score[1]}
                onChange={(newScore) => handleScoreChange(groupIndex, matchIndex, 1, newScore)}
                />
            </div>
          </div>
        ))}
      </div>
    ))}
    <div className={styles.buttonDiv}>
      <button className = {styles.backButton} onClick={onBackButtonClick}>뒤로가기</button>
      <button className = {styles.saveButton} onClick={onSaveButtonClick}>저장하기</button>
      <button className = {styles.resultButton}onClick={onResultButtonClick}>결과보기</button>
    </div>
  </div>
);
}

export default InputResult