import React from 'react'
import styles from './inputPlayer.module.css'
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { db } from '../../config/firebase';
import { collection,doc, setDoc, getDocs,  query, where, orderBy } from 'firebase/firestore';


function InputPlayer() {
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();
    
    const{tournamentId} = useParams();

    const onButtonClick = async ()=> {
        try{
            const tournamentDocRef = doc(db, "tournaments", tournamentId);
            await setDoc(tournamentDocRef, {
            tournamentId: tournamentId,
            }, {merge: true});

            groups.forEach(async (group) => {
                const groupDocId = group.name;
                const groupDocRef = doc(db, `tournaments/${tournamentId}/groups`, groupDocId);
                console.log("groupDocId : ", groupDocId);
                await setDoc(groupDocRef, {
                    name: group.name,
                    peopleCount: group.peopleCount,
                    people: group.people,
                }, {merge: true});
            })
            }catch(error){
                console.error("Error adding document: ", error);
            }
            
        localStorage.setItem('groups', JSON.stringify(groups));
        
        navigate(`/${tournamentId}/match`);
    }

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
            console.log("data :", data);
            return data;
        }

        console.log(findData);

        const fetchData = async () => {
            let storedData = localStorage.getItem('groups');
            if(storedData) {
                storedData = JSON.parse(storedData);
            } else {
                const fetchedData = await findData();
                localStorage.setItem('groups', JSON.stringify(fetchedData));
                storedData = fetchedData;
            }
            console.log(storedData);
            setGroups(storedData);
        };
        
        fetchData();
    }, [tournamentId]);

    const handlePeopleChange = (groupIndex, playerIndex, value) => {
        setGroups(prevGroups => {
            const newGroups = [...prevGroups];

            // group.people 배열이 없는 경우 초기화
            if (!newGroups[groupIndex].people) {
                newGroups[groupIndex].people = [];
            }
            newGroups[groupIndex].people[playerIndex] = value;
            return newGroups;
        });
    };

    return (
    <div className={styles.container}>
    <h1> 선수 이름을 적어주세요. </h1>
    {groups.map((group, groupIndex) => (
        <div key={groupIndex} className = {styles.group}>
            <h3>{group.name}</h3>
            {Array.from({length : group.peopleCount}, (_, playerIndex) => (
                <div key = {playerIndex} className={styles.nameDiv}>
                    <p>{playerIndex+1}번</p> 
                    <input 
                        className={styles.input}
                        value = {group.people ? group.people[playerIndex] : ""}
                        onChange={(e) => handlePeopleChange(groupIndex, playerIndex, e.target.value)}></input>
                </div>
            ))}
        </div>
    ))}
        <div>
        <button className ={styles.inputButton} onClick={() => onButtonClick()}>입력</button>        
        </div>
    </div>
  )
  
}

export default InputPlayer