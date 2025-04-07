import React from "react";
import { db } from '../../config/firebase';
import { collection,doc, addDoc, setDoc, getDoc, getDocs,  query, where, orderBy, deleteDoc } from 'firebase/firestore';
import {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './gameResult.module.css';
function GameResult() {

  const [groups, setGroups] = useState({});
  const{tournamentId} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const groups = [];
    const results = [];
    
    const findData = async () => {
      const q = query(collection(db, `tournaments/${tournamentId}/groups`));
      const querySnapshot = await getDocs(q);
      if(querySnapshot.empty){
        alert("해당 대회가 없습니다.")
        navigate('/');
      } 

      for(const groupDoc of querySnapshot.docs){
        const groupName = groupDoc.id;
        
        const resultRef = collection(db, `tournaments/${tournamentId}/groups/${groupName}/results`);
        const resultSnapshot = await getDocs(resultRef);
        groups[groupName] = resultSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
                
      }

      setGroups(groups);
      
      
    }
    findData();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🏆 대회 결과</h2>

      {Object.entries(groups).map(([groupName, results]) => (
        <div key={groupName} className={styles.group}>
          <h3 className={styles.groupTitle}>{groupName}</h3>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>순위</th>
                <th>선수</th>
                <th>승</th>
                <th>무</th>
                <th>패</th>
                <th>점수</th>
              </tr>
            </thead>
            <tbody>
              {results
                .sort((a, b) => a.rank - b.rank) // 순위 정렬
                .map((result) => (
                  <tr key={result.id}>
                    <td>{result.rank}</td>
                    <td>{result.player}</td>
                    <td>{result.win}</td>
                    <td>{result.draw}</td>
                    <td>{result.lose}</td>
                    <td>{result.score}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default GameResult