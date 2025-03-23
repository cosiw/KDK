import React from 'react'
import {GAMES} from '../../data/GAMES';
import { db } from '../../config/firebase';
import { collection, addDoc, getDocs,  query, where } from 'firebase/firestore';
import {useEffect} from 'react';
import { useParams } from 'react-router-dom';

function InputResult() {
  const {groupCount,peopleCount,matchId} = useParams();
  const playerCount = peopleCount.split("-").map(Number);
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
  useEffect(() =>{
    console.log("EFFEFCT!");

    const fetchMatches = async (matchId) => {
      try {
        const q = query(collection(db, 'matches'), where('matchId', '==', matchId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          console.log(`fetchMatches : ${doc.id} => `, doc.data());
        });
      } catch (error) {
        console.error('Error fetching matches by matchId:', error);
      }
    }

    const fetchGames = async() => {
      try{
        const q = query(collection(db, 'games'), where('number', '==', playerCount[0]));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          console.log(`fetchGames : ${doc.id} => `, doc.data());
        });
      }catch (error) {
        console.error('Error fetching Games by people:', error);
      }
    }

    fetchMatches(matchId);
    fetchGames();
   
  }, [matchId]);
  return (
    <button onClick={() => onSaveButtonClick()}>button</button>
  )
}

export default InputResult